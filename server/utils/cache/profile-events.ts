import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import type { ProfileEvent } from '~/types/events'

import { cacheDelete, cacheGet, cacheSet } from './index'
import { resolveUserCacheKey } from './helpers'

const PROFILE_EVENTS_CACHE_PREFIX = 'profile:events'

function buildCacheKey(identifier: string) {
  return `${PROFILE_EVENTS_CACHE_PREFIX}:${identifier}`
}

function resolveProfileEventsTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.profileEventsTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

export async function fetchProfileEvents(
  event: H3Event,
  loader: () => Promise<ProfileEvent[]>,
) {
  const identifier = await resolveUserCacheKey(event)
  const ttl = resolveProfileEventsTtl(event)

  if (!identifier || !ttl) {
    return await loader()
  }

  const key = buildCacheKey(identifier)
  const cached = await cacheGet<ProfileEvent[]>(key)

  if (Array.isArray(cached)) {
    return cached
  }

  const events = await loader()

  if (Array.isArray(events)) {
    await cacheSet(key, events, { ttl })
  }

  return events
}

export async function invalidateProfileEvents(event: H3Event) {
  const identifier = await resolveUserCacheKey(event)

  if (!identifier) {
    return
  }

  const key = buildCacheKey(identifier)
  await cacheDelete(key)
}
