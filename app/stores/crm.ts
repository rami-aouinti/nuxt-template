import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useServerAuthRequestHeaders } from '~/composables/useServerRequestHeaders'
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
  const requestHeaders = useServerAuthRequestHeaders()

  function createCollectionFetcher<T>(endpoint: string): FetchableCollection<T> {
    const data = ref<T | null>(null)
    const pending = ref(false)
    const error = ref<Error | null>(null)

    const fetch = async (): Promise<T | null> => {
      pending.value = true
      error.value = null

      try {
        const result = await $fetch<T>(endpoint, {
          headers: requestHeaders,
          credentials: 'include',
        })
        data.value = result
        return result
      } catch (err) {
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

  const addresses = createCollectionFetcher<CrmAddressCollection>(
    '/api/addresses',
  )
  const countries = createCollectionFetcher<CrmCountryCollection>(
    '/api/countries',
  )
  const clients = createCollectionFetcher<CrmClientCollection>('/api/clients')
  const contacts = createCollectionFetcher<CrmContactCollection>(
    '/api/contacts',
  )
  const contactTypes = createCollectionFetcher<CrmContactTypeCollection>(
    '/api/contact_types',
  )
  const documents = createCollectionFetcher<CrmDocumentCollection>(
    '/api/documents',
  )
  const files = createCollectionFetcher<CrmFileCollection>('/api/files')
  const groups = createCollectionFetcher<CrmGroupCollection>('/api/groups')
  const histories = createCollectionFetcher<CrmHistoryCollection>(
    '/api/histories',
  )
  const labels = createCollectionFetcher<CrmLabelCollection>('/api/labels')
  const languages = createCollectionFetcher<CrmLanguageCollection>(
    '/api/crm/languages',
  )
  const modules = createCollectionFetcher<CrmModuleCollection>('/api/crm/modules')
  const projects = createCollectionFetcher<CrmProjectCollection>(
    '/api/crm/projects',
  )
  const modules = createCollectionFetcher<CrmModuleCollection>('/api/modules')
  const projects = createCollectionFetcher<CrmProjectCollection>('/api/projects')
  const projectStatuses = createCollectionFetcher<CrmProjectStatusCollection>(
    '/api/project_statuses',
  )
  const projectTypes = createCollectionFetcher<CrmProjectTypeCollection>(
    '/api/project_types',
  )
  const tasks = createCollectionFetcher<CrmTaskCollection>('/api/tasks')
  const taskStatuses = createCollectionFetcher<CrmTaskStatusCollection>(
    '/api/task_statuses',
  )

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
