<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'
import ProfileNavigation from '~/components/profile/ProfileNavigation.vue'
import type { AuthProfile } from '~/types/auth'
import type { Configuration } from '~/types/configuration'
import type { ProfilePlugin } from '~/types/plugin'
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

const plugins = ref<ProfilePlugin[]>([])
const pluginsLoading = ref(false)
const pluginsError = ref('')
const pluginToggleLoading = reactive<Record<string, boolean>>({})

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function toProfilePlugin(value: unknown): ProfilePlugin | null {
  if (!isRecord(value)) {
    return null
  }

  const key = typeof value.key === 'string' ? value.key.trim() : ''
  const name = typeof value.name === 'string' ? value.name.trim() : ''

  if (!key || !name) {
    return null
  }

  return {
    key,
    name,
    subTitle:
      typeof value.subTitle === 'string' && value.subTitle.trim().length > 0
        ? value.subTitle
        : null,
    description:
      typeof value.description === 'string' && value.description.trim().length > 0
        ? value.description
        : null,
    logo:
      typeof value.logo === 'string' && value.logo.trim().length > 0
        ? value.logo
        : null,
    icon:
      typeof value.icon === 'string' && value.icon.trim().length > 0
        ? value.icon
        : null,
    installed: Boolean(value.installed),
    link:
      typeof value.link === 'string' && value.link.trim().length > 0
        ? value.link
        : null,
    pricing:
      typeof value.pricing === 'string' && value.pricing.trim().length > 0
        ? value.pricing
        : null,
    action:
      typeof value.action === 'string' && value.action.trim().length > 0
        ? value.action
        : null,
    active: Boolean(value.active),
    id:
      typeof value.id === 'string' && value.id.trim().length > 0
        ? value.id
        : null,
  }
}

function applyPluginsData(value: unknown) {
  if (!Array.isArray(value)) {
    plugins.value = []
    return
  }

  const normalized: ProfilePlugin[] = []
  for (const item of value) {
    const plugin = toProfilePlugin(item)
    if (plugin) {
      normalized.push(plugin)
    }
  }

  plugins.value = normalized
}

function formatPluginPricing(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === 'free') {
    return t('profile.sections.plugins.pricing.free')
  }

  if (normalized === 'paid') {
    return t('profile.sections.plugins.pricing.paid')
  }

  return value
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

async function loadPlugins(force = false) {
  if (pluginsLoading.value && !force) {
    return
  }

  pluginsLoading.value = true
  pluginsError.value = ''

  try {
    const response = await $fetch<ProfilePlugin[]>('/api/profile/plugins')
    applyPluginsData(response)
  } catch (error) {
    pluginsError.value = extractRequestError(
      error,
      t('profile.sections.plugins.errors.loadFailed'),
    )
  } finally {
    pluginsLoading.value = false
  }
}

async function handlePluginToggle(plugin: ProfilePlugin) {
  const key = plugin.key
  if (!key || pluginToggleLoading[key]) {
    return
  }

  pluginToggleLoading[key] = true
  const previousActive = plugin.active

  try {
    const response = await $fetch<
      Partial<ProfilePlugin> & { success?: boolean; active?: boolean }
    >(`/api/profile/plugins/${encodeURIComponent(key)}/toggle`, {
      method: 'POST',
    })

    let updated = false
    if (response && typeof response === 'object') {
      if ('active' in response && typeof response.active === 'boolean') {
        plugin.active = response.active
        updated = true
      }

      if ('installed' in response && typeof response.installed === 'boolean') {
        plugin.installed = response.installed
      }
    }

    if (!updated) {
      plugin.active = !previousActive
    }

    pluginsError.value = ''
    Notify.success(
      t('profile.sections.plugins.notifications.toggleSuccess', {
        name: plugin.name,
      }),
    )
  } catch (error) {
    plugin.active = previousActive
    const message = extractRequestError(
      error,
      t('profile.sections.plugins.errors.toggleFailed'),
    )
    pluginsError.value = message
    Notify.error(message)
  } finally {
    pluginToggleLoading[key] = false
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
  await Promise.all([loadProfileSettings(true), loadPlugins(true)])
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

const hasPlugins = computed(() => plugins.value.length > 0)

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
      formData.append('file', selectedFile.value)
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
  <v-container fluid>
    <ProfileNavigation class="mb-6" />
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
              <v-card-title class="d-flex align-center gap-3 flex-wrap">
                <div class="d-flex flex-column">
                  <span>{{ t('profile.sections.plugins.title') }}</span>
                  <span class="text-body-2 text-medium-emphasis">
                    {{ t('profile.sections.plugins.description') }}
                  </span>
                </div>
                <v-spacer />
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      density="comfortable"
                      icon="mdi-refresh"
                      :disabled="pluginsLoading"
                      :loading="pluginsLoading"
                      @click="loadPlugins(true)"
                    />
                  </template>
                  <span>{{ t('profile.sections.plugins.actions.refresh') }}</span>
                </v-tooltip>
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-alert
                  v-if="pluginsError"
                  type="error"
                  variant="tonal"
                  density="compact"
                  class="mb-4"
                >
                  {{ pluginsError }}
                </v-alert>

                <div v-if="pluginsLoading">
                  <v-row>
                    <v-col v-for="index in 3" :key="index" cols="12" sm="6" lg="4">
                      <v-skeleton-loader
                        class="profile-plugin-card"
                        type="image, article"
                      />
                    </v-col>
                  </v-row>
                </div>

                <template v-else>
                  <div v-if="!hasPlugins" class="text-body-2 text-medium-emphasis">
                    {{ t('profile.sections.plugins.empty') }}
                  </div>
                  <v-row v-else class="g-4" style="row-gap: 24px; column-gap: 0">
                    <v-col
                      v-for="plugin in plugins"
                      :key="plugin.id || plugin.key"
                      cols="12"
                      sm="6"
                      lg="4"
                    >
                      <v-card
                        :elevation="plugin.active ? 8 : 2"
                        rounded="xl"
                        border
                        class="profile-plugin-card"
                        :class="{
                          'profile-plugin-card--active': plugin.active,
                        }"
                      >
                        <div class="profile-plugin-card__header">
                          <div class="d-flex align-center gap-4">
                            <v-avatar
                              size="56"
                              rounded="lg"
                              class="profile-plugin-card__logo"
                            >
                              <v-img
                                v-if="plugin.logo"
                                :src="plugin.logo"
                                :alt="plugin.name"
                                cover
                              />
                              <v-icon
                                v-else
                                :icon="plugin.icon || 'mdi-puzzle'"
                                size="28"
                                color="primary"
                              />
                            </v-avatar>
                            <div class="profile-plugin-card__title">
                              <div class="d-flex align-center gap-2 flex-wrap">
                                <span class="text-subtitle-1 font-weight-semibold">
                                  {{ plugin.name }}
                                </span>
                                <v-chip
                                  v-if="plugin.pricing"
                                  size="x-small"
                                  variant="flat"
                                  color="primary"
                                  class="text-uppercase"
                                >
                                  {{ formatPluginPricing(plugin.pricing) }}
                                </v-chip>
                              </div>
                              <span
                                v-if="plugin.subTitle"
                                class="text-caption text-medium-emphasis"
                              >
                                {{ plugin.subTitle }}
                              </span>
                            </div>
                          </div>
                          <v-chip
                            size="small"
                            :color="plugin.active ? 'success' : 'grey-darken-1'"
                            variant="tonal"
                            class="text-uppercase font-weight-medium"
                          >
                            {{
                              plugin.active
                                ? t('profile.sections.plugins.status.active')
                                : t('profile.sections.plugins.status.inactive')
                            }}
                          </v-chip>
                        </div>

                        <p
                          v-if="plugin.description"
                          class="profile-plugin-card__description mt-4 mb-6"
                        >
                          {{ plugin.description }}
                        </p>

                        <div class="profile-plugin-card__actions">
                          <v-btn
                            :color="plugin.active ? 'secondary' : 'primary'"
                            :variant="plugin.active ? 'tonal' : 'flat'"
                            :loading="pluginToggleLoading[plugin.key]"
                            :disabled="pluginToggleLoading[plugin.key]"
                            prepend-icon="mdi-power"
                            @click="handlePluginToggle(plugin)"
                          >
                            {{
                              plugin.active
                                ? t('profile.sections.plugins.actions.deactivate')
                                : t('profile.sections.plugins.actions.activate')
                            }}
                          </v-btn>
                          <v-btn
                            v-if="plugin.link && plugin.installed"
                            :to="plugin.link"
                            variant="text"
                            prepend-icon="mdi-open-in-new"
                          >
                            {{ t('profile.sections.plugins.actions.open') }}
                          </v-btn>
                          <v-btn
                            v-else-if="plugin.action === 'install' && plugin.link"
                            :to="plugin.link"
                            variant="outlined"
                            color="primary"
                            prepend-icon="mdi-download"
                          >
                            {{ t('profile.sections.plugins.actions.install') }}
                          </v-btn>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>
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
  </v-container>
</template>

<style scoped>
.profile-plugin-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-plugin-card:hover {
  transform: translateY(-4px);
}

.profile-plugin-card--active {
  border: 1px solid rgba(var(--v-theme-primary), 0.35);
  box-shadow: 0 16px 32px rgba(var(--v-theme-primary), 0.18);
}

.profile-plugin-card__logo {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
}

.profile-plugin-card__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-plugin-card__header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.profile-plugin-card__description {
  color: rgba(var(--v-theme-on-surface), 0.72);
  line-height: 1.5;
}

.profile-plugin-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 600px) {
  .profile-plugin-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-plugin-card__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
