import { createHash } from 'node:crypto'

import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import { cacheDelete, cacheGet, cacheSet, useRedisClient } from './index'

export type BlogResource = 'blog' | 'post' | 'tag' | 'comment'

type CacheType = 'list' | 'count' | 'detail'

const BLOG_CACHE_PREFIX = 'blog'
const BLOG_LIST_SET_PREFIX = 'blog:list_keys'

function resolveBlogCacheTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.blogTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

function buildBlogCacheKey(
  resource: BlogResource,
  type: CacheType,
  identifier: string,
) {
  return [BLOG_CACHE_PREFIX, resource, type, identifier].join(':')
}

function hashQuery(queryString: string) {
  if (!queryString) {
    return 'default'
  }

  return createHash('sha1').update(queryString).digest('hex')
}

async function rememberListKey(
  resource: BlogResource,
  key: string,
  ttl: number,
) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const setKey = [BLOG_LIST_SET_PREFIX, resource].join(':')
  await redis.sadd(setKey, key)

  const setTtl = Math.max(ttl * 2, ttl)
  await redis.expire(setKey, setTtl)
}

async function clearListKeys(resource: BlogResource) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const setKey = [BLOG_LIST_SET_PREFIX, resource].join(':')
  const members = await redis.smembers(setKey)

  if (members.length > 0) {
    await redis.del(...members)
  }

  await redis.del(setKey)
}

async function resolveBlogCache<T>(
  event: H3Event,
  key: string,
  loader: () => Promise<T>,
  onStore?: (ttl: number) => Promise<void>,
) {
  const ttl = resolveBlogCacheTtl(event)

  if (!ttl) {
    return await loader()
  }

  const cached = await cacheGet<T>(key)
  if (cached !== null) {
    return cached
  }

  const value = await loader()

  if (value !== undefined) {
    await cacheSet(key, value, { ttl })

    if (onStore) {
      await onStore(ttl)
    }
  }

  return value
}

export async function fetchBlogList<T>(
  event: H3Event,
  resource: BlogResource,
  queryString: string,
  loader: () => Promise<T>,
) {
  const identifier = hashQuery(queryString)
  const key = buildBlogCacheKey(resource, 'list', identifier)
  return await resolveBlogCache(event, key, loader, async (ttl) => {
    await rememberListKey(resource, key, ttl)
  })
}

export async function fetchBlogCount<T>(
  event: H3Event,
  resource: BlogResource,
  loader: () => Promise<T>,
) {
  const key = buildBlogCacheKey(resource, 'count', 'total')
  return await resolveBlogCache(event, key, loader)
}

export async function fetchBlogDetail<T>(
  event: H3Event,
  resource: BlogResource,
  id: string,
  loader: () => Promise<T>,
) {
  const key = buildBlogCacheKey(resource, 'detail', id)
  return await resolveBlogCache(event, key, loader)
}

export async function invalidateBlogList(resource: BlogResource) {
  await clearListKeys(resource)
}

export async function invalidateBlogCount(resource: BlogResource) {
  const key = buildBlogCacheKey(resource, 'count', 'total')
  await cacheDelete(key)
}

export async function invalidateBlogDetail(resource: BlogResource, id: string) {
  const key = buildBlogCacheKey(resource, 'detail', id)
  await cacheDelete(key)
}

export async function invalidateBlogCollection(resource: BlogResource) {
  await Promise.all([
    invalidateBlogList(resource),
    invalidateBlogCount(resource),
  ])
}
