import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { normalizeRequestHeaders } from '~/utils/headers'
import type {
  AdminNotification,
  AdminNotificationDetail,
  NotificationStatusUpdatePayload,
} from '~/types/notification'

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

function normalizeId(id: string) {
  return id.trim()
}

export const useNotificationManagementStore = defineStore(
  'notificationManagement',
  () => {
    const requestHeaders = import.meta.server
      ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
      : undefined

    const notifications = ref<AdminNotification[]>([])
    const notificationsPending = ref(false)
    const notificationsError = ref<Error | null>(null)
    const notificationsFetchedAt = ref<number | null>(null)
    let notificationsPromise: Promise<AdminNotification[] | null> | null = null

    const notificationDetails = reactive<Record<string, AdminNotificationDetail | null>>({})
    const notificationDetailPending = reactive<Record<string, boolean>>({})
    const notificationDetailError = reactive<Record<string, Error | null>>({})
    const notificationDetailFetchedAt = reactive<Record<string, number | null>>({})
    const notificationDetailPromises = reactive<
      Record<string, Promise<AdminNotificationDetail | null> | null>
    >({})

    async function fetchNotifications({
      force = false,
      ttl = DEFAULT_TTL,
    }: { force?: boolean; ttl?: number } = {}) {
      const now = Date.now()

      if (!force && notificationsFetchedAt.value) {
        const age = now - notificationsFetchedAt.value
        if (age < ttl && notifications.value.length > 0) {
          return notifications.value
        }
      }

      if (!force && notificationsPromise) {
        return notificationsPromise
      }

      notificationsPromise = (async () => {
        notificationsPending.value = true
        notificationsError.value = null

        try {
          const response = await $fetch<AdminNotification[]>(
            '/api/v1/notification',
            {
              headers: requestHeaders,
              credentials: 'include',
            },
          )

          notifications.value = Array.isArray(response) ? response : []
          notificationsFetchedAt.value = Date.now()

          return notifications.value
        } catch (error) {
          const wrapped = toError(error)
          notificationsError.value = wrapped
          throw wrapped
        } finally {
          notificationsPending.value = false
          notificationsPromise = null
        }
      })()

      return notificationsPromise
    }

    function refreshNotifications() {
      return fetchNotifications({ force: true })
    }

    async function fetchNotificationDetail(
      id: string,
      { force = false, ttl = DEFAULT_TTL }: { force?: boolean; ttl?: number } = {},
    ) {
      const normalizedId = normalizeId(id)

      if (!normalizedId) {
        throw new Error('A notification identifier is required')
      }

      const now = Date.now()
      const fetchedAt = notificationDetailFetchedAt[normalizedId]
      const cachedDetail = notificationDetails[normalizedId]

      if (!force && cachedDetail && fetchedAt) {
        const age = now - fetchedAt
        if (age < ttl) {
          return cachedDetail
        }
      }

      const inflight = notificationDetailPromises[normalizedId]
      if (!force && inflight) {
        return inflight
      }

      const promise = (async () => {
        notificationDetailPending[normalizedId] = true
        notificationDetailError[normalizedId] = null

        try {
          const detail = await $fetch<AdminNotificationDetail>(
            `/api/v1/notification/${normalizedId}`,
            {
              headers: requestHeaders,
              credentials: 'include',
            },
          )

          notificationDetails[normalizedId] = detail
          notificationDetailFetchedAt[normalizedId] = Date.now()

          return detail
        } catch (error) {
          const wrapped = toError(error)
          notificationDetailError[normalizedId] = wrapped
          throw wrapped
        } finally {
          notificationDetailPending[normalizedId] = false
          notificationDetailPromises[normalizedId] = null
        }
      })()

      notificationDetailPromises[normalizedId] = promise

      return promise
    }

    function refreshNotificationDetail(id: string) {
      return fetchNotificationDetail(id, { force: true })
    }

    function upsertNotification(updated: AdminNotification) {
      const index = notifications.value.findIndex((item) => item.id === updated.id)

      if (index >= 0) {
        notifications.value.splice(index, 1, {
          ...notifications.value[index],
          ...updated,
        })
        return
      }

      notifications.value.unshift(updated)
    }

    async function updateNotificationStatus(
      id: string,
      payload: NotificationStatusUpdatePayload,
    ) {
      const normalizedId = normalizeId(id)

      if (!normalizedId) {
        throw new Error('A notification identifier is required')
      }

      try {
        const response = await $fetch<AdminNotificationDetail>(
          `/api/v1/notification/${normalizedId}/status`,
          {
            method: 'PUT',
            body: payload,
            headers: requestHeaders,
            credentials: 'include',
          },
        )

        if (response) {
          upsertNotification(response)
          notificationDetails[normalizedId] = response
          notificationDetailFetchedAt[normalizedId] = Date.now()
          notificationDetailError[normalizedId] = null
        } else {
          await refreshNotifications()
          notificationDetailFetchedAt[normalizedId] = null
        }

        return response
      } catch (error) {
        throw toError(error)
      }
    }

    function clear() {
      notifications.value = []
      notificationsFetchedAt.value = null
      notificationsError.value = null

      for (const key of Object.keys(notificationDetails)) {
        Reflect.deleteProperty(notificationDetails, key)
      }
      for (const key of Object.keys(notificationDetailError)) {
        Reflect.deleteProperty(notificationDetailError, key)
      }
      for (const key of Object.keys(notificationDetailPending)) {
        Reflect.deleteProperty(notificationDetailPending, key)
      }
      for (const key of Object.keys(notificationDetailFetchedAt)) {
        Reflect.deleteProperty(notificationDetailFetchedAt, key)
      }
      for (const key of Object.keys(notificationDetailPromises)) {
        Reflect.deleteProperty(notificationDetailPromises, key)
      }
    }

    return {
      notifications,
      notificationsPending,
      notificationsError,
      fetchNotifications,
      refreshNotifications,
      notificationDetails,
      notificationDetailPending,
      notificationDetailError,
      fetchNotificationDetail,
      refreshNotificationDetail,
      updateNotificationStatus,
      clear,
    }
  },
)
