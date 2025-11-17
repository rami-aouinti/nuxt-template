<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
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
    <v-row>
      <v-col cols="12">
        <AppCard :title="translate('profile.applicants.title', 'My applicants')" class="mb-6">
          <template #append>
            <AppButton color="primary" @click="openCreateDialog">
              {{ translate('profile.applicants.actions.create', 'Add applicant') }}
            </AppButton>
          </template>

          <div v-if="isLoading" class="py-6 text-center">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div v-else>
            <p v-if="loadErrorMessage" class="text-error mb-0">
              {{ loadErrorMessage }}
            </p>

            <p v-else-if="!hasApplicants" class="text-medium-emphasis mb-0">
              {{ translate('profile.applicants.empty', 'You have not created any applicants yet.') }}
            </p>

            <v-row v-else class="g-4">
              <v-col v-for="applicant in applicants" :key="applicant.id" cols="12" md="6">
                <AppCard hover>
                  <div class="d-flex align-center justify-space-between mb-2">
                    <h3 class="text-h6 mb-0">
                      {{ applicantFullName(applicant) }}
                    </h3>
                    <AppButton
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditDialog(applicant)"
                    >
                      {{ translate('profile.applicants.actions.edit', 'Edit') }}
                    </AppButton>
                  </div>

                  <p v-if="applicant.contactEmail" class="text-body-2 mb-1">
                    <v-icon icon="mdi-email" size="16" class="me-2" />
                    {{ applicant.contactEmail }}
                  </p>
                  <p v-if="applicant.phone" class="text-body-2 mb-1">
                    <v-icon icon="mdi-phone" size="16" class="me-2" />
                    {{ applicant.phone }}
                  </p>
                  <p v-if="applicant.jobPreferences" class="text-body-2 mb-1">
                    <v-icon icon="mdi-briefcase" size="16" class="me-2" />
                    {{ applicant.jobPreferences }}
                  </p>
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
                </AppCard>
              </v-col>
            </v-row>
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog.open" max-width="560">
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

          <div class="d-flex justify-end gap-3">
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
    </v-dialog>
  </ProfilePageShell>
</template>
