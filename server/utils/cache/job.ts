import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import { cacheDelete, cacheGet, cacheSet } from './index'

const JOB_LIST_CACHE_KEY = 'job:list:platform'

function resolveJobCacheTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.jobTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

export async function fetchJobListings<T>(
  event: H3Event,
  loader: () => Promise<T>,
) {
  const ttl = resolveJobCacheTtl(event)

  if (!ttl) {
    return await loader()
  }

  const cached = await cacheGet<T>(JOB_LIST_CACHE_KEY)
  if (cached !== null) {
    return cached
  }

  const value = await loader()

  if (value !== undefined) {
    await cacheSet(JOB_LIST_CACHE_KEY, value, { ttl })
  }

  return value
}

export async function invalidateJobListings() {
  await cacheDelete(JOB_LIST_CACHE_KEY)
}
