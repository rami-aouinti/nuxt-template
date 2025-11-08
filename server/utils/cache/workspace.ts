import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'

import type { WorkspaceFolder } from '~/types/workspace'

import { cacheDelete, cacheGet, cacheSet } from './index'
import { resolveUserCacheKey } from './helpers'

const WORKSPACE_CACHE_PREFIX = 'workspace:folders'

function buildCacheKey(identifier: string) {
  return `${WORKSPACE_CACHE_PREFIX}:${identifier}`
}

function resolveWorkspaceTtl(event: H3Event) {
  const ttl = Number(useRuntimeConfig(event).redis?.workspaceTtl ?? 0)
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

export async function fetchWorkspaceFolders(
  event: H3Event,
  loader: () => Promise<WorkspaceFolder[]>,
) {
  const identifier = await resolveUserCacheKey(event)
  const ttl = resolveWorkspaceTtl(event)

  if (!identifier || !ttl) {
    return await loader()
  }

  const key = buildCacheKey(identifier)
  const cached = await cacheGet<WorkspaceFolder[]>(key)

  if (Array.isArray(cached)) {
    return cached
  }

  const folders = await loader()

  if (Array.isArray(folders)) {
    await cacheSet(key, folders, { ttl })
  }

  return folders
}

export async function invalidateWorkspaceFolders(event: H3Event) {
  const identifier = await resolveUserCacheKey(event)

  if (!identifier) {
    return
  }

  const key = buildCacheKey(identifier)
  await cacheDelete(key)
}
