<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'

const jobApi = useJobPlatformApi()

definePageMeta({
  title: 'navigation.profileJobs',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const translate = useTranslateWithFallback()
const drawerRight = useState('drawerRight', () => false)

interface ProfileJobLanguage {
  id: string
  name: string
  level: string | null
}

interface ProfileJobCompany {
  id: string
  name: string | null
  description: string | null
  location: string | null
  contactEmail: string | null
  siteUrl: string | null
}

interface ProfileJobApplicant {
  id: string
  firstName: string | null
  lastName: string | null
  contactEmail: string | null
  phone: string | null
}

interface ProfileJobApplication {
  id: string
  applicant: ProfileJobApplicant | null
  status: string | null
}

interface ProfileJob {
  id: string
  title: string
  description: string | null
  mission: string | null
  requiredSkills: string[]
  requirements: string[]
  experience: string | null
  workType: string | null
  workLocation: string | null
  salaryRange: string | null
  contractType: string | null
  benefits: string | null
  company: ProfileJobCompany | null
  languages: ProfileJobLanguage[]
  applications: ProfileJobApplication[]
  owner: boolean
  applied: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

interface ProfileJobCollectionResponse {
  data?: Array<Record<string, unknown>>
  page?: number | string
  limit?: number | string
  count?: number | string
}

const {
  data: jobsResponse,
  pending,
  error,
  refresh,
} = await useAsyncData<ProfileJobCollectionResponse>(
  'profile-jobs',
  async () => await jobApi.jobs.profileList<ProfileJobCollectionResponse>(),
  { server: true },
)

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })

const jobs = computed<ProfileJob[]>(() => {
  const items = jobsResponse.value?.data
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((record) => mapJobRecord(record))
    .filter((item): item is ProfileJob => item !== null)
})

const selectedJobId = ref<string | null>(null)

watch(
  () => jobs.value,
  (items) => {
    if (!items.length) {
      selectedJobId.value = null
      return
    }

    if (
      !selectedJobId.value ||
      !items.some((job) => job.id === selectedJobId.value)
    ) {
      selectedJobId.value = items[0].id
    }
  },
  { immediate: true },
)

const selectedJob = computed<ProfileJob | null>(() => {
  if (!jobs.value.length) {
    return null
  }

  if (!selectedJobId.value) {
    return jobs.value[0]
  }

  return (
    jobs.value.find((job) => job.id === selectedJobId.value) ?? jobs.value[0]
  )
})

const selectedJobApplicants = computed(
  () => selectedJob.value?.applications ?? [],
)
const hasSelectedApplicants = computed(
  () => selectedJobApplicants.value.length > 0,
)

const expandedJobIds = ref<string[]>([])

function isJobExpanded(jobId: string): boolean {
  return expandedJobIds.value.includes(jobId)
}

function toggleJobDetails(jobId: string) {
  if (isJobExpanded(jobId)) {
    expandedJobIds.value = expandedJobIds.value.filter((id) => id !== jobId)
    return
  }

  expandedJobIds.value = [...expandedJobIds.value, jobId]
}

const selectedJobCompanyName = computed(() => {
  if (!selectedJob.value) {
    return translate('profile.jobs.drawer.placeholderCompany', 'Select a job')
  }

  return (
    selectedJob.value.company?.name || t('profile.jobs.labels.unknownCompany')
  )
})

const selectedJobTitle = computed(() => {
  if (selectedJob.value) {
    return selectedJob.value.title
  }

  return translate(
    'profile.jobs.drawer.placeholderTitle',
    'Select a job to review applicants',
  )
})

const isLoading = computed(() => pending.value)

const hasJobs = computed(() => jobs.value.length > 0)

const loadErrorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  return extractRequestError(
    error.value,
    t('profile.jobs.notifications.loadFailed'),
  )
})

watch(
  () => error.value,
  (value) => {
    if (!value || !import.meta.client) {
      return
    }

    const message = extractRequestError(
      value,
      t('profile.jobs.notifications.loadFailed'),
    )
    Notify.error(message)
  },
)

function ensureString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return null
}

function ensureDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => ensureString(item))
    .filter((item): item is string => item !== null)
}

function mapJobRecord(record: unknown): ProfileJob | null {
  if (!record || typeof record !== 'object') {
    return null
  }

  const value = record as Record<string, unknown>
  const id = ensureString(value.id)
  const title = ensureString(value.title)

  if (!id || !title) {
    return null
  }

  return {
    id,
    title,
    description: ensureString(value.description),
    mission: ensureString(value.work),
    requiredSkills: ensureStringArray(value.requiredSkills),
    requirements: ensureStringArray(value.requirements),
    experience: ensureString(value.experience),
    workType: ensureString(value.workType),
    workLocation: ensureString(value.workLocation),
    salaryRange: ensureString(value.salaryRange),
    contractType: ensureString(value.contractType),
    benefits: ensureString(value.benefits),
    company: mapCompany(value.company),
    languages: mapLanguages(value.languages),
    applications: mapApplications(value.applications),
    owner: Boolean(value.owner),
    applied: Boolean(value.applied),
    createdAt: ensureDate(value.createdAt),
    updatedAt: ensureDate(value.updatedAt),
  }
}

function handleApplicantsDrawer(job: ProfileJob) {
  selectedJobId.value = job.id
  drawerRight.value = true
}

function mapCompany(record: unknown): ProfileJobCompany | null {
  if (!record || typeof record !== 'object') {
    return null
  }

  const value = record as Record<string, unknown>
  const id = ensureString(value.id) ?? ensureString(value.name)
  const name = ensureString(value.name)
  const description = ensureString(value.description)
  const location = ensureString(value.location)
  const contactEmail = ensureString(value.contactEmail)
  const siteUrl = ensureString(value.siteUrl)

  if (!id && !name && !description) {
    return null
  }

  return {
    id:
      id ??
      (name ? `company-${name.toLowerCase().replace(/\s+/g, '-')}` : 'company'),
    name: name ?? null,
    description: description ?? null,
    location: location ?? null,
    contactEmail: contactEmail ?? null,
    siteUrl: siteUrl ?? null,
  }
}

function mapLanguages(value: unknown): ProfileJobLanguage[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((language) => {
      if (!language || typeof language !== 'object') {
        return null
      }

      const record = language as Record<string, unknown>
      const id = ensureString(record.id) ?? ensureString(record.name)
      const name = ensureString(record.name)

      if (!id || !name) {
        return null
      }

      return {
        id,
        name,
        level: ensureString(record.level),
      }
    })
    .filter((language): language is ProfileJobLanguage => language !== null)
}

function mapApplications(value: unknown): ProfileJobApplication[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((application) => {
      if (!application || typeof application !== 'object') {
        return null
      }

      const record = application as Record<string, unknown>
      const id = ensureString(record.id)

      if (!id) {
        return null
      }

      return {
        id,
        status: ensureString(record.status),
        applicant: mapApplicant(record.applicant),
      }
    })
    .filter(
      (application): application is ProfileJobApplication =>
        application !== null,
    )
}

function mapApplicant(value: unknown): ProfileJobApplicant | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>
  const id = ensureString(record.id)
  const firstName = ensureString(record.firstName)
  const lastName = ensureString(record.lastName)

  if (!id && !firstName && !lastName) {
    return null
  }

  return {
    id: id ?? ([firstName, lastName].filter(Boolean).join('-') || 'applicant'),
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    contactEmail: ensureString(record.contactEmail),
    phone: ensureString(record.phone),
  }
}

function extractRequestError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'message' in (error.data as Record<string, unknown>)
  ) {
    const dataMessage = (error.data as Record<string, unknown>).message
    if (typeof dataMessage === 'string' && dataMessage.trim().length > 0) {
      return dataMessage
    }
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    const message = ((error as { message?: unknown }).message as string).trim()
    if (message) {
      return message
    }
  }

  return fallback
}

function formatLanguage(language: ProfileJobLanguage): string {
  if (language.level) {
    return `${language.name} · ${language.level}`
  }

  return language.name
}

function formatApplicationStatus(value: string | null): string {
  if (!value) {
    return t('profile.jobs.applicationStates.progress')
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'request') {
    return t('profile.jobs.applicationStates.request')
  }

  if (normalized === 'progress' || normalized === 'in_progress') {
    return t('profile.jobs.applicationStates.progress')
  }

  if (normalized === 'completed' || normalized === 'done') {
    return t('profile.jobs.applicationStates.completed')
  }

  if (normalized === 'rejected') {
    return t('profile.jobs.applicationStates.rejected')
  }

  return value
}

function getApplicantName(applicant: ProfileJobApplicant | null): string {
  if (!applicant) {
    return t('profile.jobs.labels.applicantFallback')
  }

  const parts = [applicant.firstName, applicant.lastName]
    .map((part) => (part ? part.trim() : ''))
    .filter(Boolean)

  if (parts.length === 0) {
    return t('profile.jobs.labels.applicantFallback')
  }

  return parts.join(' ')
}

function formatDate(date: Date | null): string | null {
  if (!date) {
    return null
  }

  return formatDateValue(
    date,
    dateFormatter.value,
    t('profile.jobs.labels.dateFallback'),
  )
}

function handleRefresh() {
  refresh()
}
</script>

<template>
  <ProfilePageShell>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-alert
          v-if="loadErrorMessage"
          type="error"
          variant="tonal"
          density="comfortable"
          class="mb-4"
        >
          {{ loadErrorMessage }}
        </v-alert>

        <div v-if="!hasJobs && !isLoading" class="profile-jobs__state">
          <h2 class="text-h5 font-weight-semibold mb-2">
            {{ t('profile.jobs.states.empty') }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('profile.jobs.states.emptyHint') }}
          </p>
          <AppButton
            color="primary"
            variant="tonal"
            density="comfortable"
            :loading="isLoading"
            @click="handleRefresh"
          >
            {{ t('profile.jobs.page.refresh') }}
          </AppButton>
        </div>

        <div v-else class="profile-jobs__list">
          <article v-for="job in jobs" :key="job.id" class="profile-job">
            <header class="profile-job__header">
              <div>
                <p class="profile-job__eyebrow">
                  {{
                    job.company?.name || t('profile.jobs.labels.unknownCompany')
                  }}
                </p>
                <h2 class="profile-job__title">
                  {{ job.title }}
                </h2>
              </div>
              <div class="profile-job__status">
                <v-chip
                  v-if="job.owner"
                  size="small"
                  density="comfortable"
                  color="primary"
                  variant="tonal"
                >
                  {{ t('profile.jobs.badges.owner') }}
                </v-chip>
                <v-chip
                  v-if="job.applied"
                  size="small"
                  density="comfortable"
                  color="secondary"
                  variant="tonal"
                >
                  {{ t('profile.jobs.badges.applied') }}
                </v-chip>
                <v-chip
                  v-if="job.applications.length"
                  size="small"
                  density="comfortable"
                  color="info"
                  variant="tonal"
                >
                  {{
                    t('profile.jobs.labels.applicationsCount', {
                      count: job.applications.length,
                    })
                  }}
                </v-chip>
              </div>
            </header>

            <p class="profile-job__description">
              {{
                job.description ||
                t('profile.jobs.labels.descriptionUnavailable')
              }}
            </p>

            <div class="profile-job__meta">
              <div v-if="job.workLocation" class="profile-job__meta-item">
                <v-icon icon="mdi-map-marker" size="18" class="me-1" />
                <span>{{ job.workLocation }}</span>
              </div>
              <div v-if="job.workType" class="profile-job__meta-item">
                <v-icon icon="mdi-briefcase" size="18" class="me-1" />
                <span>
                  {{ t('profile.jobs.labels.workType') }} · {{ job.workType }}
                </span>
              </div>
              <div v-if="job.contractType" class="profile-job__meta-item">
                <v-icon icon="mdi-file-document" size="18" class="me-1" />
                <span>
                  {{ t('profile.jobs.labels.contractType') }} ·
                  {{ job.contractType }}
                </span>
              </div>
              <div v-if="job.salaryRange" class="profile-job__meta-item">
                <v-icon icon="mdi-cash-multiple" size="18" class="me-1" />
                <span>
                  {{ t('profile.jobs.labels.salaryRange') }} ·
                  {{ job.salaryRange }}
                </span>
              </div>
              <div v-if="job.experience" class="profile-job__meta-item">
                <v-icon icon="mdi-school" size="18" class="me-1" />
                <span>
                  {{ t('profile.jobs.labels.experience') }} ·
                  {{ job.experience }}
                </span>
              </div>
              <div v-if="job.benefits" class="profile-job__meta-item">
                <v-icon icon="mdi-crown" size="18" class="me-1" />
                <span>
                  {{ t('profile.jobs.labels.benefits') }} · {{ job.benefits }}
                </span>
              </div>
            </div>

            <div class="profile-job__details-toggle">
              <AppButton
                variant="text"
                density="comfortable"
                color="primary"
                @click="toggleJobDetails(job.id)"
              >
                {{
                  isJobExpanded(job.id)
                    ? t('profile.jobs.labels.showLess')
                    : t('profile.jobs.labels.showMore')
                }}
              </AppButton>
            </div>

            <v-expand-transition>
              <div v-if="isJobExpanded(job.id)" class="profile-job__details">
                <div v-if="job.mission" class="profile-job__section">
                  <p class="profile-job__section-title">
                    {{ t('profile.jobs.labels.mission') }}
                  </p>
                  <p class="profile-job__section-text">
                    {{ job.mission }}
                  </p>
                </div>

                <div
                  v-if="job.requiredSkills.length"
                  class="profile-job__section"
                >
                  <p class="profile-job__section-title">
                    {{ t('profile.jobs.labels.requiredSkills') }}
                  </p>
                  <div class="profile-job__chips">
                    <v-chip
                      v-for="skill in job.requiredSkills"
                      :key="skill"
                      color="primary"
                      size="small"
                      density="comfortable"
                      variant="tonal"
                    >
                      {{ skill }}
                    </v-chip>
                  </div>
                </div>

                <div v-if="job.languages.length" class="profile-job__section">
                  <p class="profile-job__section-title">
                    {{ t('profile.jobs.labels.languages') }}
                  </p>
                  <div class="profile-job__chips">
                    <v-chip
                      v-for="language in job.languages"
                      :key="language.id"
                      color="secondary"
                      size="small"
                      density="comfortable"
                      variant="tonal"
                    >
                      {{ formatLanguage(language) }}
                    </v-chip>
                  </div>
                </div>

                <div
                  v-if="job.requirements.length"
                  class="profile-job__section"
                >
                  <p class="profile-job__section-title">
                    {{ t('profile.jobs.labels.requirements') }}
                  </p>
                  <ul class="profile-job__list">
                    <li v-for="item in job.requirements" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div class="profile-job__section profile-job__section--cta">
                  <div>
                    <p class="profile-job__section-title">
                      {{ t('profile.jobs.labels.applications') }}
                    </p>
                    <p class="profile-job__section-text mb-0">
                      {{
                        t('profile.jobs.labels.applicationsCount', {
                          count: job.applications.length,
                        })
                      }}
                    </p>
                  </div>
                  <AppButton
                    color="primary"
                    variant="tonal"
                    density="comfortable"
                    :disabled="!job.applications.length"
                    @click="handleApplicantsDrawer(job)"
                  >
                    {{
                      translate(
                        'profile.jobs.drawer.openButton',
                        'View applicants',
                      )
                    }}
                  </AppButton>
                </div>

                <footer class="profile-job__footer">
                  <div class="profile-job__timestamps">
                    <p
                      v-if="formatDate(job.updatedAt)"
                      class="text-caption mb-0"
                    >
                      {{
                        t('profile.jobs.labels.updatedAt', {
                          date: formatDate(job.updatedAt),
                        })
                      }}
                    </p>
                    <p
                      v-else-if="formatDate(job.createdAt)"
                      class="text-caption mb-0"
                    >
                      {{
                        t('profile.jobs.labels.createdAt', {
                          date: formatDate(job.createdAt),
                        })
                      }}
                    </p>
                  </div>
                  <div class="profile-job__actions">
                    <AppButton
                      v-if="job.company?.siteUrl"
                      variant="tonal"
                      density="comfortable"
                      color="primary"
                      :href="job.company.siteUrl"
                      target="_blank"
                      rel="noopener"
                      prepend-icon="mdi-open-in-new"
                    >
                      {{ t('profile.jobs.labels.visitCompany') }}
                    </AppButton>
                    <AppButton
                      v-if="job.company?.contactEmail"
                      variant="text"
                      density="comfortable"
                      color="secondary"
                      :href="`mailto:${job.company.contactEmail}`"
                      prepend-icon="mdi-email"
                    >
                      {{ t('profile.jobs.labels.contactCompany') }}
                    </AppButton>
                  </div>
                </footer>
              </div>
            </v-expand-transition>
          </article>
        </div>
      </v-col>
    </v-row>

    <teleport to="#app-drawer-right">
      <AppCard class="profile-jobs__drawer" :loading="isLoading">
        <template #title>
          <div class="profile-jobs__drawer-header">
            <p class="profile-jobs__drawer-eyebrow mb-1">
              {{ selectedJobCompanyName }}
            </p>
            <h2 class="profile-jobs__drawer-title mb-0">
              {{ selectedJobTitle }}
            </h2>
          </div>
        </template>

        <div v-if="!hasJobs" class="profile-jobs__drawer-empty">
          <p class="text-medium-emphasis mb-0">
            {{
              translate(
                'profile.jobs.drawer.empty',
                'Create a job to start receiving applicants.',
              )
            }}
          </p>
        </div>
        <div v-else>
          <p class="text-overline text-medium-emphasis mb-1">
            {{ t('profile.jobs.labels.applications') }}
          </p>
          <p class="profile-job__drawer-count">
            {{
              t('profile.jobs.labels.applicationsCount', {
                count: selectedJobApplicants.length,
              })
            }}
          </p>

          <ul v-if="hasSelectedApplicants" class="profile-job__applications">
            <li
              v-for="application in selectedJobApplicants"
              :key="application.id"
              class="profile-job__application"
            >
              <div>
                <p class="profile-job__application-name">
                  {{ getApplicantName(application.applicant) }}
                </p>
                <p class="profile-job__application-meta">
                  {{
                    t('profile.jobs.labels.applicationStatus', {
                      status: formatApplicationStatus(application.status),
                    })
                  }}
                </p>
              </div>
              <div class="profile-job__application-actions">
                <AppButton
                  v-if="application.applicant?.contactEmail"
                  variant="text"
                  density="comfortable"
                  color="primary"
                  :href="`mailto:${application.applicant.contactEmail}`"
                >
                  {{ t('profile.jobs.labels.contactApplicant') }}
                </AppButton>
                <AppButton
                  v-if="application.applicant?.phone"
                  variant="text"
                  density="comfortable"
                  color="secondary"
                  :href="`tel:${application.applicant.phone}`"
                >
                  {{ t('profile.jobs.labels.callApplicant') }}
                </AppButton>
              </div>
            </li>
          </ul>
          <p v-else class="text-medium-emphasis mb-0">
            {{
              translate(
                'profile.jobs.drawer.noApplicants',
                'No applicants yet for this job.',
              )
            }}
          </p>
        </div>
      </AppCard>
    </teleport>
  </ProfilePageShell>
</template>

<style scoped>
.profile-jobs-card {
  padding: clamp(1rem, 2vw, 2rem);
  border-radius: 28px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface), 0.98),
    rgba(var(--v-theme-surface), 0.85)
  );
}

.profile-jobs__state {
  text-align: center;
  padding: 3rem 1rem;
}

.profile-jobs__list {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.75rem);
}

.profile-job {
  border: 1px solid rgba(var(--v-border-color), 0.25);
  border-radius: 24px;
  padding: clamp(1.25rem, 2vw, 1.75rem);
  background-color: rgba(var(--v-theme-background), 0.9);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
}

.profile-job__header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 960px) {
  .profile-job__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.profile-job__eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-primary), 0.9);
  margin-bottom: 0.25rem;
}

.profile-job__title {
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  margin: 0;
}

.profile-job__status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-job__description {
  margin: 1rem 0 0;
  color: rgba(var(--v-theme-on-surface), 0.78);
  line-height: 1.6;
}

.profile-job__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin-top: 1.25rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
  font-size: 0.95rem;
}

.profile-job__meta-item {
  display: inline-flex;
  align-items: center;
}

.profile-job__details-toggle {
  margin-top: 1rem;
}

.profile-job__details {
  margin-top: 1.5rem;
}

.profile-job__section {
  margin-top: 1.5rem;
}

.profile-job__section-title {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 0.5rem;
}

.profile-job__section-text {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.78);
}

.profile-job__section--cta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.profile-job__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-job__list {
  margin: 0;
  padding-left: 1.25rem;
  color: rgba(var(--v-theme-on-surface), 0.78);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.profile-job__applications {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile-job__application {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.2);
}

.profile-job__application:last-child {
  border-bottom: none;
}

@media (min-width: 720px) {
  .profile-job__application {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.profile-job__application-name {
  font-weight: 600;
  margin: 0;
}

.profile-job__application-meta {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}

.profile-job__application-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-job__footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(var(--v-border-color), 0.2);
  padding-top: 1rem;
}

@media (min-width: 720px) {
  .profile-job__footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.profile-job__timestamps {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.profile-jobs__drawer {
  padding: 0.25rem;
  background: transparent;
}

.profile-jobs__drawer-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.profile-jobs__drawer-eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.profile-jobs__drawer-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.profile-job__drawer-count {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.profile-jobs__drawer-empty {
  padding: 1rem 0;
}

.profile-job__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
