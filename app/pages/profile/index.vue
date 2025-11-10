<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import type { AuthProfile } from '~/types/auth'
import type { Configuration } from '~/types/configuration'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.profile',
  middleware: 'auth',
})

const { t } = useI18n()
const { session, user, fetch: refreshSession } = useUserSession()
const profileCache = useAuthProfileCache()

const profile = computed<AuthProfile | null>(() => {
  const sessionProfile = session.value?.profile
  if (sessionProfile && typeof sessionProfile === 'object') {
    return sessionProfile as AuthProfile
  }

  return profileCache.value
})

const displayName = computed(() => {
  if (!profile.value) return ''
  const firstName =
    typeof profile.value.firstName === 'string'
      ? profile.value.firstName.trim()
      : ''
  const lastName =
    typeof profile.value.lastName === 'string'
      ? profile.value.lastName.trim()
      : ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  return fullName || profile.value.username
})

const avatarUrl = computed(() => {
  const photo = profile.value?.photo
  if (typeof photo === 'string' && photo.trim().length > 0) {
    return photo
  }

  return user.value?.avatar_url ?? null
})

const initials = computed(() => {
  if (!profile.value) return ''

  const initialsFromNames = [profile.value.firstName, profile.value.lastName]
    .filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0,
    )
    .map((value) => value.trim()[0]?.toUpperCase())
    .filter(Boolean)
    .join('')

  if (initialsFromNames) {
    return initialsFromNames
  }

  return profile.value.username.slice(0, 2).toUpperCase()
})

const roles = computed(() => {
  const rawRoles = profile.value?.roles
  if (!Array.isArray(rawRoles)) {
    return [] as string[]
  }

  return rawRoles
    .filter(
      (role): role is string =>
        typeof role === 'string' && role.trim().length > 0,
    )
    .map((role) => role.trim())
})

type ProfileForm = {
  firstName: string
  lastName: string
  title: string
  description: string
  gender: string
  phone: string
  address: string
  birthday: string
}

type ProfileSettingsState = {
  allowSendEmail: boolean
  allowNotification: boolean
}

type ProfileSettingKey = keyof ProfileSettingsState

type ProfileSettingsPayload = {
  configurationKey: string
  contextKey: string
  contextId: string
  workplaceId: string
  configurationValue: Record<string, unknown>
}

const PROFILE_SETTINGS_CONFIGURATION_KEY = 'profile.settings'
const PROFILE_SETTINGS_CONTEXT_KEY = 'profile'

const DEFAULT_PROFILE_SETTINGS: ProfileSettingsState = {
  allowSendEmail: false,
  allowNotification: false,
}

const editDialog = ref(false)
const isSaving = ref(false)
const formError = ref('')
const photoFiles = ref<File[] | File | null>(null)
const selectedFile = ref<File | null>(null)
const settings = reactive<ProfileSettingsState>({ ...DEFAULT_PROFILE_SETTINGS })
const settingsLoading = ref(true)
const settingsError = ref('')
const settingsSaving = reactive<Record<ProfileSettingKey, boolean>>({
  allowSendEmail: false,
  allowNotification: false,
})
const currentSettingsConfiguration = ref<Configuration | null>(null)


const form = reactive<ProfileForm>({
  firstName: '',
  lastName: '',
  title: '',
  description: '',
  gender: '',
  phone: '',
  address: '',
  birthday: '',
})

function getProfileStringValue(current: AuthProfile | null, key: string) {
  if (!current) return ''
  const value = current[key as keyof AuthProfile]
  return typeof value === 'string' ? value : ''
}

function formatDateForInput(value: unknown) {
  if (!value) return ''
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed
    }
    const date = new Date(trimmed)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10)
    }
  }

  return ''
}

function formatDateForDisplay(value: unknown) {
  if (!value) return ''
  const dateValue =
    value instanceof Date ? value : new Date(String(value).trim())
  if (!Number.isNaN(dateValue.getTime())) {
    return dateValue.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
  return typeof value === 'string' ? value : ''
}

function resetFormFromProfile(current: AuthProfile | null) {
  form.firstName = getProfileStringValue(current, 'firstName')
  form.lastName = getProfileStringValue(current, 'lastName')
  form.title = getProfileStringValue(current, 'title')
  form.description = getProfileStringValue(current, 'description')
  form.gender = getProfileStringValue(current, 'gender')
  form.phone = getProfileStringValue(current, 'phone')
  form.address = getProfileStringValue(current, 'address')
  form.birthday = formatDateForInput(getProfileStringValue(current, 'birthday'))
}

function resetProfileSettings() {
  for (const key of Object.keys(
    DEFAULT_PROFILE_SETTINGS,
  ) as ProfileSettingKey[]) {
    settings[key] = DEFAULT_PROFILE_SETTINGS[key]
    settingsSaving[key] = false
  }
}

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

function parseBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
      return true
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
      return false
    }
  }

  return null
}

function toSettingsRecord(value: unknown): Partial<ProfileSettingsState> {
  if (!value) {
    return {}
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      return toSettingsRecord(parsed)
    } catch (error) {
      console.warn(
        'Failed to parse profile settings configuration value',
        error,
      )
      return {}
    }
  }

  if (Array.isArray(value) || typeof value !== 'object') {
    return {}
  }

  const record = value as Record<string, unknown>
  const output: Partial<ProfileSettingsState> = {}

  for (const key of Object.keys(
    DEFAULT_PROFILE_SETTINGS,
  ) as ProfileSettingKey[]) {
    const candidate = parseBoolean(record[key])
    if (candidate != null) {
      output[key] = candidate
    }
  }

  return output
}

function applySettingsValue(value: unknown) {
  const record = toSettingsRecord(value)

  for (const key of Object.keys(
    DEFAULT_PROFILE_SETTINGS,
  ) as ProfileSettingKey[]) {
    settings[key] = record[key] ?? DEFAULT_PROFILE_SETTINGS[key]
  }
}

function applyConfiguration(configuration: Configuration | null) {
  currentSettingsConfiguration.value = configuration

  if (configuration) {
    applySettingsValue(configuration.configurationValue)
    return
  }

  resetProfileSettings()
}

const resolvedSettingsContextId = computed(() => {
  const configurationContextId = currentSettingsConfiguration.value?.contextId
  if (
    typeof configurationContextId === 'string' &&
    configurationContextId.trim().length > 0
  ) {
    return configurationContextId
  }

  const profileId = profile.value?.id
  if (typeof profileId === 'string' && profileId.trim().length > 0) {
    return profileId
  }

  const rawProfile = profile.value as Record<string, unknown> | null
  const alternative =
    rawProfile?.contextId ??
    rawProfile?.context_id ??
    rawProfile?.userId ??
    rawProfile?.user_id
  if (typeof alternative === 'string' && alternative.trim().length > 0) {
    return alternative
  }

  return ''
})

const resolvedSettingsWorkplaceId = computed(() => {
  const configurationWorkplaceId =
    currentSettingsConfiguration.value?.workplaceId
  if (
    typeof configurationWorkplaceId === 'string' &&
    configurationWorkplaceId.trim().length > 0
  ) {
    return configurationWorkplaceId
  }

  const rawProfile = profile.value as Record<string, unknown> | null
  const direct = rawProfile?.workplaceId ?? rawProfile?.workplace_id
  if (typeof direct === 'string' && direct.trim().length > 0) {
    return direct
  }

  const nestedWorkplace = rawProfile?.workplace
  if (nestedWorkplace && typeof nestedWorkplace === 'object') {
    const nestedId = (nestedWorkplace as Record<string, unknown>).id
    if (typeof nestedId === 'string' && nestedId.trim().length > 0) {
      return nestedId
    }
  }

  return ''
})

const resolvedSettingsConfigurationKey = computed(() => {
  const configurationKey = currentSettingsConfiguration.value?.configurationKey
  if (
    typeof configurationKey === 'string' &&
    configurationKey.trim().length > 0
  ) {
    return configurationKey
  }

  return PROFILE_SETTINGS_CONFIGURATION_KEY
})

const resolvedSettingsContextKey = computed(() => {
  const contextKey = currentSettingsConfiguration.value?.contextKey
  if (typeof contextKey === 'string' && contextKey.trim().length > 0) {
    return contextKey
  }

  return PROFILE_SETTINGS_CONTEXT_KEY
})

const canUpdateSettings = computed(() =>
  Boolean(
    currentSettingsConfiguration.value &&
      resolvedSettingsContextId.value &&
      resolvedSettingsWorkplaceId.value &&
      resolvedSettingsConfigurationKey.value &&
      resolvedSettingsContextKey.value,
  ),
)

const profileSettingsDefinitions = computed(() => [
  {
    id: 'allowSendEmail' as const,
    title: t('profile.settings.allowSendEmail.title'),
    subtitle: t('profile.settings.allowSendEmail.description'),
    icon: 'mdi-email-outline',
  },
  {
    id: 'allowNotification' as const,
    title: t('profile.settings.allowNotification.title'),
    subtitle: t('profile.settings.allowNotification.description'),
    icon: 'mdi-bell-outline',
  },
])

async function loadProfileSettings(force = false) {
  if (settingsLoading.value && !force) {
    return
  }

  settingsLoading.value = true
  settingsError.value = ''

  try {
    const configurations = await $fetch<Configuration[]>(
      '/api/profile/settings',
    )

    let configuration: Configuration | null = null
    for (const item of configurations) {
      const record = toSettingsRecord(item.configurationValue)
      if (Object.keys(record).length > 0) {
        configuration = item
        break
      }
    }

    if (!configuration) {
      const payload = buildSettingsPayload()
      if (!payload) {
        settingsError.value = t('profile.settings.errors.metadataMissing')
        applyConfiguration(null)
        return
      }

      configuration = await $fetch<Configuration>('/api/profile/settings', {
        method: 'POST',
        body: {
          ...payload,
          configurationValue: { ...DEFAULT_PROFILE_SETTINGS },
        },
      })
    }

    applyConfiguration(configuration)
  } catch (error) {
    settingsError.value = extractRequestError(
      error,
      t('profile.settings.errors.loadFailed'),
    )
    applyConfiguration(null)
    Notify.error(settingsError.value)
  } finally {
    settingsLoading.value = false
  }
}

function buildSettingsPayload(): ProfileSettingsPayload | null {
  const configurationKey = resolvedSettingsConfigurationKey.value
  const contextKey = resolvedSettingsContextKey.value
  const contextId = resolvedSettingsContextId.value
  const workplaceId = resolvedSettingsWorkplaceId.value

  if (!configurationKey || !contextKey || !contextId || !workplaceId) {
    return null
  }

  return {
    configurationKey,
    contextKey,
    contextId,
    workplaceId,
    configurationValue: { ...settings },
  }
}

async function handleSettingToggle(key: ProfileSettingKey, value: boolean) {
  if (settingsSaving[key] || !canUpdateSettings.value) {
    return
  }

  const previous = settings[key]
  settings[key] = value
  settingsSaving[key] = true
  settingsError.value = ''

  const payload = buildSettingsPayload()
  if (!payload) {
    settings[key] = previous
    settingsSaving[key] = false
    settingsError.value = t('profile.settings.errors.metadataMissing')
    Notify.error(settingsError.value)
    return
  }

  try {
    const configuration = await $fetch<Configuration>('/api/profile/settings', {
      method: 'POST',
      body: payload,
    })

    applyConfiguration(configuration)
    Notify.success(t('profile.settings.notifications.updateSuccess'))
  } catch (error) {
    settings[key] = previous
    settingsError.value = extractRequestError(
      error,
      t('profile.settings.errors.saveFailed'),
    )
    Notify.error(settingsError.value)
  } finally {
    settingsSaving[key] = false
  }
}

watch(
  profile,
  (value) => {
    resetFormFromProfile(value)
  },
  { immediate: true },
)

onMounted(async () => {
  await loadProfileSettings(true)
})

watch(photoFiles, (files) => {
  if (Array.isArray(files)) {
    selectedFile.value = files[0] ?? null
  } else if (typeof File !== 'undefined' && files instanceof File) {
    selectedFile.value = files
  } else {
    selectedFile.value = null
  }
})

watch(editDialog, (value) => {
  if (!value) {
    formError.value = ''
    photoFiles.value = null
    selectedFile.value = null
    resetFormFromProfile(profile.value)
  }
})

const hasChanges = computed(() => {
  if (!profile.value) return false
  const current = profile.value

  const fields: (keyof ProfileForm)[] = [
    'firstName',
    'lastName',
    'title',
    'description',
    'gender',
    'phone',
    'address',
  ]

  for (const field of fields) {
    const profileValue = getProfileStringValue(current, field)
    if (form[field] !== profileValue) {
      return true
    }
  }

  const originalBirthday = formatDateForInput(
    getProfileStringValue(current, 'birthday'),
  )
  if ((form.birthday || '') !== originalBirthday) {
    return true
  }

  if (selectedFile.value) {
    return true
  }

  return false
})

const formattedBirthday = computed(() =>
  formatDateForDisplay(getProfileStringValue(profile.value, 'birthday')),
)


async function submit() {
  if (!profile.value || !hasChanges.value || isSaving.value) {
    return
  }

  isSaving.value = true
  formError.value = ''

  try {
    const formData = new FormData()
    const fields: (keyof ProfileForm)[] = [
      'firstName',
      'lastName',
      'title',
      'description',
      'gender',
      'phone',
      'address',
    ]

    for (const field of fields) {
      formData.append(field, form[field])
    }

    if (form.birthday && form.birthday.trim().length > 0) {
      formData.append('birthday', form.birthday)
    }

    if (selectedFile.value) {
      formData.append('files[]', selectedFile.value)
    }

    const updatedProfile = await $fetch<AuthProfile>('/api/profile/update', {
      method: 'POST',
      body: formData,
    })

    profileCache.value = updatedProfile
    await refreshSession()
    Notify.success(t('profile.updateSuccess'))
    editDialog.value = false
  } catch (error) {
    let message = t('profile.updateFailed')

    if (error instanceof FetchError) {
      const data = error.data as Record<string, unknown> | undefined
      if (data?.message && typeof data.message === 'string') {
        message = data.message
      } else if (typeof error.message === 'string' && error.message) {
        message = error.message
      }
    } else if (error instanceof Error && error.message) {
      message = error.message
    }

    formError.value = message
    Notify.error(message)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <ProfilePageShell>
    <v-dialog v-model="editDialog" max-width="640">
      <v-card>
        <v-card-title class="text-wrap">
          {{ t('profile.page.edit.title') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('profile.page.edit.description') }}
          </p>
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            class="mb-4"
            density="compact"
          >
            {{ formError }}
          </v-alert>
          <v-form @submit.prevent="submit">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.firstName"
                  :label="t('userManagement.users.fields.firstName')"
                  autocomplete="given-name"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.lastName"
                  :label="t('userManagement.users.fields.lastName')"
                  autocomplete="family-name"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.title"
                  :label="t('profile.fields.title')"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.gender"
                  :label="t('profile.fields.gender')"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.phone"
                  :label="t('profile.fields.phone')"
                  type="tel"
                  autocomplete="tel"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.address"
                  :label="t('profile.fields.address')"
                  autocomplete="street-address"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.birthday"
                  :label="t('profile.fields.birthday')"
                  type="date"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  :label="t('profile.fields.description')"
                  auto-grow
                  rows="3"
                  :disabled="isSaving"
                />
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="photoFiles"
                  :label="t('profile.fields.photo')"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  clearable
                  show-size
                  :disabled="isSaving"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="isSaving"
            @click="editDialog = false"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!hasChanges || isSaving"
            :loading="isSaving"
            @click="submit"
          >
            {{ t('common.actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12">
        <v-alert v-if="!profile" type="info" variant="tonal" class="ma-auto">
          {{ t('profile.page.alerts.emptyProfile') }}
        </v-alert>

        <v-row v-else align="stretch">
          <v-col cols="12" md="4">
            <v-card class="pa-6" elevation="2" rounded="xl">
              <v-row no-gutters class="align-center mb-4">
                <v-col cols="auto">
                  <v-avatar size="72" color="primary" class="elevation-2">
                    <v-img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      :alt="t('profile.page.avatar.alt')"
                    />
                    <span
                      v-else
                      class="text-h4 font-weight-medium text-white"
                      >{{ initials }}</span
                    >
                  </v-avatar>
                </v-col>
                <v-col class="px-4">
                  <div class="text-h6 font-weight-medium">
                    {{ displayName }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    @{{ profile.username }}
                  </div>
                  <div
                    v-if="profile.title"
                    class="text-body-2 text-medium-emphasis mt-1"
                  >
                    {{ profile.title }}
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex flex-column" style="row-gap: 12px">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('profile.fields.userId') }}
                  </div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ profile.id }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.fields.email') }}
                  </div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ profile.email }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12">
                <v-card elevation="2" rounded="xl">
                  <v-card-title class="d-flex align-center gap-4">
                    <span>{{ t('profile.sections.personalInfo.title') }}</span>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="text"
                      prepend-icon="mdi-pencil"
                      :disabled="isSaving"
                      @click="editDialog = true"
                    >
                      {{ t('common.actions.edit') }}
                    </v-btn>
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('userManagement.users.fields.firstName') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.firstName || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('userManagement.users.fields.lastName') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.lastName || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('userManagement.users.fields.username') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.username }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('userManagement.users.fields.email') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.email }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card elevation="2" rounded="xl">
                  <v-card-title>
                    {{ t('profile.sections.details.title') }}
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('profile.fields.title') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.title || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('profile.fields.gender') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.gender || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('profile.fields.phone') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.phone || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('profile.fields.address') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ profile.address || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('profile.fields.birthday') }}
                        </div>
                        <div class="text-subtitle-2 font-weight-medium">
                          {{ formattedBirthday || '—' }}
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <div class="text-caption text-medium-emphasis">
                          {{ t('profile.fields.description') }}
                        </div>
                        <div class="text-body-2">
                          {{ profile.description || '—' }}
                        </div>
                      </v-col>
                    </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card elevation="2" rounded="xl">
              <v-card-title>
                {{ t('profile.sections.roles.title') }}
              </v-card-title>
              <v-divider />
              <v-card-text>
                <div
                  v-if="roles.length"
                  class="d-flex flex-wrap"
                  style="gap: 8px"
                >
                  <v-chip
                    v-for="role in roles"
                    :key="role"
                    color="primary"
                    variant="tonal"
                    class="text-capitalize"
                  >
                    {{ role }}
                  </v-chip>
                </div>
                <p v-else class="text-body-2 text-medium-emphasis mb-0">
                  {{ t('profile.sections.roles.empty') }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card elevation="2" rounded="xl">
              <v-card-title class="d-flex align-center gap-3">
                <span>{{ t('profile.sections.settings.title') }}</span>
                <v-spacer />
                    <v-tooltip location="bottom">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          variant="text"
                          density="comfortable"
                          icon="mdi-refresh"
                          :disabled="settingsLoading"
                          :loading="settingsLoading"
                          @click="loadProfileSettings()"
                        />
                      </template>
                      <span>{{ t('profile.settings.actions.refresh') }}</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-alert
                      v-if="settingsError"
                      type="error"
                      variant="tonal"
                      density="compact"
                      class="mb-4"
                    >
                      {{ settingsError }}
                    </v-alert>

                    <v-alert
                      v-else-if="!settingsLoading && !canUpdateSettings"
                      type="warning"
                      variant="tonal"
                      density="compact"
                      class="mb-4"
                    >
                      {{ t('profile.settings.errors.metadataMissing') }}
                    </v-alert>

                    <div v-if="settingsLoading">
                      <v-skeleton-loader
                        v-for="definition in profileSettingsDefinitions"
                        :key="definition.id"
                        type="list-item-two-line"
                        class="mb-3"
                      />
                    </div>
                    <v-list v-else density="comfortable" lines="two">
                      <v-list-item
                        v-for="definition in profileSettingsDefinitions"
                        :key="definition.id"
                        :title="definition.title"
                        :subtitle="definition.subtitle"
                      >
                        <template #prepend>
                          <v-icon
                            :icon="definition.icon"
                            class="mr-4"
                            color="primary"
                          />
                        </template>
                        <template #append>
                          <v-switch
                            :model-value="settings[definition.id]"
                            color="primary"
                            hide-details
                            inset
                            :disabled="
                              !canUpdateSettings ||
                              settingsSaving[definition.id]
                            "
                            :loading="settingsSaving[definition.id]"
                            @update:model-value="
                              handleSettingToggle(definition.id, $event)
                            "
                          />
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>

