<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import type {
  Experience,
  Formation,
  Hobby,
  Project,
  Reference,
  ResumeLanguage,
  Skill,
} from '~/types/resume'

interface ApplicantProfileRecord {
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  title?: string | null
  description?: string | null
  contactEmail?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  location?: string | null
}

type ResumeOverviewResponse = {
  applicant?: Record<string, unknown> | null
  education?: Formation[] | null
  educations?: Formation[] | null
  experience?: Experience[] | null
  experiences?: Experience[] | null
  skills?: Skill[] | null
  languages?: ResumeLanguage[] | null
  hobbies?: Hobby[] | null
  projects?: Project[] | null
  references?: Reference[] | null
}

definePageMeta({
  title: 'navigation.profileResumePreview',
  middleware: 'auth',
})

const { locale } = useI18n()
const translate = useTranslateWithFallback()
const jobApi = useJobPlatformApi()
const drawerRight = useState('drawerRight', () => false)

function extractRequestError(error: unknown, fallback: string) {
  if (error instanceof FetchError) {
    const data = error.data as Record<string, unknown> | undefined
    if (data && typeof data.message === 'string') {
      return data.message
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && typeof error.message === 'string') {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[]
  }

  return []
}

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })
const presentLabel = computed(() => translate('profile.resume.labels.present', 'Present'))

const {
  data: overviewResponse,
  pending,
  error,
  refresh,
} = await useAsyncData<ResumeOverviewResponse>(
  'profile-resume-overview',
  async () => await jobApi.resume.overview<ResumeOverviewResponse>(),
  { server: true },
)

const overview = computed(() => overviewResponse.value ?? null)

const applicantProfile = computed<ApplicantProfileRecord | null>(() => {
  const value = overview.value?.applicant
  if (value && typeof value === 'object') {
    return value as ApplicantProfileRecord
  }

  return null
})

const applicantName = computed(() => {
  if (!applicantProfile.value) {
    return translate('profile.resumePreview.labels.unnamed', 'Unnamed applicant')
  }

  const firstName = applicantProfile.value.firstName?.trim() ?? ''
  const lastName = applicantProfile.value.lastName?.trim() ?? ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  if (fullName) {
    return fullName
  }

  if (typeof applicantProfile.value.username === 'string') {
    return applicantProfile.value.username
  }

  return translate('profile.resumePreview.labels.unnamed', 'Unnamed applicant')
})

const applicantTitle = computed(() => {
  if (!applicantProfile.value) return null
  if (typeof applicantProfile.value.title === 'string') {
    const value = applicantProfile.value.title.trim()
    return value.length > 0 ? value : null
  }
  return null
})

const applicantSummary = computed(() => {
  if (!applicantProfile.value) return null
  if (typeof applicantProfile.value.description === 'string') {
    const value = applicantProfile.value.description.trim()
    return value.length > 0 ? value : null
  }
  return null
})

const applicantEmail = computed(() => {
  if (!applicantProfile.value) return null
  const value = applicantProfile.value.contactEmail ?? applicantProfile.value.email
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }
  return null
})

const applicantPhone = computed(() => {
  if (!applicantProfile.value) return null
  const value = applicantProfile.value.phone
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }
  return null
})

const applicantLocation = computed(() => {
  if (!applicantProfile.value) return null
  const value = applicantProfile.value.address ?? applicantProfile.value.location
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }
  return null
})

const educationItems = computed(() => {
  return ensureArray<Formation>(overview.value?.education ?? overview.value?.educations ?? [])
})

const experienceItems = computed(() => {
  return ensureArray<Experience>(overview.value?.experience ?? overview.value?.experiences ?? [])
})

const skillItems = computed(() => ensureArray<Skill>(overview.value?.skills ?? []))
const languageItems = computed(() => ensureArray<ResumeLanguage>(overview.value?.languages ?? []))
const hobbyItems = computed(() => ensureArray<Hobby>(overview.value?.hobbies ?? []))
const projectItems = computed(() => ensureArray<Project>(overview.value?.projects ?? []))
const referenceItems = computed(() => ensureArray<Reference>(overview.value?.references ?? []))

const isLoading = computed(() => pending.value)
const isGenerating = ref(false)

onMounted(() => {
  drawerRight.value = true
})

const loadErrorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  return extractRequestError(
    error.value,
    translate('profile.resumePreview.notifications.loadFailed', 'Unable to load your resume overview.'),
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
      translate('profile.resumePreview.notifications.loadFailed', 'Unable to load your resume overview.'),
    )
    Notify.error(message)
  },
)

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start && !end) {
    return translate('profile.resumePreview.labels.noDates', 'Dates unavailable')
  }

  const startText = start ? formatDateValue(start, dateFormatter.value, '') : ''
  const endText = end ? formatDateValue(end, dateFormatter.value, '') : presentLabel.value

  if (startText && endText) {
    return `${startText} – ${endText}`
  }

  if (startText) {
    return startText
  }

  return endText || presentLabel.value
}

async function handleGenerate() {
  try {
    isGenerating.value = true
    await jobApi.resume.generate()
    Notify.success(
      translate('profile.resumePreview.notifications.generateSuccess', 'Resume export requested successfully.'),
    )
  } catch (requestError) {
    const message = extractRequestError(
      requestError,
      translate('profile.resumePreview.notifications.generateFailed', 'Unable to generate your resume right now.'),
    )
    Notify.error(message)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <ProfilePageShell>
    <v-row class="g-6">
      <v-col cols="12">
        <AppCard class="mb-4" :loading="isLoading">
          <div class="d-flex flex-column flex-md-row align-md-center justify-space-between gap-4">
            <div>
              <p class="text-overline mb-1 text-medium-emphasis">
                {{ translate('profile.resumePreview.labels.heading', 'Resume overview') }}
              </p>
              <h1 class="text-h5 mb-1">
                {{ applicantName }}
              </h1>
              <p v-if="applicantTitle" class="text-body-2 text-primary mb-2">
                {{ applicantTitle }}
              </p>
              <p v-if="applicantSummary" class="text-body-2 text-medium-emphasis mb-0">
                {{ applicantSummary }}
              </p>
              <p v-else class="text-body-2 text-medium-emphasis mb-0">
                {{ translate('profile.resumePreview.labels.summaryFallback', 'Keep building your profile to showcase it here.') }}
              </p>
            </div>
            <div class="d-flex flex-column flex-sm-row gap-3 justify-end">
              <AppButton variant="tonal" @click="refresh">
                {{ translate('profile.resumePreview.actions.refresh', 'Refresh data') }}
              </AppButton>
              <AppButton color="primary" :loading="isGenerating" @click="handleGenerate">
                {{ translate('profile.resumePreview.actions.generate', 'Generate PDF') }}
              </AppButton>
            </div>
          </div>
          <p v-if="loadErrorMessage" class="text-error text-body-2 mt-4 mb-0">
            {{ loadErrorMessage }}
          </p>
        </AppCard>
      </v-col>

      <v-col cols="12">
        <AppCard :title="translate('profile.resumePreview.sections.experience', 'Experience')" :loading="isLoading">
          <div v-if="experienceItems.length" class="d-flex flex-column gap-4">
            <div v-for="experience in experienceItems" :key="experience.id">
              <div class="d-flex justify-space-between flex-wrap gap-2">
                <h3 class="text-subtitle-1 mb-0">
                  {{ experience.title }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ formatDateRange(experience.startedAt, experience.endedAt) }}
                </p>
              </div>
              <p v-if="experience.company" class="text-body-2 text-primary mb-1">
                {{ experience.company }}
              </p>
              <p v-if="experience.description" class="text-body-2 mb-0">
                {{ experience.description }}
              </p>
            </div>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.experience', 'Add your experience to show your journey.') }}
          </p>
        </AppCard>

        <AppCard class="mt-6" :title="translate('profile.resumePreview.sections.education', 'Education')" :loading="isLoading">
          <div v-if="educationItems.length" class="d-flex flex-column gap-4">
            <div v-for="education in educationItems" :key="education.id">
              <div class="d-flex justify-space-between flex-wrap gap-2">
                <h3 class="text-subtitle-1 mb-0">
                  {{ education.name }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ formatDateRange(education.startedAt, education.endedAt) }}
                </p>
              </div>
              <p v-if="education.school" class="text-body-2 text-primary mb-1">
                {{ education.school }}
              </p>
              <p v-if="education.description" class="text-body-2 mb-0">
                {{ education.description }}
              </p>
            </div>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.education', 'No education records yet.') }}
          </p>
        </AppCard>

        <AppCard class="mt-6" :title="translate('profile.resumePreview.sections.projects', 'Projects')" :loading="isLoading">
          <div v-if="projectItems.length" class="d-flex flex-column gap-4">
            <div v-for="project in projectItems" :key="project.id">
              <div class="d-flex justify-space-between flex-wrap gap-2">
                <h3 class="text-subtitle-1 mb-0">
                  {{ project.name }}
                </h3>
                <a
                  v-if="project.gitLink"
                  :href="project.gitLink"
                  target="_blank"
                  rel="noopener"
                  class="text-primary text-body-2"
                >
                  {{ translate('profile.resumePreview.actions.viewProject', 'View project') }}
                </a>
              </div>
              <p v-if="project.description" class="text-body-2 mb-0">
                {{ project.description }}
              </p>
            </div>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.projects', 'No projects added yet.') }}
          </p>
        </AppCard>

        <AppCard class="mt-6" :title="translate('profile.resumePreview.sections.references', 'References')" :loading="isLoading">
          <div v-if="referenceItems.length" class="d-flex flex-column gap-4">
            <div v-for="reference in referenceItems" :key="reference.id">
              <div class="d-flex justify-space-between flex-wrap gap-2">
                <h3 class="text-subtitle-1 mb-0">
                  {{ reference.title }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ formatDateRange(reference.startedAt, reference.endedAt) }}
                </p>
              </div>
              <p v-if="reference.company" class="text-body-2 text-primary mb-1">
                {{ reference.company }}
              </p>
              <p v-if="reference.description" class="text-body-2 mb-0">
                {{ reference.description }}
              </p>
            </div>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.references', 'Add references to highlight your collaborations.') }}
          </p>
        </AppCard>
      </v-col>
    </v-row>

    <teleport to="#app-drawer-right">
      <div class="resume-preview__drawer">
        <AppCard :title="translate('profile.resumePreview.sections.contact', 'Contact')" :loading="isLoading">
          <div class="d-flex flex-column gap-2">
            <p v-if="applicantEmail" class="text-body-2 mb-0">
              <v-icon icon="mdi-email" size="18" class="me-2" />
              {{ applicantEmail }}
            </p>
            <p v-if="applicantPhone" class="text-body-2 mb-0">
              <v-icon icon="mdi-phone" size="18" class="me-2" />
              {{ applicantPhone }}
            </p>
            <p v-if="applicantLocation" class="text-body-2 mb-0">
              <v-icon icon="mdi-map-marker" size="18" class="me-2" />
              {{ applicantLocation }}
            </p>
            <p v-if="!applicantEmail && !applicantPhone && !applicantLocation" class="text-medium-emphasis mb-0">
              {{ translate('profile.resumePreview.empty.contact', 'No contact details yet.') }}
            </p>
          </div>
        </AppCard>

        <AppCard :title="translate('profile.resumePreview.sections.skills', 'Skills')" :loading="isLoading">
          <div v-if="skillItems.length" class="d-flex flex-wrap gap-2">
            <v-chip v-for="skill in skillItems" :key="skill.id" color="primary" variant="tonal">
              {{ skill.name }}
              <span v-if="skill.type" class="text-caption text-medium-emphasis ms-1">
                ({{ skill.type }})
              </span>
            </v-chip>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.skills', 'No skills added yet.') }}
          </p>
        </AppCard>

        <AppCard :title="translate('profile.resumePreview.sections.languages', 'Languages')" :loading="isLoading">
          <div v-if="languageItems.length" class="d-flex flex-column gap-3">
            <div v-for="language in languageItems" :key="language.id">
              <div class="d-flex justify-space-between text-body-2 mb-1">
                <span>{{ language.name }}</span>
                <span>{{ language.level }}</span>
              </div>
              <v-progress-linear
                :model-value="Math.min(Math.max(language.level ?? 0, 0), 10) * 10"
                color="primary"
                height="6"
                rounded
              />
            </div>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.languages', 'No languages specified yet.') }}
          </p>
        </AppCard>

        <AppCard :title="translate('profile.resumePreview.sections.hobbies', 'Hobbies')" :loading="isLoading">
          <div v-if="hobbyItems.length" class="d-flex flex-wrap gap-2">
            <v-chip v-for="hobby in hobbyItems" :key="hobby.id" variant="tonal">
              <v-icon v-if="hobby.icon" :icon="hobby.icon" size="16" class="me-1" />
              {{ hobby.name }}
            </v-chip>
          </div>
          <p v-else class="text-medium-emphasis mb-0">
            {{ translate('profile.resumePreview.empty.hobbies', 'Share your interests to personalize your resume.') }}
          </p>
        </AppCard>
      </div>
    </teleport>
  </ProfilePageShell>
</template>

<style scoped>
.resume-preview__drawer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
