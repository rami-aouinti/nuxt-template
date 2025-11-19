import { getHeader, type H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'

import {
  broWorldEcommerceRawRequest,
  getEcommerceAcceptLanguage,
  getEcommerceOrigin,
} from '../broWorldEcommerceApi'
import {
  getCachedLinkedResource,
  setCachedLinkedResource,
} from '../cache/ecommerceLinkedResources'

const API_V2_PREFIX = '/api/v2'
const API_PREFIX = '/api'
const DEFAULT_MAX_LINK_DEPTH = 4

interface HydrationOptions {
  headers?: FetchOptions<'json'>['headers']
  maxLinkDepth?: number
}

interface HydrationContext {
  event: H3Event
  headers?: FetchOptions<'json'>['headers']
  acceptLanguage: string
  maxLinkDepth: number
  pending: Map<string, Promise<unknown>>
  activePaths: Set<string>
  origin: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function normalizeLinkedPath(input: string, origin: string): string | null {
  let value = input.trim()
  if (!value) {
    return null
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      if (url.origin !== origin) {
        return null
      }
      value = `${url.pathname}${url.search}`
    } catch {
      return null
    }
  }

  if (!value.startsWith('/')) {
    return null
  }

  if (value.startsWith(API_V2_PREFIX)) {
    value = value.slice(API_V2_PREFIX.length)
  } else if (value.startsWith(API_PREFIX)) {
    value = value.slice(API_PREFIX.length)
  }

  if (!value.startsWith('/')) {
    value = `/${value}`
  }

  return value
}

function resolveAcceptLanguage(
  event: H3Event,
  headers?: FetchOptions<'json'>['headers'],
): string {
  if (headers instanceof Headers) {
    return (
      headers.get('accept-language') || getEcommerceAcceptLanguage(event) || ''
    )
  }

  if (Array.isArray(headers)) {
    const header = headers.find(
      ([key]) => String(key).toLowerCase() === 'accept-language',
    )
    if (header) {
      return String(header[1])
    }
    return getEcommerceAcceptLanguage(event) || ''
  }

  if (headers && typeof headers === 'object') {
    const normalizedHeaders = headers as Record<string, unknown>
    const rawValue =
      normalizedHeaders['Accept-Language'] ??
      normalizedHeaders['accept-language']
    if (typeof rawValue === 'string') {
      return rawValue
    }
  }

  return (
    getEcommerceAcceptLanguage(event) ||
    getHeader(event, 'accept-language') ||
    ''
  )
}

function createHydrationContext(
  event: H3Event,
  options: HydrationOptions,
): HydrationContext {
  const acceptLanguage = resolveAcceptLanguage(event, options.headers)
  return {
    event,
    headers: options.headers,
    acceptLanguage,
    maxLinkDepth: options.maxLinkDepth ?? DEFAULT_MAX_LINK_DEPTH,
    pending: new Map(),
    activePaths: new Set(),
    origin: getEcommerceOrigin(event),
  }
}

async function hydrateArray(
  context: HydrationContext,
  value: unknown[],
  depth: number,
): Promise<unknown[]> {
  return await Promise.all(
    value.map((entry) => hydrateValue(context, entry, depth)),
  )
}

async function hydrateRecord(
  context: HydrationContext,
  record: Record<string, unknown>,
  depth: number,
) {
  const entries = await Promise.all(
    Object.entries(record).map(async ([key, entryValue]) => {
      if (key.startsWith('@')) {
        return [key, entryValue]
      }

      return [key, await hydrateValue(context, entryValue, depth)]
    }),
  )

  return Object.fromEntries(entries)
}

async function loadLinkedResource(context: HydrationContext, path: string) {
  const cached = await getCachedLinkedResource(
    context.event,
    path,
    context.acceptLanguage,
  )
  if (cached !== null) {
    return cached
  }

  let loader = context.pending.get(path)
  if (!loader) {
    loader = (async () => {
      try {
        const result = await broWorldEcommerceRawRequest(context.event, path, {
          headers: context.headers,
        })
        await setCachedLinkedResource(
          context.event,
          path,
          context.acceptLanguage,
          result,
        )
        return result
      } finally {
        context.pending.delete(path)
      }
    })().catch((error) => {
      console.error(
        `[ecommerce] unable to hydrate linked resource ${path}`,
        error,
      )
      throw error
    })

    context.pending.set(path, loader)
  }

  return await loader
}

async function hydrateLinkedValue(
  context: HydrationContext,
  value: string,
  depth: number,
): Promise<unknown> {
  if (depth <= 0) {
    return value
  }

  const path = normalizeLinkedPath(value, context.origin)
  if (!path) {
    return value
  }

  if (context.activePaths.has(path)) {
    return value
  }

  context.activePaths.add(path)
  try {
    const resource = await loadLinkedResource(context, path)
    return await hydrateValue(context, resource, depth - 1)
  } catch {
    return value
  } finally {
    context.activePaths.delete(path)
  }
}

async function hydrateValue(
  context: HydrationContext,
  value: unknown,
  depth: number,
): Promise<unknown> {
  if (Array.isArray(value)) {
    return await hydrateArray(context, value, depth)
  }

  if (isRecord(value)) {
    return await hydrateRecord(context, value, depth)
  }

  if (typeof value === 'string') {
    return await hydrateLinkedValue(context, value, depth)
  }

  return value
}

export async function hydrateEcommercePayload(
  event: H3Event,
  payload: unknown,
  options: HydrationOptions = {},
) {
  const context = createHydrationContext(event, options)
  if (!context.maxLinkDepth) {
    return payload
  }

  return await hydrateValue(context, payload, context.maxLinkDepth)
}
