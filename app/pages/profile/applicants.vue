<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppModal from '~/components/ui/AppModal.vue'
import { Notify } from '~/stores/notification'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'

interface ApplicantRecord {
  id: string
  firstName?: string | null
  lastName?: string | null
  contactEmail?: string | null
  phone?: string | null
  jobPreferences?: string | null
  resume?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

type ApplicantCollectionResponse = ApplicantRecord[] | { data?: ApplicantRecord[] }

type DialogMode = 'create' | 'edit'

type ApplicantFormState = {
  firstName: string
  lastName: string
  contactEmail: string
  phone: string
  file: File | File[] | null
}

definePageMeta({
  title: 'navigation.profileApplicants',
  middleware: 'auth',
})

const { locale } = useI18n()
const translate = useTranslateWithFallback()
const jobApi = useJobPlatformApi()

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

const dialog = reactive({
  open: false,
  mode: 'create' as DialogMode,
})

const form = reactive<ApplicantFormState>({
  firstName: '',
  lastName: '',
  contactEmail: '',
  phone: '',
  file: null,
})

const formError = ref('')
const isSaving = ref(false)
const selectedApplicant = ref<ApplicantRecord | null>(null)

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })

const {
  data: applicantsResponse,
  pending,
  error,
  refresh,
} = await useAsyncData<ApplicantCollectionResponse>(
  'profile-applicants',
  async () => await jobApi.currentApplicant.list<ApplicantCollectionResponse>(),
  { server: true },
)

const applicants = computed<ApplicantRecord[]>(() => {
  const value = applicantsResponse.value
  if (Array.isArray(value)) {
    return value
  }

  if (value && typeof value === 'object' && Array.isArray(value.data)) {
    return value.data
  }

  return []
})

const hasApplicants = computed(() => applicants.value.length > 0)
const applicantStats = computed(() => {
  const total = applicants.value.length
  const withResume = applicants.value.filter((applicant) => {
    if (typeof applicant.resume !== 'string') {
      return false
    }
    return applicant.resume.trim().length > 0
  }).length
  const contactable = applicants.value.filter(
    (applicant) => typeof applicant.contactEmail === 'string' && applicant.contactEmail.trim().length > 0,
  ).length

  return { total, withResume, contactable }
})
const isLoading = computed(() => pending.value)

const loadErrorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  return extractRequestError(
    error.value,
    translate('profile.applicants.notifications.loadFailed', 'Unable to load your applicants.'),
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
      translate('profile.applicants.notifications.loadFailed', 'Unable to load your applicants.'),
    )
    Notify.error(message)
  },
)

function applicantFullName(applicant: ApplicantRecord) {
  const parts = [applicant.firstName, applicant.lastName]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0)

  if (parts.length === 0) {
    return translate('profile.applicants.labels.unnamed', 'Unnamed applicant')
  }

  return parts.join(' ')
}

function formatDate(value: string | null | undefined) {
  if (!value) return null
  return formatDateValue(value, dateFormatter.value, null)
}

function openCreateDialog() {
  dialog.mode = 'create'
  dialog.open = true
  selectedApplicant.value = null
  resetForm()
}

function openEditDialog(applicant: ApplicantRecord) {
  dialog.mode = 'edit'
  dialog.open = true
  selectedApplicant.value = applicant
  form.firstName = applicant.firstName ?? ''
  form.lastName = applicant.lastName ?? ''
  form.contactEmail = applicant.contactEmail ?? ''
  form.phone = applicant.phone ?? ''
  form.file = null
  formError.value = ''
}

function closeDialog() {
  dialog.open = false
}

function resetForm() {
  form.firstName = ''
  form.lastName = ''
  form.contactEmail = ''
  form.phone = ''
  form.file = null
  formError.value = ''
}

async function saveApplicant() {
  formError.value = ''
  const payload = new FormData()
  payload.set('firstName', form.firstName)
  payload.set('lastName', form.lastName)
  payload.set('contactEmail', form.contactEmail)
  payload.set('phone', form.phone)

  const file = Array.isArray(form.file) ? form.file[0] ?? null : form.file
  if (file) {
    payload.set('file', file, file.name)
  }

  try {
    isSaving.value = true

    if (dialog.mode === 'edit' && selectedApplicant.value) {
      await jobApi.currentApplicant.update(selectedApplicant.value.id, payload)
      Notify.success(
        translate('profile.applicants.notifications.updateSuccess', 'Applicant updated successfully.'),
      )
    } else {
      await jobApi.currentApplicant.create(payload)
      Notify.success(
        translate('profile.applicants.notifications.createSuccess', 'Applicant created successfully.'),
      )
    }

    await refresh()
    closeDialog()
    resetForm()
  } catch (requestError) {
    formError.value = extractRequestError(
      requestError,
      translate('profile.applicants.notifications.saveFailed', 'Unable to save this applicant.'),
    )
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <ProfilePageShell>
    <v-row class="g-6">
      <v-col cols="12">
        <AppCard class="profile-applicants__hero" variant="flat" elevation="0">
          <div class="profile-applicants__hero-grid">
            <div class="profile-applicants__hero-text">
              <p class="text-overline text-medium-emphasis mb-1">
                {{ translate('profile.applicants.heading', 'Talent pipeline') }}
              </p>
              <h1 class="text-h4 text-h5-sm font-weight-bold mb-2">
                {{ translate('profile.applicants.title', 'My applicants') }}
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{
                  translate(
                    'profile.applicants.description',
                    'Keep track of every resume, preference, and contact without leaving your dashboard.',
                  )
                }}
              </p>
              <div class="profile-applicants__hero-actions">
                <AppButton color="primary" @click="openCreateDialog">
                  {{ translate('profile.applicants.actions.create', 'Add applicant') }}
                </AppButton>
                <AppButton variant="text" @click="refresh">
                  {{ translate('profile.applicants.actions.refresh', 'Refresh') }}
                </AppButton>
              </div>
            </div>
            <div class="profile-applicants__stats">
              <div class="profile-applicants__stat">
                <p class="text-overline text-medium-emphasis mb-1">
                  {{ translate('profile.applicants.stats.total', 'Total') }}
                </p>
                <p class="profile-applicants__stat-value">
                  {{ applicantStats.total }}
                </p>
              </div>
              <div class="profile-applicants__stat">
                <p class="text-overline text-medium-emphasis mb-1">
                  {{ translate('profile.applicants.stats.contactable', 'Contact ready') }}
                </p>
                <p class="profile-applicants__stat-value">
                  {{ applicantStats.contactable }}
                </p>
              </div>
              <div class="profile-applicants__stat">
                <p class="text-overline text-medium-emphasis mb-1">
                  {{ translate('profile.applicants.stats.withResume', 'With resume') }}
                </p>
                <p class="profile-applicants__stat-value">
                  {{ applicantStats.withResume }}
                </p>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12">
        <AppCard
          class="profile-applicants__list-card"
          :title="translate('profile.applicants.list.title', 'Applicants list')"
          :loading="isLoading"
        >
          <template #append>
            <AppButton size="small" variant="tonal" color="primary" @click="openCreateDialog">
              {{ translate('profile.applicants.actions.create', 'Add applicant') }}
            </AppButton>
          </template>

          <p v-if="loadErrorMessage" class="text-error mb-0">
            {{ loadErrorMessage }}
          </p>

          <div v-else-if="!hasApplicants" class="profile-applicants__empty">
            <v-icon icon="mdi-account-search" size="40" class="mb-3" />
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ translate('profile.applicants.empty', 'You have not created any applicants yet.') }}
            </p>
            <AppButton color="primary" variant="tonal" @click="openCreateDialog">
              {{ translate('profile.applicants.actions.create', 'Add applicant') }}
            </AppButton>
          </div>

          <div v-else class="profile-applicants__grid">
            <AppCard
              v-for="applicant in applicants"
              :key="applicant.id"
              class="profile-applicants__item"
              hover
            >
              <div class="profile-applicants__item-header">
                <div>
                  <p class="profile-applicants__item-name mb-1">
                    {{ applicantFullName(applicant) }}
                  </p>
                  <p class="profile-applicants__item-meta mb-0">
                    {{
                      applicant.jobPreferences ||
                        translate(
                          'profile.applicants.labels.noPreferences',
                          'No job preferences yet.',
                        )
                    }}
                  </p>
                </div>
                <AppButton
                  size="small"
                  variant="text"
                  color="primary"
                  @click="openEditDialog(applicant)"
                >
                  {{ translate('profile.applicants.actions.edit', 'Edit') }}
                </AppButton>
              </div>

              <div class="profile-applicants__item-body">
                <p v-if="applicant.contactEmail" class="text-body-2 mb-1">
                  <v-icon icon="mdi-email" size="16" class="me-2" />
                  {{ applicant.contactEmail }}
                </p>
                <p v-if="applicant.phone" class="text-body-2 mb-1">
                  <v-icon icon="mdi-phone" size="16" class="me-2" />
                  {{ applicant.phone }}
                </p>
                <p v-if="applicant.resume" class="text-body-2 mb-1">
                  <v-icon icon="mdi-paperclip" size="16" class="me-2" />
                  {{ translate('profile.applicants.labels.resumeUploaded', 'Resume uploaded') }}
                </p>
              </div>

              <div class="profile-applicants__item-footer">
                <p class="text-caption text-medium-emphasis mb-0">
                  <span v-if="formatDate(applicant.updatedAt)">
                    {{ translate('profile.applicants.labels.updated', 'Updated') }}:
                    {{ formatDate(applicant.updatedAt) }}
                  </span>
                  <span v-else-if="formatDate(applicant.createdAt)">
                    {{ translate('profile.applicants.labels.created', 'Created') }}:
                    {{ formatDate(applicant.createdAt) }}
                  </span>
                  <span v-else>
                    {{ translate('profile.applicants.labels.noDates', 'No timeline available') }}
                  </span>
                </p>
                <div class="profile-applicants__item-actions">
                  <AppButton
                    v-if="applicant.contactEmail"
                    size="small"
                    variant="text"
                    color="primary"
                    :href="`mailto:${applicant.contactEmail}`"
                  >
                    {{ translate('profile.applicants.actions.email', 'Email') }}
                  </AppButton>
                  <AppButton
                    v-if="applicant.phone"
                    size="small"
                    variant="text"
                    color="secondary"
                    :href="`tel:${applicant.phone}`"
                  >
                    {{ translate('profile.applicants.actions.call', 'Call') }}
                  </AppButton>
                </div>
              </div>
            </AppCard>
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <AppModal v-model="dialog.open" :max-width="640" scrollable>
      <AppCard
        :title="
          dialog.mode === 'edit'
            ? translate('profile.applicants.dialog.editTitle', 'Edit applicant')
            : translate('profile.applicants.dialog.createTitle', 'Create applicant')
        "
      >
        <v-form @submit.prevent="saveApplicant">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.firstName"
                :label="translate('profile.applicants.form.firstName', 'First name')"
                hide-details="auto"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.lastName"
                :label="translate('profile.applicants.form.lastName', 'Last name')"
                hide-details="auto"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.contactEmail"
                :label="translate('profile.applicants.form.contactEmail', 'Contact email')"
                type="email"
                hide-details="auto"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.phone"
                :label="translate('profile.applicants.form.phone', 'Phone number')"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="form.file"
                accept="application/pdf,.doc,.docx,.png,.jpg,.jpeg"
                prepend-icon="mdi-paperclip"
                :label="translate('profile.applicants.form.file', 'Resume (optional)')"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <p v-if="formError" class="text-error text-body-2 mt-2 mb-4">
            {{ formError }}
          </p>

          <div class="profile-applicants__dialog-actions">
            <AppButton variant="text" @click="closeDialog">
              {{ translate('common.cancel', 'Cancel') }}
            </AppButton>
            <AppButton color="primary" type="submit" :loading="isSaving">
              {{ dialog.mode === 'edit'
                ? translate('profile.applicants.actions.save', 'Save changes')
                : translate('profile.applicants.actions.createConfirm', 'Create applicant')
              }}
            </AppButton>
          </div>
        </v-form>
      </AppCard>
    </AppModal>
  </ProfilePageShell>
</template>

<style scoped>
.profile-applicants__hero {
  padding: clamp(1.25rem, 3vw, 2.5rem);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-surface), 0.95)
  );
}

.profile-applicants__hero-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 960px) {
  .profile-applicants__hero-grid {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.profile-applicants__hero-text {
  flex: 2;
}

.profile-applicants__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.profile-applicants__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  flex: 1;
}

.profile-applicants__stat {
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background-color: rgba(var(--v-theme-surface), 0.7);
}

.profile-applicants__stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.profile-applicants__list-card {
  padding: clamp(1.25rem, 2vw, 1.75rem);
}

.profile-applicants__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
}

.profile-applicants__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.profile-applicants__item {
  padding: 1.25rem;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.profile-applicants__item-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.profile-applicants__item-name {
  font-weight: 600;
}

.profile-applicants__item-meta {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.profile-applicants__item-body {
  margin-top: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.profile-applicants__item-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.profile-applicants__item-actions {
  display: flex;
  gap: 0.5rem;
}

.profile-applicants__dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
