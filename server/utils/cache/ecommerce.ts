import { createHash } from 'node:crypto'

import { useRuntimeConfig } from '#imports'
import { getHeader, type H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'

import { cacheGet, cacheSet } from './index'
import { resolveUserCacheKey } from './helpers'

type HeadersInput = FetchOptions<'json'>['headers']

type QueryInput = FetchOptions<'json'>['query']

type ParamsInput = FetchOptions<'json'>['params']

const CACHE_PREFIX = 'ecommerce'
const CACHE_SCOPE = 'response'

function resolveEcommerceCacheTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.ecommerceTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

function normalizeHeaders(headers?: HeadersInput): Record<string, string> {
  const normalized: Record<string, string> = {}

  if (!headers) {
    return normalized
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value
    })
    return normalized
  }

  if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      normalized[String(key).toLowerCase()] = String(value)
    }
    return normalized
  }

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined || value === null) {
      continue
    }

    normalized[key.toLowerCase()] = String(value)
  }

  return normalized
}

function appendQueryValue(params: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null) {
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryValue(params, key, item)
    }
    return
  }

  if (typeof value === 'object') {
    params.append(key, JSON.stringify(value))
    return
  }

  params.append(key, String(value))
}

function serializeQuery(query?: QueryInput) {
  if (!query) {
    return ''
  }

  if (typeof query === 'string') {
    return query.startsWith('?') ? query.slice(1) : query
  }

  const params = new URLSearchParams()
  const entries = Object.entries(query).sort(([a], [b]) => a.localeCompare(b))
  for (const [key, value] of entries) {
    appendQueryValue(params, key, value)
  }

  return params.toString()
}

function serializeParams(params?: ParamsInput) {
  if (!params) {
    return ''
  }

  const entries = Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}

function buildCacheKeyHash(segments: unknown[]) {
  const hash = createHash('sha1')
  hash.update(JSON.stringify(segments))
  return hash.digest('hex')
}

function buildCacheKey(segments: unknown[]) {
  return [CACHE_PREFIX, CACHE_SCOPE, buildCacheKeyHash(segments)].join(':')
}

export async function fetchEcommerceResponse<T>(
  event: H3Event,
  baseUrl: string,
  path: string,
  options: FetchOptions<'json'>,
  loader: () => Promise<T>,
) {
  const method = String(options.method || 'GET').toUpperCase()

  if (method !== 'GET') {
    return await loader()
  }

  const ttl = resolveEcommerceCacheTtl(event)

  if (!ttl) {
    return await loader()
  }

  const headers = normalizeHeaders(options.headers)
  const acceptLanguage =
    headers['accept-language'] || getHeader(event, 'accept-language') || ''

  const userKey = (await resolveUserCacheKey(event)) || 'anonymous'
  const query = serializeQuery(options.query)
  const params = serializeParams(options.params)

  const cacheKey = buildCacheKey([
    baseUrl,
    path,
    query,
    params,
    acceptLanguage,
    userKey,
  ])

  const cached = await cacheGet<T>(cacheKey)
  if (cached !== null) {
    return cached
  }

  const value = await loader()

  if (value !== undefined) {
    await cacheSet(cacheKey, value, { ttl })
  }

  return value
}
