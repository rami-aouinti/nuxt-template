import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { User } from '~/types/user'
import type { UserGroup } from '~/types/userGroup'
import type { Role } from '~/types/role'
import type { ApiKey } from '~/types/apiKey'
import type { Workplace } from '~/types/workplace'

type ApiVersion = 'v1' | 'v2'

type FetchOptions = {
  force?: boolean
  ttl?: number
}

type CacheEntry<T> = {
  data: Ref<T | null>
  pending: Ref<boolean>
  error: Ref<Error | null>
  fetchedAt: Ref<number | null>
  fetch: (options?: FetchOptions) => Promise<T | null>
  refresh: () => Promise<T | null>
  clear: () => void
}

const DEFAULT_TTL = 60 * 1000

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === 'string') {
    return new Error(error)
  }
  return new Error('Unknown error')
}

export const useAdminStore = defineStore('admin', () => {
  const requestHeaders = import.meta.server
    ? useRequestHeaders(['cookie', 'authorization'])
    : undefined

  function createCache<T>(url: string): CacheEntry<T> {
    const data = ref<T | null>(null)
    const pending = ref(false)
    const error = ref<Error | null>(null)
    const fetchedAt = ref<number | null>(null)
    let inflight: Promise<T | null> | null = null

    const fetch = async (options: FetchOptions = {}): Promise<T | null> => {
      const ttl = options.ttl ?? DEFAULT_TTL
      const now = Date.now()
      const shouldFetch =
        options.force ||
        !data.value ||
        !fetchedAt.value ||
        now - fetchedAt.value > ttl

      if (!shouldFetch) {
        return data.value
      }

      if (inflight) {
        return inflight
      }

      inflight = (async () => {
        pending.value = true
        error.value = null

        try {
          const result = await $fetch<T>(url, {
            headers: requestHeaders,
            credentials: 'include',
          })
          data.value = result
          fetchedAt.value = Date.now()
          return result
        } catch (err) {
          const wrapped = toError(err)
          error.value = wrapped
          throw wrapped
        } finally {
          pending.value = false
          inflight = null
        }
      })()

      return inflight
    }

    const refresh = () => fetch({ force: true })

    const clear = () => {
      data.value = null
      error.value = null
      fetchedAt.value = null
    }

    return {
      data,
      pending,
      error,
      fetchedAt,
      fetch,
      refresh,
      clear,
    }
  }

  const users = createCache<User[]>('/api/v1/user')
  const userGroups = createCache<UserGroup[]>('/api/v1/user_group')
  const workplaces = createCache<Workplace[]>('/api/v1/workplace')
  const roles = createCache<Role[]>('/api/v1/role')
  const apiKeysByVersion: Record<ApiVersion, CacheEntry<ApiKey[]>> = {
    v1: createCache<ApiKey[]>('/api/v1/api_key'),
    v2: createCache<ApiKey[]>('/api/v2/api_key'),
  }

  const userCount = createCache<number>('/api/v1/user/count')
  const userGroupCount = createCache<number>('/api/v1/user_group/count')
  const workplaceCount = createCache<number>('/api/v1/workplace/count')
  const roleCount = createCache<number>('/api/v1/role/count')
  const apiKeyCount = createCache<number>('/api/v1/api_key/count')

  const fetchAllCounts = (options?: FetchOptions) =>
    Promise.all([
      userCount.fetch(options),
      userGroupCount.fetch(options),
      workplaceCount.fetch(options),
      roleCount.fetch(options),
      apiKeyCount.fetch(options),
    ])

  const refreshAllCounts = () =>
    Promise.all([
      userCount.refresh(),
      userGroupCount.refresh(),
      workplaceCount.refresh(),
      roleCount.refresh(),
      apiKeyCount.refresh(),
    ])

  function fetchApiKeys(version: ApiVersion, options?: FetchOptions) {
    return apiKeysByVersion[version].fetch(options)
  }

  function refreshApiKeys(version: ApiVersion) {
    return apiKeysByVersion[version].refresh()
  }

  function clearAll() {
    users.clear()
    userGroups.clear()
    workplaces.clear()
    roles.clear()
    userCount.clear()
    userGroupCount.clear()
    workplaceCount.clear()
    roleCount.clear()
    apiKeyCount.clear()
    for (const version of Object.keys(apiKeysByVersion) as ApiVersion[]) {
      apiKeysByVersion[version].clear()
    }
  }

  return {
    users: users.data,
    usersPending: users.pending,
    usersError: users.error,
    fetchUsers: users.fetch,
    refreshUsers: users.refresh,

    userGroups: userGroups.data,
    userGroupsPending: userGroups.pending,
    userGroupsError: userGroups.error,
    fetchUserGroups: userGroups.fetch,
    refreshUserGroups: userGroups.refresh,

    workplaces: workplaces.data,
    workplacesPending: workplaces.pending,
    workplacesError: workplaces.error,
    fetchWorkplaces: workplaces.fetch,
    refreshWorkplaces: workplaces.refresh,

    roles: roles.data,
    rolesPending: roles.pending,
    rolesError: roles.error,
    fetchRoles: roles.fetch,
    refreshRoles: roles.refresh,

    apiKeysByVersion,
    fetchApiKeys,
    refreshApiKeys,

    userCount: userCount.data,
    userCountPending: userCount.pending,
    userCountError: userCount.error,
    fetchUserCount: userCount.fetch,
    refreshUserCount: userCount.refresh,

    userGroupCount: userGroupCount.data,
    userGroupCountPending: userGroupCount.pending,
    userGroupCountError: userGroupCount.error,
    fetchUserGroupCount: userGroupCount.fetch,
    refreshUserGroupCount: userGroupCount.refresh,

    workplaceCount: workplaceCount.data,
    workplaceCountPending: workplaceCount.pending,
    workplaceCountError: workplaceCount.error,
    fetchWorkplaceCount: workplaceCount.fetch,
    refreshWorkplaceCount: workplaceCount.refresh,

    roleCount: roleCount.data,
    roleCountPending: roleCount.pending,
    roleCountError: roleCount.error,
    fetchRoleCount: roleCount.fetch,
    refreshRoleCount: roleCount.refresh,

    apiKeyCount: apiKeyCount.data,
    apiKeyCountPending: apiKeyCount.pending,
    apiKeyCountError: apiKeyCount.error,
    fetchApiKeyCount: apiKeyCount.fetch,
    refreshApiKeyCount: apiKeyCount.refresh,

    fetchAllCounts,
    refreshAllCounts,
    clearAll,
  }
})

export type { ApiVersion }
