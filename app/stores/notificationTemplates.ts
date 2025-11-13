import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { normalizeRequestHeaders } from '~/utils/headers'
import type {
  NotificationTemplate,
  NotificationTemplateUploadResponse,
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

export const useNotificationTemplatesStore = defineStore(
  'notificationTemplates',
  () => {
    const requestHeaders = import.meta.server
      ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
      : undefined

    const templates = ref<NotificationTemplate[]>([])
    const templatesPending = ref(false)
    const templatesError = ref<Error | null>(null)
    const templatesFetchedAt = ref<number | null>(null)
    let templatesPromise: Promise<NotificationTemplate[] | null> | null = null

    const templateDetails = reactive<Record<string, NotificationTemplate | null>>({})
    const templateDetailPending = reactive<Record<string, boolean>>({})
    const templateDetailError = reactive<Record<string, Error | null>>({})
    const templateDetailFetchedAt = reactive<Record<string, number | null>>({})
    const templateDetailPromises = reactive<
      Record<string, Promise<NotificationTemplate | null> | null>
    >({})

    const uploadPending = ref(false)
    const uploadError = ref<Error | null>(null)
    const uploadResponse = ref<NotificationTemplateUploadResponse | null>(null)

    async function fetchTemplates({
      force = false,
      ttl = DEFAULT_TTL,
    }: { force?: boolean; ttl?: number } = {}) {
      const now = Date.now()

      if (!force && templatesFetchedAt.value) {
        const age = now - templatesFetchedAt.value

        if (age < ttl && templates.value.length > 0) {
          return templates.value
        }
      }

      if (!force && templatesPromise) {
        return templatesPromise
      }

      templatesPromise = (async () => {
        templatesPending.value = true
        templatesError.value = null

        try {
          const response = await $fetch<NotificationTemplate[]>(
            '/api/v1/notification/templates',
            {
              headers: requestHeaders,
              credentials: 'include',
            },
          )

          templates.value = Array.isArray(response) ? response : []
          templatesFetchedAt.value = Date.now()

          return templates.value
        } catch (error) {
          const wrapped = toError(error)
          templatesError.value = wrapped
          throw wrapped
        } finally {
          templatesPending.value = false
          templatesPromise = null
        }
      })()

      return templatesPromise
    }

    function refreshTemplates() {
      return fetchTemplates({ force: true })
    }

    async function fetchTemplate(
      id: string,
      { force = false, ttl = DEFAULT_TTL }: { force?: boolean; ttl?: number } = {},
    ) {
      const normalizedId = normalizeId(id)

      if (!normalizedId) {
        throw new Error('A notification template identifier is required')
      }

      const now = Date.now()
      const fetchedAt = templateDetailFetchedAt[normalizedId]
      const cachedDetail = templateDetails[normalizedId]

      if (!force && cachedDetail && fetchedAt) {
        const age = now - fetchedAt
        if (age < ttl) {
          return cachedDetail
        }
      }

      const inflight = templateDetailPromises[normalizedId]
      if (!force && inflight) {
        return inflight
      }

      const promise = (async () => {
        templateDetailPending[normalizedId] = true
        templateDetailError[normalizedId] = null

        try {
          const detail = await $fetch<NotificationTemplate>(
            `/api/v1/notification/templates/${normalizedId}`,
            {
              headers: requestHeaders,
              credentials: 'include',
            },
          )

          templateDetails[normalizedId] = detail
          templateDetailFetchedAt[normalizedId] = Date.now()

          return detail
        } catch (error) {
          const wrapped = toError(error)
          templateDetailError[normalizedId] = wrapped
          throw wrapped
        } finally {
          templateDetailPending[normalizedId] = false
          templateDetailPromises[normalizedId] = null
        }
      })()

      templateDetailPromises[normalizedId] = promise

      return promise
    }

    function refreshTemplate(id: string) {
      return fetchTemplate(id, { force: true })
    }

    async function uploadTemplate(formData: FormData) {
      const headers = requestHeaders ? { ...requestHeaders } : undefined
      if (headers) {
        delete headers['content-type']
        delete headers['Content-Type']
      }

      uploadPending.value = true
      uploadError.value = null
      uploadResponse.value = null

      try {
        const response = await $fetch<NotificationTemplateUploadResponse>(
          '/api/v1/notification/platform/templates/upload',
          {
            method: 'POST',
            body: formData,
            headers,
            credentials: 'include',
          },
        )

        uploadResponse.value = response
        await refreshTemplates()

        return response
      } catch (error) {
        const wrapped = toError(error)
        uploadError.value = wrapped
        throw wrapped
      } finally {
        uploadPending.value = false
      }
    }

    function clear() {
      templates.value = []
      templatesFetchedAt.value = null
      templatesError.value = null

      for (const key of Object.keys(templateDetails)) {
        Reflect.deleteProperty(templateDetails, key)
      }
      for (const key of Object.keys(templateDetailError)) {
        Reflect.deleteProperty(templateDetailError, key)
      }
      for (const key of Object.keys(templateDetailPending)) {
        Reflect.deleteProperty(templateDetailPending, key)
      }
      for (const key of Object.keys(templateDetailFetchedAt)) {
        Reflect.deleteProperty(templateDetailFetchedAt, key)
      }
      for (const key of Object.keys(templateDetailPromises)) {
        Reflect.deleteProperty(templateDetailPromises, key)
      }

      uploadPending.value = false
      uploadError.value = null
      uploadResponse.value = null
    }

    return {
      templates,
      templatesPending,
      templatesError,
      fetchTemplates,
      refreshTemplates,
      templateDetails,
      templateDetailPending,
      templateDetailError,
      fetchTemplate,
      refreshTemplate,
      uploadTemplate,
      uploadPending,
      uploadError,
      uploadResponse,
      clear,
    }
  },
)
