import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import { cacheDelete, cacheGet, cacheSet, useRedisClient } from './index'

export type AdminResource =
  | 'api_key'
  | 'configuration'
  | 'plugin'
  | 'role'
  | 'user'
  | 'user_group'
  | 'workplace'
  | 'media'

type CacheType = 'list' | 'count' | 'detail'

const ADMIN_CACHE_PREFIX = 'admin'
const ADMIN_LIST_SET_PREFIX = 'admin:list_keys'
const ADMIN_COUNT_SET_PREFIX = 'admin:count_keys'

function resolveAdminCacheTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.adminTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

function normalizeIdentifier(identifier?: string) {
  return identifier && identifier.length > 0 ? identifier : 'default'
}

function buildAdminCacheKey(
  resource: AdminResource,
  type: CacheType,
  identifier?: string,
) {
  const segments = [ADMIN_CACHE_PREFIX, resource, type]

  if (type === 'detail') {
    if (!identifier) {
      throw new Error('Missing identifier for admin detail cache key')
    }
    segments.push(identifier)
  } else if (identifier) {
    segments.push(identifier)
  }

  return segments.join(':')
}

async function rememberListKey(
  resource: AdminResource,
  key: string,
  ttl: number,
) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const setKey = [ADMIN_LIST_SET_PREFIX, resource].join(':')
  await redis.sadd(setKey, key)
  await redis.expire(setKey, Math.max(ttl * 2, ttl))
}

async function clearListKeys(resource: AdminResource) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const setKey = [ADMIN_LIST_SET_PREFIX, resource].join(':')
  const members = await redis.smembers(setKey)

  if (members.length > 0) {
    await redis.del(...members)
  }

  await redis.del(setKey)
}

async function rememberCountKey(
  resource: AdminResource,
  key: string,
  ttl: number,
) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const setKey = [ADMIN_COUNT_SET_PREFIX, resource].join(':')
  await redis.sadd(setKey, key)
  await redis.expire(setKey, Math.max(ttl * 2, ttl))
}

async function clearCountKeys(resource: AdminResource) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const setKey = [ADMIN_COUNT_SET_PREFIX, resource].join(':')
  const members = await redis.smembers(setKey)

  if (members.length > 0) {
    await redis.del(...members)
  }

  await redis.del(setKey)
}

async function resolveAdminCache<T>(
  event: H3Event,
  key: string,
  loader: () => Promise<T>,
  onCacheAccess?: (ttl: number) => Promise<void>,
) {
  const ttl = resolveAdminCacheTtl(event)

  if (!ttl) {
    return await loader()
  }

  const cached = await cacheGet<T>(key)
  if (cached !== null) {
    if (onCacheAccess) {
      await onCacheAccess(ttl)
    }
    return cached
  }

  const value = await loader()

  if (value !== undefined) {
    await cacheSet(key, value, { ttl })

    if (onCacheAccess) {
      await onCacheAccess(ttl)
    }
  }

  return value
}

export async function fetchAdminList<T>(
  event: H3Event,
  resource: AdminResource,
  loader: () => Promise<T>,
  options: { identifier?: string } = {},
) {
  const identifier = normalizeIdentifier(options.identifier)
  const key = buildAdminCacheKey(resource, 'list', identifier)
  return await resolveAdminCache(event, key, loader, async (ttl) => {
    await rememberListKey(resource, key, ttl)
  })
}

export async function fetchAdminCount<T>(
  event: H3Event,
  resource: AdminResource,
  loader: () => Promise<T>,
  options: { identifier?: string } = {},
) {
  const identifier = normalizeIdentifier(options.identifier)
  const key = buildAdminCacheKey(resource, 'count', identifier)
  return await resolveAdminCache(event, key, loader, async (ttl) => {
    await rememberCountKey(resource, key, ttl)
  })
}

export async function fetchAdminDetail<T>(
  event: H3Event,
  resource: AdminResource,
  id: string,
  loader: () => Promise<T>,
) {
  const key = buildAdminCacheKey(resource, 'detail', id)
  return await resolveAdminCache(event, key, loader)
}

export async function invalidateAdminList(resource: AdminResource) {
  await clearListKeys(resource)
}

export async function invalidateAdminCount(resource: AdminResource) {
  await clearCountKeys(resource)
}

export async function invalidateAdminDetail(
  resource: AdminResource,
  id: string,
) {
  const key = buildAdminCacheKey(resource, 'detail', id)
  await cacheDelete(key)
}

export async function invalidateAdminCollection(resource: AdminResource) {
  await Promise.all([
    invalidateAdminList(resource),
    invalidateAdminCount(resource),
  ])
}
