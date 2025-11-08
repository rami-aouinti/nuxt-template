import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import { cacheGet, cacheSet } from './index'

const PUBLIC_PROFILE_CACHE_PREFIX = 'profile:public'

function buildCacheKey(username: string) {
  return `${PUBLIC_PROFILE_CACHE_PREFIX}:${username}`
}

function normalizeUsername(value: string) {
  return value.trim().toLowerCase()
}

function resolvePublicProfileTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.profilePublicTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

export async function fetchPublicProfile<T>(
  event: H3Event,
  username: string,
  loader: () => Promise<T>,
) {
  const normalized = normalizeUsername(username)
  const ttl = resolvePublicProfileTtl(event)

  if (!normalized || !ttl) {
    return await loader()
  }

  const key = buildCacheKey(normalized)
  const cached = await cacheGet<T>(key)

  if (cached !== null) {
    return cached
  }

  const value = await loader()

  if (value !== undefined) {
    await cacheSet(key, value, { ttl })
  }

  return value
}
