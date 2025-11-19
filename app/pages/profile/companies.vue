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
const companyStats = computed(() => {
  const total = companies.value.length
  const withContact = companies.value.filter(
    (company) =>
      typeof company.contactEmail === 'string' &&
      company.contactEmail.trim().length > 0,
  ).length
  const withWebsite = companies.value.filter(
    (company) =>
      typeof company.siteUrl === 'string' && company.siteUrl.trim().length > 0,
  ).length

  return { total, withContact, withWebsite }
})
const isLoading = computed(() => pending.value)

const loadErrorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  return extractRequestError(
    error.value,
    translate(
      'profile.companies.notifications.loadFailed',
      'Unable to load your companies.',
    ),
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
      translate(
        'profile.companies.notifications.loadFailed',
        'Unable to load your companies.',
      ),
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

  const file = Array.isArray(createForm.file)
    ? (createForm.file[0] ?? null)
    : createForm.file
  if (file) {
    payload.set('file', file, file.name)
  }

  try {
    isSaving.value = true
    await jobApi.companies.create(payload)
    Notify.success(
      translate(
        'profile.companies.notifications.createSuccess',
        'Company created successfully.',
      ),
    )
    resetForm()
    await refresh()
  } catch (requestError) {
    formError.value = extractRequestError(
      requestError,
      translate(
        'profile.companies.notifications.saveFailed',
        'Unable to create this company.',
      ),
    )
  } finally {
    isSaving.value = false
  }
}

function scrollToCompanyForm() {
  if (!import.meta.client) {
    return
  }

  const element = document.getElementById('profile-companies-form')
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <ProfilePageShell>
    <v-row class="g-6">
      <v-col cols="12">
        <AppCard class="profile-companies__hero" variant="flat" elevation="0">
          <div class="profile-companies__hero-grid">
            <div>
              <p class="text-overline text-medium-emphasis mb-1">
                {{ translate('profile.companies.heading', 'Brand space') }}
              </p>
              <h1 class="text-h4 font-weight-bold mb-2">
                {{ translate('profile.companies.title', 'My companies') }}
              </h1>
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{
                  translate(
                    'profile.companies.description',
                    'Centralize hiring companies, logos, and contact details to reuse across job posts.',
                  )
                }}
              </p>
              <AppButton color="primary" variant="tonal" @click="refresh">
                {{
                  translate(
                    'profile.companies.actions.refresh',
                    'Refresh companies',
                  )
                }}
              </AppButton>
            </div>
            <div class="profile-companies__stats">
              <div class="profile-companies__stat">
                <p class="text-overline text-medium-emphasis mb-1">
                  {{ translate('profile.companies.stats.total', 'Total') }}
                </p>
                <p class="profile-companies__stat-value">
                  {{ companyStats.total }}
                </p>
              </div>
              <div class="profile-companies__stat">
                <p class="text-overline text-medium-emphasis mb-1">
                  {{
                    translate(
                      'profile.companies.stats.contacts',
                      'Contacts ready',
                    )
                  }}
                </p>
                <p class="profile-companies__stat-value">
                  {{ companyStats.withContact }}
                </p>
              </div>
              <div class="profile-companies__stat">
                <p class="text-overline text-medium-emphasis mb-1">
                  {{
                    translate('profile.companies.stats.website', 'Sites linked')
                  }}
                </p>
                <p class="profile-companies__stat-value">
                  {{ companyStats.withWebsite }}
                </p>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="5">
        <AppCard class="profile-companies__form-card">
          <template #title>
            <div class="profile-companies__form-header">
              <div>
                <p class="text-overline text-medium-emphasis mb-1">
                  {{
                    translate('profile.companies.form.heading', 'New profile')
                  }}
                </p>
                <h2 class="text-h5 mb-0">
                  {{
                    translate(
                      'profile.companies.form.title',
                      'Create a company',
                    )
                  }}
                </h2>
              </div>
              <v-chip color="primary" variant="tonal" size="small">
                {{ translate('profile.companies.stats.total', 'Total') }}:
                {{ companyStats.total }}
              </v-chip>
            </div>
          </template>
          <v-form id="profile-companies-form" @submit.prevent="submitCompany">
            <v-text-field
              v-model="createForm.name"
              :label="translate('profile.companies.form.name', 'Company name')"
              hide-details="auto"
              class="mb-4"
              required
            />
            <v-textarea
              v-model="createForm.description"
              :label="
                translate('profile.companies.form.description', 'Description')
              "
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
              :label="
                translate('profile.companies.form.email', 'Contact email')
              "
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
              :label="
                translate('profile.companies.form.file', 'Logo (optional)')
              "
              hide-details="auto"
              class="mb-4"
            />

            <p v-if="formError" class="text-error text-body-2 mb-4">
              {{ formError }}
            </p>

            <div class="d-flex justify-end">
              <AppButton color="primary" type="submit" :loading="isSaving">
                {{
                  translate('profile.companies.actions.create', 'Save company')
                }}
              </AppButton>
            </div>
          </v-form>
        </AppCard>
      </v-col>

      <v-col cols="12" lg="7">
        <AppCard
          class="profile-companies__list-card"
          :title="translate('profile.companies.list.title', 'My companies')"
          :loading="isLoading"
        >
          <p v-if="loadErrorMessage" class="text-error mb-0">
            {{ loadErrorMessage }}
          </p>

          <div v-else-if="!hasCompanies" class="profile-companies__empty">
            <v-icon icon="mdi-domain-plus" size="42" class="mb-3" />
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{
                translate(
                  'profile.companies.list.empty',
                  'You have not created any companies yet.',
                )
              }}
            </p>
            <AppButton
              color="primary"
              variant="tonal"
              @click="scrollToCompanyForm"
            >
              {{
                translate('profile.companies.form.title', 'Create a company')
              }}
            </AppButton>
          </div>

          <div v-else class="profile-companies__list">
            <AppCard
              v-for="company in companies"
              :key="company.id"
              class="profile-companies__item"
              hover
            >
              <div class="profile-companies__item-header">
                <div>
                  <p class="profile-companies__item-name mb-1">
                    {{
                      company.name ||
                      translate(
                        'profile.companies.labels.untitled',
                        'Untitled company',
                      )
                    }}
                  </p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{
                      formatDate(company.updatedAt) ||
                      formatDate(company.createdAt) ||
                      translate(
                        'profile.companies.labels.noDates',
                        'No timeline available',
                      )
                    }}
                  </p>
                </div>
                <v-chip
                  v-if="company.location"
                  color="primary"
                  size="small"
                  variant="tonal"
                >
                  <v-icon icon="mdi-map-marker" size="16" class="me-1" />
                  {{ company.location }}
                </v-chip>
              </div>
              <p v-if="company.description" class="text-body-2 mb-3">
                {{ company.description }}
              </p>
              <div class="profile-companies__item-body">
                <div
                  v-if="company.contactEmail"
                  class="profile-companies__item-row"
                >
                  <v-icon icon="mdi-email" size="18" class="me-2" />
                  {{ company.contactEmail }}
                </div>
                <div v-if="company.siteUrl" class="profile-companies__item-row">
                  <v-icon icon="mdi-link" size="18" class="me-2" />
                  <a
                    :href="company.siteUrl"
                    target="_blank"
                    rel="noopener"
                    class="text-primary"
                  >
                    {{ company.siteUrl }}
                  </a>
                </div>
              </div>
              <div class="profile-companies__item-actions">
                <AppButton
                  v-if="company.contactEmail"
                  size="small"
                  variant="text"
                  color="primary"
                  :href="`mailto:${company.contactEmail}`"
                >
                  {{ translate('profile.companies.actions.email', 'Email') }}
                </AppButton>
                <AppButton
                  v-if="company.siteUrl"
                  size="small"
                  variant="text"
                  color="secondary"
                  :href="company.siteUrl"
                  target="_blank"
                  rel="noopener"
                >
                  {{
                    translate('profile.companies.actions.visit', 'Visit site')
                  }}
                </AppButton>
              </div>
            </AppCard>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>

<style scoped>
.profile-companies__hero {
  padding: clamp(1.25rem, 3vw, 2.5rem);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-surface), 0.95)
  );
}

.profile-companies__hero-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 960px) {
  .profile-companies__hero-grid {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.profile-companies__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.profile-companies__stat {
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background-color: rgba(var(--v-theme-surface), 0.7);
}

.profile-companies__stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.profile-companies__form-card {
  padding: clamp(1.25rem, 2vw, 1.75rem);
}

.profile-companies__form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-companies__list-card {
  padding: clamp(1.25rem, 2vw, 1.75rem);
}

.profile-companies__empty {
  text-align: center;
  padding: 2rem 1rem;
}

.profile-companies__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-companies__item {
  padding: 1.25rem;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.profile-companies__item-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-companies__item-name {
  font-weight: 600;
}

.profile-companies__item-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.profile-companies__item-row {
  display: flex;
  align-items: center;
}

.profile-companies__item-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
