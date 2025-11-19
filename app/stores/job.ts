import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Job, JobListingResponse } from '~/types/job'

interface PaginationState {
  page: number
  limit: number
  total: number
}

function resolveErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    typeof (error as { data?: Record<string, unknown> }).data?.message ===
      'string'
  ) {
    return String((error as { data?: { message?: string } }).data?.message)
  }

  return 'Unable to load job listings.'
}

export const useJobStore = defineStore('jobListings', () => {
  const jobs = ref<Job[]>([])
  const pagination = ref<PaginationState>({ page: 1, limit: 20, total: 0 })
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref<string | null>(null)

  const setJobs = (data: Job[]) => {
    jobs.value = data
  }

  const setPagination = (data: PaginationState) => {
    pagination.value = data
  }

  const fetchJobs = async ({ force = false } = {}) => {
    if (isLoading.value) {
      return false
    }

    if (!force && isLoaded.value) {
      return true
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<JobListingResponse>('/api/job/jobs')
      const payload = Array.isArray(response?.data) ? response.data : []

      setJobs(payload)
      setPagination({
        page: response?.page ?? 1,
        limit: response?.limit ?? payload.length,
        total: response?.count ?? payload.length,
      })

      isLoaded.value = true
      return true
    } catch (err) {
      error.value = resolveErrorMessage(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const hasJobs = computed(() => jobs.value.length > 0)

  const lastUpdatedAt = computed(() => {
    const timestamps = jobs.value
      .map((job) => job.updatedAt || job.createdAt)
      .filter(Boolean)

    if (!timestamps.length) {
      return null
    }

    const latest = timestamps.sort().at(-1)
    return latest ?? null
  })

  return {
    jobs,
    pagination,
    isLoading,
    isLoaded,
    hasJobs,
    error,
    lastUpdatedAt,
    fetchJobs,
  }
})
