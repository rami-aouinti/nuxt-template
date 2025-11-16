import { createHash } from 'node:crypto'

import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import { cacheGet, cacheSet } from './index'

const CACHE_PREFIX = 'ecommerce'
const CACHE_SCOPE = 'linked'

function resolveLinkedResourceTtl(event: H3Event) {
  const config = useRuntimeConfig(event)
  const ttl =
    Number(config.redis?.ecommerceLinkedResourceTtl ?? config.redis?.ecommerceTtl ?? 0) || 0
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

function buildCacheKey(path: string, acceptLanguage: string) {
  const hash = createHash('sha1')
  hash.update(JSON.stringify([path, acceptLanguage]))
  return `${CACHE_PREFIX}:${CACHE_SCOPE}:${hash.digest('hex')}`
}

export async function getCachedLinkedResource<T>(
  event: H3Event,
  path: string,
  acceptLanguage: string,
) {
  const ttl = resolveLinkedResourceTtl(event)
  if (!ttl) {
    return null
  }

  const cacheKey = buildCacheKey(path, acceptLanguage)
  return await cacheGet<T>(cacheKey)
}

export async function setCachedLinkedResource<T>(
  event: H3Event,
  path: string,
  acceptLanguage: string,
  value: T,
) {
  const ttl = resolveLinkedResourceTtl(event)
  if (!ttl) {
    return
  }

  const cacheKey = buildCacheKey(path, acceptLanguage)
  await cacheSet(cacheKey, value, { ttl })
}
