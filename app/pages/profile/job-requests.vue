<script setup lang="ts">
import { computed } from 'vue'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import type { CompanyUser, Job } from '~/types/job'
import { DEFAULT_LOCALE } from '~/utils/i18n/locales'

definePageMeta({
  title: 'navigation.profileJobRequests',
  middleware: 'auth',
})

const { t, locale } = useI18n()

type JobRequest = Omit<Job, 'user'> & {
  user?: string | CompanyUser | null
  applied?: boolean
  owner?: boolean
}

type JobRequestsResponse = {
  data?: Record<string, JobRequest>
  page: number
  limit: number
  count: number
}

const {
  data: jobRequestsResponse,
  pending: isLoadingJobRequests,
  error: jobRequestsFetchError,
  refresh: refreshJobRequests,
} = await useFetch<JobRequestsResponse>('/api/job/v1/requests/job', {
  server: false,
})

function extractRequestError(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const withData = error as { data?: unknown; message?: unknown }

    if (withData.data && typeof withData.data === 'object') {
      const data = withData.data as Record<string, unknown>

      if (
        'message' in data &&
        typeof data.message === 'string' &&
        data.message.trim().length > 0
      ) {
        return data.message
      }

      if (
        'error' in data &&
        typeof data.error === 'string' &&
        data.error.trim().length > 0
      ) {
        return data.error
      }
    }

    if (
      typeof withData.message === 'string' &&
      withData.message.trim().length > 0
    ) {
      return withData.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

function getJobRequestTimestamp(value: unknown) {
  if (!value) return 0
  const date = value instanceof Date ? value : new Date(String(value))
  const timestamp = date.getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const jobRequests = computed<JobRequest[]>(() => {
  const collection = jobRequestsResponse.value?.data
  if (!collection) {
    return []
  }

  return Object.values(collection).sort((a, b) => {
    const left = getJobRequestTimestamp(b.updatedAt || b.createdAt)
    const right = getJobRequestTimestamp(a.updatedAt || a.createdAt)
    return left - right
  })
})

const hasJobRequests = computed(() => jobRequests.value.length > 0)

const jobRequestsErrorMessage = computed(() => {
  if (!jobRequestsFetchError.value) {
    return ''
  }

  return extractRequestError(
    jobRequestsFetchError.value,
    t('profile.sections.jobRequests.notifications.loadFailed'),
  )
})

function handleJobRequestsRefresh() {
  return refreshJobRequests()
}

function formatJobRequestTimestamp(value?: string | null) {
  if (!value) {
    return t('profile.sections.jobRequests.labels.dateFallback')
  }

  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return t('profile.sections.jobRequests.labels.dateFallback')
  }

  const formatter = new Intl.DateTimeFormat(locale.value || DEFAULT_LOCALE, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return formatter.format(date)
}
</script>

<template>
  <div>
    <ProfilePageShell>
      <v-row>
        <v-col cols="12">
          <AppCard
            class="profile-job-requests-card"
            elevation="2"
            rounded="xl"
            variant="text"
          >
            <v-card-title class="d-flex align-center gap-3">
              <div>
                <p class="text-subtitle-1 font-weight-medium mb-0">
                  {{ t('profile.sections.jobRequests.title') }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ t('profile.sections.jobRequests.description') }}
                </p>
              </div>
              <v-spacer />
              <v-tooltip
                :text="t('profile.sections.jobRequests.actions.refresh')"
                :aria-label="t('profile.sections.jobRequests.actions.refresh')"
                location="bottom"
              >
                <template #activator="{ props }">
                  <AppButton
                    v-bind="props"
                    variant="text"
                    density="comfortable"
                    icon="mdi-refresh"
                    :disabled="isLoadingJobRequests"
                    :loading="isLoadingJobRequests"
                    @click="handleJobRequestsRefresh"
                  />
                </template>
              </v-tooltip>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-alert
                v-if="jobRequestsErrorMessage"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ jobRequestsErrorMessage }}
              </v-alert>
              <div v-else>
                <div v-if="isLoadingJobRequests">
                  <v-skeleton-loader
                    v-for="n in 3"
                    :key="`job-request-skeleton-${n}`"
                    type="list-item-three-line"
                    class="mb-3"
                  />
                </div>
                <div v-else-if="!hasJobRequests" class="profile-job-requests__state">
                  <p class="profile-job-requests__state-title">
                    {{ t('profile.sections.jobRequests.states.empty') }}
                  </p>
                  <p class="profile-job-requests__state-subtitle text-medium-emphasis">
                    {{ t('profile.sections.jobRequests.states.emptyHint') }}
                  </p>
                </div>
                <div v-else class="profile-job-requests__list">
                  <div
                    v-for="(job, index) in jobRequests"
                    :key="job.id"
                    class="profile-job-request"
                  >
                    <div class="profile-job-request__header">
                      <div>
                        <p class="profile-job-request__title text-subtitle-1 font-weight-medium mb-1">
                          {{ job.title }}
                        </p>
                        <p class="profile-job-request__company text-body-2 text-medium-emphasis mb-0">
                          {{ job.company?.name || t('profile.jobs.labels.unknownCompany') }}
                        </p>
                      </div>
                      <div class="profile-job-request__badges">
                        <v-chip
                          v-if="job.owner"
                          size="small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ t('profile.jobs.badges.owner') }}
                        </v-chip>
                        <v-chip
                          v-if="job.applied"
                          size="small"
                          color="success"
                          variant="tonal"
                        >
                          {{ t('profile.jobs.badges.applied') }}
                        </v-chip>
                      </div>
                    </div>
                    <p class="profile-job-request__description text-body-2">
                      {{ job.description || t('profile.jobs.labels.descriptionUnavailable') }}
                    </p>
                    <div class="profile-job-request__meta text-caption text-medium-emphasis">
                      <span v-if="job.workLocation">
                        {{ job.workLocation }}
                      </span>
                      <span v-if="job.workType">
                        {{ job.workType }}
                      </span>
                      <span v-if="job.contractType">
                        {{ job.contractType }}
                      </span>
                      <span v-if="job.salaryRange">
                        {{ job.salaryRange }}
                      </span>
                    </div>
                    <div class="profile-job-request__footer text-caption text-medium-emphasis">
                      <span>
                        {{
                          t('profile.sections.jobRequests.labels.requestedOn', {
                            date: formatJobRequestTimestamp(job.updatedAt || job.createdAt),
                          })
                        }}
                      </span>
                    </div>
                    <v-divider v-if="index < jobRequests.length - 1" class="my-4" />
                  </div>
                </div>
              </div>
            </v-card-text>
          </AppCard>
        </v-col>
      </v-row>
    </ProfilePageShell>
  </div>
</template>

<style scoped src="~/assets/styles/pages/profile/job-requests.css"></style>
