import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import type { ProfilePlugin } from '~/types/plugin'

import { cacheDelete, cacheGet, cacheSet } from './index'
import { resolveUserCacheKey } from './helpers'

const PROFILE_PLUGINS_CACHE_PREFIX = 'profile:plugins'

interface ProfilePluginsStoreEntry {
  plugins: ProfilePlugin[]
  expiresAt: number
}

type CacheState = typeof globalThis & {
  __profilePluginsStore?: Record<string, ProfilePluginsStoreEntry>
}

function getGlobalState(): Record<string, ProfilePluginsStoreEntry> {
  const state = globalThis as CacheState
  if (!state.__profilePluginsStore) {
    state.__profilePluginsStore = {}
  }
  return state.__profilePluginsStore
}

function buildCacheKey(identifier: string) {
  return `${PROFILE_PLUGINS_CACHE_PREFIX}:${identifier}`
}

function resolveProfilePluginsTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.profilePluginsTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

function readFromStore(identifier: string) {
  const store = getGlobalState()
  const entry = store[identifier]

  if (!entry) {
    return null
  }

  if (entry.expiresAt <= Date.now()) {
    Reflect.deleteProperty(store, identifier)
    return null
  }

  return entry.plugins
}

function updateStore(identifier: string, plugins: ProfilePlugin[], ttl: number) {
  const store = getGlobalState()
  store[identifier] = {
    plugins,
    expiresAt: Date.now() + ttl * 1000,
  }
}

function clearStore(identifier: string) {
  const store = getGlobalState()
  Reflect.deleteProperty(store, identifier)
}

export async function fetchProfilePlugins(
  event: H3Event,
  loader: () => Promise<ProfilePlugin[]>,
) {
  const identifier = await resolveUserCacheKey(event)
  const ttl = resolveProfilePluginsTtl(event)

  if (!identifier || !ttl) {
    return await loader()
  }

  const stored = readFromStore(identifier)
  if (stored) {
    return stored
  }

  const key = buildCacheKey(identifier)
  const cached = await cacheGet<ProfilePlugin[]>(key)

  if (Array.isArray(cached)) {
    updateStore(identifier, cached, ttl)
    return cached
  }

  const plugins = await loader()

  if (Array.isArray(plugins)) {
    updateStore(identifier, plugins, ttl)
    await cacheSet(key, plugins, { ttl })
  }

  return plugins
}

export async function invalidateProfilePlugins(event: H3Event) {
  const identifier = await resolveUserCacheKey(event)

  if (!identifier) {
    return
  }

  clearStore(identifier)

  const key = buildCacheKey(identifier)
  await cacheDelete(key)
}
