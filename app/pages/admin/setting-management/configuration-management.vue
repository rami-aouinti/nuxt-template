<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { Configuration } from '~/types/configuration'

definePageMeta({
  title: 'configurationManagement.configurations.title',
  subtitle: 'configurationManagement.configurations.subtitle',
  icon: 'mdi-cog-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = import.meta.server ? useRequestHeaders(['cookie', 'authorization']) : undefined

const normalizeCollection = <T,>(input: unknown): T[] => {
  if (Array.isArray(input)) {
    return input as T[]
  }

  if (input && typeof input === 'object') {
    const record = input as Record<string, unknown>
    const possibleKeys = ['data', 'items', 'results', 'hydra:member', 'hydra:members']

    for (const key of possibleKeys) {
      const value = record[key]
      if (Array.isArray(value)) {
        return value as T[]
      }
    }
  }

  return []
}

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
  { data: configurationCount, pending: countPending, error: countError, refresh: refreshCount },
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

const search = ref('')

const dataTableHeaders = computed<DataTableHeader[]>(() => [
  { title: t('configurationManagement.configurations.table.key'), key: 'configurationKey' },
  { title: t('configurationManagement.configurations.table.contextKey'), key: 'contextKey' },
  { title: t('configurationManagement.configurations.table.contextId'), key: 'contextId' },
  { title: t('configurationManagement.configurations.table.value'), key: 'valuePreview', sortable: false },
  { title: t('configurationManagement.configurations.table.flags'), key: 'flagsDisplay', sortable: false },
  { title: t('configurationManagement.configurations.table.updatedAt'), key: 'updatedAtDisplay' },
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
      :search-placeholder="t('configurationManagement.configurations.searchPlaceholder')"
      color="primary"
      @update:search="(value) => (search.value = value)"
      @refresh="refreshAll"
    >
      <template #item.valuePreview="{ item }">
        <span class="text-body-2 text-mono">{{ item.valuePreview }}</span>
      </template>
    </AdminDataTable>
  </v-container>
</template>

<style scoped>
.text-mono {
  font-family: 'Fira Code', 'Source Code Pro', monospace;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
