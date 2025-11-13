<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type {
  Configuration,
  ConfigurationPayload,
  ConfigurationValue,
} from '~/types/configuration'
import type { Workplace } from '~/types/workplace'
import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import { normalizeRequestHeaders } from '~/utils/headers'
import { normalizeCollection } from '~/utils/collections'
import AppButton from '~/components/ui/AppButton.vue'

definePageMeta({
  title: 'configurationManagement.configurations.title',
  subtitle: 'configurationManagement.configurations.subtitle',
  icon: 'mdi-cog-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()
const adminStore = useAdminStore()

const headers = import.meta.server
  ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
  : undefined

const extractCount = (d: any): number => {
  if (typeof d === 'number') return d
  if (!d || typeof d !== 'object') return 0
  if (typeof d.count === 'number') return d.count
  if (typeof d.total === 'number') return d.total
  if (typeof d['hydra:totalItems'] === 'number') return d['hydra:totalItems']
  if (d.data) return extractCount(d.data)
  return 0
}

const [
  { data: configurations, pending, error, refresh },
  {
    data: configurationCount,
    pending: countPending,
    error: countError,
    refresh: refreshCount,
  },
] = await Promise.all([
  useFetch<Configuration[]>('/api/v1/configuration', {
    key: 'configuration-list',
    headers,
    credentials: 'include',
    transform: (data) => normalizeCollection<Configuration>(data),
  }),
  useFetch<number>('/api/v1/configuration/count', {
    key: 'configuration-count',
    headers,
    credentials: 'include',
    transform: extractCount,
  }),
])

try {
  await adminStore.fetchWorkplaces()
} catch (workplaceError) {
  console.error(
    'Failed to load workplaces for configuration form',
    workplaceError,
  )
}

const search = ref('')

const dataTableHeaders = computed<DataTableHeader[]>(() => [
  {
    title: t('configurationManagement.configurations.table.key'),
    key: 'configurationKey',
  },
  {
    title: t('configurationManagement.configurations.table.contextKey'),
    key: 'contextKey',
  },
  {
    title: t('configurationManagement.configurations.table.contextId'),
    key: 'contextId',
  },
  {
    title: t('configurationManagement.configurations.table.value'),
    key: 'valuePreview',
    sortable: false,
  },
  {
    title: t('configurationManagement.configurations.table.flags'),
    key: 'flagsDisplay',
    sortable: false,
  },
  {
    title: t('configurationManagement.configurations.table.updatedAt'),
    key: 'updatedAtDisplay',
  },
])

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  try {
    return date.toLocaleString(locale.value)
  } catch (error) {
    console.error('Failed to format date', error)
    return date.toISOString()
  }
}

const stringifyValue = (value: unknown): string => {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value) || typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      console.error('Failed to stringify configuration value', error)
      return String(value)
    }
  }

  return String(value)
}

const formatFlags = (flags: string[] | undefined | null) => {
  if (!flags || flags.length === 0) {
    return t('configurationManagement.configurations.table.noFlags')
  }
  return flags.join(', ')
}

const items = computed(() => {
  const entries = configurations.value ?? []

  return entries.map((configuration) => {
    const rawValue =
      configuration &&
      typeof configuration.configurationValue === 'object' &&
      configuration.configurationValue !== null &&
      '_value' in configuration.configurationValue
        ? (configuration.configurationValue as { _value?: unknown })._value
        : configuration.configurationValue

    const valuePreview = stringifyValue(rawValue)

    return {
      ...configuration,
      contextId: configuration.contextId ?? '',
      valuePreview,
      flagsDisplay: formatFlags(configuration.flags ?? []),
      updatedAtDisplay: formatDate(configuration.updatedAt ?? null),
    }
  })
})

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) {
    return items.value
  }

  return items.value.filter((item) => {
    const fields = [
      item.configurationKey,
      item.contextKey,
      item.contextId,
      item.valuePreview,
      item.flagsDisplay,
    ]
      .filter(Boolean)
      .map((value) => value.toString().toLowerCase())

    return fields.some((field) => field.includes(term))
  })
})

const loading = computed(() => pending.value || countPending.value)

const tableError = computed(() => {
  if (error.value || countError.value) {
    return t('configurationManagement.configurations.alerts.loadFailed')
  }
  return null
})

const subtitle = computed(() =>
  t('configurationManagement.configurations.table.subtitle', {
    count: configurationCount.value ?? filteredItems.value.length,
  }),
)

const refreshAll = async () => {
  await Promise.all([refresh(), refreshCount()])
}

const createDialog = ref(false)
const createLoading = ref(false)
const createError = ref('')

type ConfigurationForm = {
  configurationKey: string
  contextKey: string
  contextId: string
  workplaceId: string | null
  configurationValue: string
  flags: string
}

const form = reactive<ConfigurationForm>({
  configurationKey: '',
  contextKey: '',
  contextId: '',
  workplaceId: '',
  configurationValue: '',
  flags: '',
})

const workplaces = computed<Workplace[]>(
  () => adminStore.workplaces?.value ?? [],
)

const workplaceOptions = computed(() =>
  workplaces.value.map((workplace) => ({
    title: workplace.name,
    value: workplace.id,
    subtitle: workplace.slug,
  })),
)

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

const workplaceError = computed(() => {
  const errorValue = adminStore.workplacesError?.value
  if (!errorValue) {
    return ''
  }
  return extractRequestError(
    errorValue,
    t('configurationManagement.configurations.errors.workplaceLoadFailed'),
  )
})

function resetForm() {
  form.configurationKey = ''
  form.contextKey = ''
  form.contextId = ''
  form.workplaceId = ''
  form.configurationValue = ''
  form.flags = ''
}

watch(createDialog, (value) => {
  if (!value) {
    createLoading.value = false
    createError.value = ''
    resetForm()
  }
})

function parseConfigurationValue(input: string): ConfigurationValue {
  const trimmed = input.trim()
  if (!trimmed) {
    return ''
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed)
    } catch (error) {
      console.warn('Failed to parse configuration value as JSON', error)
      return input
    }
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const numeric = Number(trimmed)
    if (!Number.isNaN(numeric)) {
      return numeric
    }
  }

  if (/^(true|false|null)$/i.test(trimmed)) {
    try {
      return JSON.parse(trimmed.toLowerCase())
    } catch (error) {
      console.warn('Failed to parse boolean/null configuration value', error)
      return trimmed
    }
  }

  return input
}

async function openCreate() {
  createError.value = ''
  createDialog.value = true

  try {
    await adminStore.fetchWorkplaces()
  } catch (error) {
    console.error('Failed to refresh workplaces list', error)
  }
}

async function submitCreate() {
  createError.value = ''

  const configurationKey = form.configurationKey.trim()
  if (!configurationKey) {
    createError.value = t(
      'configurationManagement.configurations.errors.keyRequired',
    )
    Notify.error(createError.value)
    return
  }

  const contextKey = form.contextKey.trim()
  if (!contextKey) {
    createError.value = t(
      'configurationManagement.configurations.errors.contextKeyRequired',
    )
    Notify.error(createError.value)
    return
  }

  if (!form.configurationValue.trim()) {
    createError.value = t(
      'configurationManagement.configurations.errors.valueRequired',
    )
    Notify.error(createError.value)
    return
  }

  const payload: ConfigurationPayload = {
    configurationKey,
    contextKey,
    configurationValue: parseConfigurationValue(form.configurationValue),
  }

  const contextId = form.contextId.trim()
  if (contextId) {
    payload.contextId = contextId
  }

  const workplaceId = (form.workplaceId ?? '').toString().trim()
  if (workplaceId) {
    payload.workplaceId = workplaceId
  }

  const flags = form.flags
    .split(',')
    .map((flag) => flag.trim())
    .filter((flag) => flag.length > 0)

  if (flags.length > 0) {
    payload.flags = flags
  }

  createLoading.value = true

  try {
    await $fetch('/api/v1/configuration', {
      method: 'POST',
      body: payload,
    })

    Notify.success(
      t('configurationManagement.configurations.notifications.createSuccess'),
    )

    createDialog.value = false
    await refreshAll()
  } catch (error) {
    createError.value = extractRequestError(
      error,
      t('configurationManagement.configurations.errors.createFailed'),
    )
    Notify.error(createError.value)
  } finally {
    createLoading.value = false
  }
}
</script>

<template>
  <v-container fluid>
    <AdminDataTable
      :title="t('configurationManagement.configurations.table.title')"
      :subtitle="subtitle"
      :headers="dataTableHeaders"
      :items="filteredItems"
      :loading="loading"
      :error="tableError"
      :search="search"
      :search-placeholder="
        t('configurationManagement.configurations.searchPlaceholder')
      "
      color="primary"
      @update:search="(value) => (search.value = value)"
      @refresh="refreshAll"
    >
      <template #header-actions>
        <AppButton
          color="primary"
          prepend-icon="mdi-plus"
          :disabled="loading"
          @click="openCreate"
        >
          {{ t('configurationManagement.configurations.actions.new') }}
        </AppButton>
      </template>
      <template #item.valuePreview="{ item }">
        <span class="text-body-2 text-mono">{{ item.valuePreview }}</span>
      </template>
    </AdminDataTable>

    <AppModal
      v-model="createDialog"
      icon="mdi-cog-plus-outline"
      :title="t('configurationManagement.configurations.dialogs.create.title')"
      max-width="640"
      :close-disabled="createLoading"
      @close="createDialog = false"
    >
      <v-card-text>
        <v-alert v-if="createError" type="error" variant="tonal" class="mb-4">
          {{ createError }}
        </v-alert>

        <v-form @submit.prevent="submitCreate">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.configurationKey"
                :label="
                  t('configurationManagement.configurations.fields.key')
                "
                :disabled="createLoading"
                required
                rounded
                autocomplete="off"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contextKey"
                :label="
                  t(
                    'configurationManagement.configurations.fields.contextKey',
                  )
                "
                :disabled="createLoading"
                required
                rounded
                autocomplete="off"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contextId"
                :label="
                  t('configurationManagement.configurations.fields.contextId')
                "
                :disabled="createLoading"
                rounded
                autocomplete="off"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.workplaceId"
                :items="workplaceOptions"
                item-title="title"
                item-value="value"
                :label="
                  t('configurationManagement.configurations.fields.workplace')
                "
                :placeholder="t('common.placeholders.selectWorkplace')"
                :loading="adminStore.workplacesPending"
                :disabled="createLoading"
                :error-messages="workplaceError ? [workplaceError] : []"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.configurationValue"
                :label="
                  t('configurationManagement.configurations.fields.value')
                "
                :hint="
                  t('configurationManagement.configurations.fields.valueHint')
                "
                persistent-hint
                :disabled="createLoading"
                auto-grow
                rows="3"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.flags"
                :label="
                  t('configurationManagement.configurations.fields.flags')
                "
                :hint="
                  t('configurationManagement.configurations.fields.flagsHint')
                "
                persistent-hint
                :disabled="createLoading"
                rounded
                autocomplete="off"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <template #actions>
        <AppButton
          variant="text"
          :disabled="createLoading"
          @click="createDialog = false"
        >
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :loading="createLoading"
          :disabled="createLoading"
          @click="submitCreate"
        >
          {{
            t('configurationManagement.configurations.dialogs.create.submit')
          }}
        </AppButton>
      </template>
    </AppModal>
  </v-container>
</template>

<style scoped src="~/assets/styles/pages/admin/setting-management/configuration-management.css"></style>
