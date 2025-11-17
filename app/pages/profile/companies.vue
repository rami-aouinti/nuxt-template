<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'

interface CompanyRecord {
  id: string
  name?: string | null
  description?: string | null
  location?: string | null
  contactEmail?: string | null
  siteUrl?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

type CompanyCollectionResponse = CompanyRecord[] | { data?: CompanyRecord[] }

type CompanyFormState = {
  name: string
  description: string
  location: string
  contactEmail: string
  siteUrl: string
  file: File | File[] | null
}

definePageMeta({
  title: 'navigation.profileCompanies',
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

const createForm = reactive<CompanyFormState>({
  name: '',
  description: '',
  location: '',
  contactEmail: '',
  siteUrl: '',
  file: null,
})

const formError = ref('')
const isSaving = ref(false)

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })

const {
  data: companiesResponse,
  pending,
  error,
  refresh,
} = await useAsyncData<CompanyCollectionResponse>(
  'profile-companies',
  async () => await jobApi.companies.profileList<CompanyCollectionResponse>(),
  { server: true },
)

const companies = computed<CompanyRecord[]>(() => {
  const value = companiesResponse.value
  if (Array.isArray(value)) {
    return value
  }

  if (value && typeof value === 'object' && Array.isArray(value.data)) {
    return value.data
  }

  return []
})

const hasCompanies = computed(() => companies.value.length > 0)
const isLoading = computed(() => pending.value)

const loadErrorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  return extractRequestError(
    error.value,
    translate('profile.companies.notifications.loadFailed', 'Unable to load your companies.'),
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
      translate('profile.companies.notifications.loadFailed', 'Unable to load your companies.'),
    )
    Notify.error(message)
  },
)

function formatDate(value: string | null | undefined) {
  if (!value) return null
  return formatDateValue(value, dateFormatter.value, null)
}

function resetForm() {
  createForm.name = ''
  createForm.description = ''
  createForm.location = ''
  createForm.contactEmail = ''
  createForm.siteUrl = ''
  createForm.file = null
  formError.value = ''
}

async function submitCompany() {
  formError.value = ''
  const payload = new FormData()
  payload.set('name', createForm.name)
  payload.set('description', createForm.description)
  payload.set('location', createForm.location)
  payload.set('contactEmail', createForm.contactEmail)
  payload.set('siteUrl', createForm.siteUrl)

  const file = Array.isArray(createForm.file) ? createForm.file[0] ?? null : createForm.file
  if (file) {
    payload.set('file', file, file.name)
  }

  try {
    isSaving.value = true
    await jobApi.companies.create(payload)
    Notify.success(
      translate('profile.companies.notifications.createSuccess', 'Company created successfully.'),
    )
    resetForm()
    await refresh()
  } catch (requestError) {
    formError.value = extractRequestError(
      requestError,
      translate('profile.companies.notifications.saveFailed', 'Unable to create this company.'),
    )
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <ProfilePageShell>
    <v-row class="g-6">
      <v-col cols="12" lg="5">
        <AppCard :title="translate('profile.companies.form.title', 'Create a company')">
          <v-form @submit.prevent="submitCompany">
            <v-text-field
              v-model="createForm.name"
              :label="translate('profile.companies.form.name', 'Company name')"
              hide-details="auto"
              class="mb-4"
              required
            />
            <v-textarea
              v-model="createForm.description"
              :label="translate('profile.companies.form.description', 'Description')"
              hide-details="auto"
              class="mb-4"
              auto-grow
            />
            <v-text-field
              v-model="createForm.location"
              :label="translate('profile.companies.form.location', 'Location')"
              hide-details="auto"
              class="mb-4"
            />
            <v-text-field
              v-model="createForm.contactEmail"
              :label="translate('profile.companies.form.email', 'Contact email')"
              type="email"
              hide-details="auto"
              class="mb-4"
            />
            <v-text-field
              v-model="createForm.siteUrl"
              :label="translate('profile.companies.form.siteUrl', 'Website')"
              hide-details="auto"
              class="mb-4"
            />
            <v-file-input
              v-model="createForm.file"
              accept="image/*"
              prepend-icon="mdi-image"
              :label="translate('profile.companies.form.file', 'Logo (optional)')"
              hide-details="auto"
              class="mb-4"
            />

            <p v-if="formError" class="text-error text-body-2 mb-4">
              {{ formError }}
            </p>

            <div class="d-flex justify-end">
              <AppButton color="primary" type="submit" :loading="isSaving">
                {{ translate('profile.companies.actions.create', 'Save company') }}
              </AppButton>
            </div>
          </v-form>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="7">
        <AppCard :title="translate('profile.companies.list.title', 'My companies')">
          <div v-if="isLoading" class="py-6 text-center">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div v-else>
            <p v-if="loadErrorMessage" class="text-error mb-0">
              {{ loadErrorMessage }}
            </p>

            <p v-else-if="!hasCompanies" class="text-medium-emphasis mb-0">
              {{ translate('profile.companies.list.empty', 'You have not created any companies yet.') }}
            </p>

            <v-row v-else class="g-4">
              <v-col v-for="company in companies" :key="company.id" cols="12">
                <AppCard hover>
                  <h3 class="text-h6 mb-2">
                    {{ company.name || translate('profile.companies.labels.untitled', 'Untitled company') }}
                  </h3>
                  <p v-if="company.description" class="text-body-2 mb-2">
                    {{ company.description }}
                  </p>
                  <div v-if="company.location" class="text-body-2 mb-1">
                    <v-icon icon="mdi-map-marker" size="16" class="me-2" />
                    {{ company.location }}
                  </div>
                  <div v-if="company.contactEmail" class="text-body-2 mb-1">
                    <v-icon icon="mdi-email" size="16" class="me-2" />
                    {{ company.contactEmail }}
                  </div>
                  <div v-if="company.siteUrl" class="text-body-2 mb-3">
                    <v-icon icon="mdi-link" size="16" class="me-2" />
                    <a :href="company.siteUrl" target="_blank" rel="noopener" class="text-primary">
                      {{ company.siteUrl }}
                    </a>
                  </div>
                  <p class="text-caption text-medium-emphasis mb-0">
                    <span v-if="formatDate(company.updatedAt)">
                      {{ translate('profile.companies.labels.updated', 'Updated') }}:
                      {{ formatDate(company.updatedAt) }}
                    </span>
                    <span v-else-if="formatDate(company.createdAt)">
                      {{ translate('profile.companies.labels.created', 'Created') }}:
                      {{ formatDate(company.createdAt) }}
                    </span>
                    <span v-else>
                      {{ translate('profile.companies.labels.noDates', 'No timeline available') }}
                    </span>
                  </p>
                </AppCard>
              </v-col>
            </v-row>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>
