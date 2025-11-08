import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import type { BlogPostListResponse } from '~/types/blog'

import { cacheGet, cacheSet, useRedisClient } from './index'
import { resolveUserCacheKey } from './helpers'

const PROFILE_POSTS_CACHE_PREFIX = 'profile:posts'
const PROFILE_POSTS_INDEX_PREFIX = 'profile:posts:index'

function buildCacheKey(identifier: string, page: number, limit: number) {
  return `${PROFILE_POSTS_CACHE_PREFIX}:${identifier}:page:${page}:limit:${limit}`
}

function buildIndexKey(identifier: string) {
  return `${PROFILE_POSTS_INDEX_PREFIX}:${identifier}`
}

function resolveProfilePostsTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.profilePostsTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

async function rememberProfilePostsKey(
  identifier: string,
  key: string,
  ttl: number,
) {
  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const indexKey = buildIndexKey(identifier)
  await redis.sadd(indexKey, key)
  await redis.expire(indexKey, Math.max(ttl * 2, ttl))
}

export async function fetchProfilePosts(
  event: H3Event,
  page: number,
  limit: number,
  loader: () => Promise<BlogPostListResponse>,
) {
  const identifier = await resolveUserCacheKey(event)
  const ttl = resolveProfilePostsTtl(event)

  if (!identifier || !ttl) {
    return await loader()
  }

  const key = buildCacheKey(identifier, page, limit)
  const cached = await cacheGet<BlogPostListResponse>(key)

  if (cached) {
    return cached
  }

  const posts = await loader()

  if (posts) {
    await cacheSet(key, posts, { ttl })
    await rememberProfilePostsKey(identifier, key, ttl)
  }

  return posts
}

export async function invalidateProfilePosts(event: H3Event) {
  const identifier = await resolveUserCacheKey(event)

  if (!identifier) {
    return
  }

  const redis = await useRedisClient()
  if (!redis) {
    return
  }

  const indexKey = buildIndexKey(identifier)
  const members = await redis.smembers(indexKey)

  if (members.length > 0) {
    await redis.del(...members)
  }

  await redis.del(indexKey)
}
