import type { H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'

import { broWorldEcommerceRequest } from '../broWorldEcommerceApi'

type UnknownRecord = Record<string, unknown>

interface HydrationOptions {
  headers?: FetchOptions<'json'>['headers']
}

const API_V2_PREFIX = '/api/v2'
const API_PREFIX = '/api'

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function normalizeEcommercePath(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null
  }

  let value = input.trim()
  if (!value) {
    return null
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      value = `${url.pathname}${url.search}`
    } catch {
      return null
    }
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

type LinkedResourceResolver = (value: unknown) => Promise<unknown>

function createLinkedResourceResolver(
  event: H3Event,
  options: HydrationOptions = {},
): LinkedResourceResolver {
  const cache = new Map<string, Promise<unknown>>()

  return async function resolveLinkedResource(value: unknown): Promise<unknown> {
    if (value === null || value === undefined) {
      return value
    }

    if (typeof value === 'object') {
      return value
    }

    if (typeof value !== 'string') {
      return value
    }

    const path = normalizeEcommercePath(value)
    if (!path) {
      return value
    }

    let loader = cache.get(path)
    if (!loader) {
      loader = broWorldEcommerceRequest(event, path, {
        headers: options.headers,
      }).catch((error) => {
        console.error(`[ecommerce] Échec du chargement de la ressource ${path}`, error)
        cache.delete(path)
        return value
      })

      cache.set(path, loader)
    }

    return await loader
  }
}

async function hydrateShipmentEntry(
  entry: unknown,
  resolveLinkedResource: LinkedResourceResolver,
): Promise<unknown> {
  if (!isRecord(entry)) {
    return entry
  }

  const hydratedEntry: UnknownRecord = { ...entry }

  if ('order' in hydratedEntry) {
    hydratedEntry.order = await resolveLinkedResource(hydratedEntry.order)
  }

  if ('method' in hydratedEntry) {
    hydratedEntry.method = await resolveLinkedResource(hydratedEntry.method)
  }

  if (Array.isArray(hydratedEntry.units)) {
    hydratedEntry.units = await Promise.all(
      (hydratedEntry.units as unknown[]).map((unit) => resolveLinkedResource(unit)),
    )
  }

  return hydratedEntry
}

export async function hydrateShipmentCollectionResponse(
  event: H3Event,
  payload: unknown,
  options: HydrationOptions = {},
) {
  if (!isRecord(payload)) {
    return payload
  }

  const members = Array.isArray(payload['hydra:member'])
    ? (payload['hydra:member'] as unknown[])
    : null

  if (!members?.length) {
    return payload
  }

  const resolveLinkedResource = createLinkedResourceResolver(event, options)
  const hydratedMembers = await Promise.all(
    members.map((entry) => hydrateShipmentEntry(entry, resolveLinkedResource)),
  )

  return {
    ...payload,
    'hydra:member': hydratedMembers,
  }
}

export async function hydrateShipmentRecordResponse(
  event: H3Event,
  payload: unknown,
  options: HydrationOptions = {},
) {
  const resolveLinkedResource = createLinkedResourceResolver(event, options)
  return await hydrateShipmentEntry(payload, resolveLinkedResource)
}
