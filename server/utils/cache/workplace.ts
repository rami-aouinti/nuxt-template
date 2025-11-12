import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import type { Workplace } from '~/types/workplace'

import { cacheDelete, cacheGet, cacheSet } from './index'
import { resolveUserCacheKey } from './helpers'

const WORKPLACE_CACHE_PREFIX = 'workplace:list'

function buildCacheKey(identifier: string) {
  return `${WORKPLACE_CACHE_PREFIX}:${identifier}`
}

function resolveWorkplaceTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.workplaceTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

export async function fetchUserWorkplaces(
  event: H3Event,
  loader: () => Promise<Workplace[]>,
) {
  const identifier = await resolveUserCacheKey(event)
  const ttl = resolveWorkplaceTtl(event)

  if (!identifier || !ttl) {
    return await loader()
  }

  const key = buildCacheKey(identifier)
  const cached = await cacheGet<Workplace[]>(key)

  if (Array.isArray(cached)) {
    return cached
  }

  const workplaces = await loader()

  if (Array.isArray(workplaces)) {
    await cacheSet(key, workplaces, { ttl })
  }

  return workplaces
}

export async function invalidateUserWorkplaces(
  event: H3Event,
  identifier?: string | null,
) {
  const cacheIdentifier = identifier ?? (await resolveUserCacheKey(event))

  if (!cacheIdentifier) {
    return
  }

  const key = buildCacheKey(cacheIdentifier)
  await cacheDelete(key)
}
