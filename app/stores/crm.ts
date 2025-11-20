import type { FetchError } from 'ofetch'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useCrmApi } from '~/composables/useCrmApi'
import type {
  CrmAddressCollection,
  CrmClientCollection,
  CrmContactCollection,
  CrmCountryCollection,
  CrmContactTypeCollection,
  CrmDocumentCollection,
  CrmFileCollection,
  CrmGroupCollection,
  CrmHistoryCollection,
  CrmLabelCollection,
  CrmLanguageCollection,
  CrmModuleCollection,
  CrmProjectCollection,
  CrmProjectStatusCollection,
  CrmProjectTypeCollection,
  CrmTaskCollection,
  CrmTaskStatusCollection,
} from '~/types/crm'

type FetchableCollection<T> = {
  data: Ref<T | null>
  pending: Ref<boolean>
  error: Ref<Error | null>
  fetch: () => Promise<T | null>
  refresh: () => Promise<T | null>
  clear: () => void
}

function toError(error: unknown) {
  if (error instanceof Error) {
    return error
  }

  if (typeof error === 'string') {
    return new Error(error)
  }

  return new Error('Unknown error')
}

export const useCrmStore = defineStore('crm', () => {
  const { headers: crmHeaders, withBase } = useCrmApi()

  function createCollectionFetcher<T>(endpoint: string): FetchableCollection<T> {
    const data = ref<T | null>(null)
    const pending = ref(false)
    const error = ref<Error | null>(null)

    const fetch = async (): Promise<T | null> => {
      pending.value = true
      error.value = null

      try {
        const result = await $fetch<T>(withBase(endpoint), {
          headers: crmHeaders.value,
          cache: 'no-store',
        })
        data.value = result
        return result
      } catch (err) {
        const fetchError = err as FetchError<T> | undefined

        if (fetchError?.status === 304) {
          const responseData =
            fetchError.data ?? (fetchError as any).response?._data ?? null

          if (responseData) {
            data.value = responseData
            return responseData
          }
        }

        const wrapped = toError(err)
        error.value = wrapped
        throw wrapped
      } finally {
        pending.value = false
      }
    }

    const refresh = () => fetch()

    const clear = () => {
      data.value = null
      error.value = null
    }

    return {
      data,
      pending,
      error,
      fetch,
      refresh,
      clear,
    }
  }

  const addresses = createCollectionFetcher<CrmAddressCollection>('/addresses')
  const countries = createCollectionFetcher<CrmCountryCollection>('/countries')
  const clients = createCollectionFetcher<CrmClientCollection>('/clients')
  const contacts = createCollectionFetcher<CrmContactCollection>('/contacts')
  const contactTypes =
    createCollectionFetcher<CrmContactTypeCollection>('/contact_types')
  const documents = createCollectionFetcher<CrmDocumentCollection>('/documents')
  const files = createCollectionFetcher<CrmFileCollection>('/files')
  const groups = createCollectionFetcher<CrmGroupCollection>('/groups')
  const histories = createCollectionFetcher<CrmHistoryCollection>('/histories')
  const labels = createCollectionFetcher<CrmLabelCollection>('/labels')
  const languages = createCollectionFetcher<CrmLanguageCollection>('/languages')
  const modules = createCollectionFetcher<CrmModuleCollection>('/modules')
  const projects = createCollectionFetcher<CrmProjectCollection>('/projects')
  const projectStatuses =
    createCollectionFetcher<CrmProjectStatusCollection>('/project_statuses')
  const projectTypes =
    createCollectionFetcher<CrmProjectTypeCollection>('/project_types')
  const tasks = createCollectionFetcher<CrmTaskCollection>('/tasks')
  const taskStatuses =
    createCollectionFetcher<CrmTaskStatusCollection>('/task_statuses')

  return {
    addresses,
    countries,
    clients,
    contacts,
    contactTypes,
    documents,
    files,
    groups,
    histories,
    labels,
    languages,
    modules,
    projects,
    projectStatuses,
    projectTypes,
    tasks,
    taskStatuses,
  }
})
