<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { useAdminStore } from '~/stores/admin'
import type { Media } from '~/types/media'

definePageMeta({
  title: 'navigation.media',
  icon: 'mdi-image-multiple-outline',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()
const adminStore = useAdminStore()
const { media: mediaRef, mediaPending, mediaError, mediaCount } =
  storeToRefs(adminStore)

await Promise.all([adminStore.fetchMedia(), adminStore.fetchMediaCount()])

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('admin.mediaManagement.table.title'), key: 'title', minWidth: 220 },
  {
    title: t('admin.mediaManagement.table.fileName'),
    key: 'fileName',
    minWidth: 220,
  },
  {
    title: t('admin.mediaManagement.table.context'),
    key: 'context',
    minWidth: 180,
  },
  {
    title: t('admin.mediaManagement.table.mimeType'),
    key: 'mimeType',
    minWidth: 160,
  },
  {
    title: t('admin.mediaManagement.table.fileSize'),
    key: 'fileSize',
    minWidth: 140,
  },
  {
    title: t('admin.mediaManagement.table.visibility'),
    key: 'private',
    minWidth: 120,
  },
  {
    title: t('admin.mediaManagement.table.favorite'),
    key: 'favorite',
    minWidth: 120,
  },
  {
    title: t('admin.mediaManagement.table.createdAt'),
    key: 'createdAt',
    minWidth: 180,
  },
  {
    title: t('admin.mediaManagement.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 180,
  },
])

interface MediaTableRow {
  id: string
  title: string
  fileName: string
  context: string | null
  mimeType: string | null
  fileSize: number | null
  private: boolean
  favorite: boolean
  createdAt: string | null
  updatedAt: string | null
}

function pickString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string') {
      const normalized = value.trim()
      if (normalized.length > 0) {
        return normalized
      }
    }
  }

  return null
}

function pickBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes'].includes(normalized)) {
      return true
    }
    if (['false', '0', 'no'].includes(normalized)) {
      return false
    }
  }

  if (typeof value === 'number') {
    if (!Number.isNaN(value)) {
      return value !== 0
    }
  }

  return fallback
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const items = computed<MediaTableRow[]>(() => {
  const entries = mediaRef.value ?? []

  return entries.map((entry, index) => {
    const media = entry as Media & Record<string, unknown>
    const identifier =
      typeof media.id === 'string' && media.id.trim().length > 0
        ? media.id
        : `media-${index.toString(16)}`

    const fallbackName = pickString(media.name, media.path)
    const title =
      pickString(media.title, media.fileName, fallbackName) ??
      t('admin.mediaManagement.labels.untitled')

    const fileName =
      pickString(media.fileName, media.title) ??
      t('admin.mediaManagement.labels.notAvailable')

    const contextKey = pickString(media.contextKey)
    const contextId = pickString(media.contextId)
    const context = contextKey
      ? contextId
        ? `${contextKey}#${contextId}`
        : contextKey
      : null

    const mimeType = pickString(media.mimeType)
    const fileSize = normalizeNumber(media.fileSize)
    const createdAt = pickString(media.createdAt, media.created_at) ?? null
    const updatedAt = pickString(media.updatedAt, media.updated_at) ?? null

    return {
      id: identifier,
      title,
      fileName,
      context,
      mimeType,
      fileSize,
      private: pickBoolean(media.private),
      favorite: pickBoolean(media.favorite),
      createdAt,
      updatedAt,
    }
  })
})

const tableError = computed(() =>
  mediaError.value ? t('admin.mediaManagement.errors.loadFailed') : null,
)

const mediaCountDisplay = computed(
  () => mediaCount.value ?? items.value.length ?? 0,
)

const subtitle = computed(() =>
  t('admin.mediaManagement.subtitle', { count: mediaCountDisplay.value }),
)

const dateFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value ?? 'en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
)

function formatDate(value: string | number | Date | null | undefined) {
  if (value == null) {
    return t('admin.mediaManagement.labels.notAvailable')
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string'
      ? value
      : t('admin.mediaManagement.labels.notAvailable')
  }

  return dateFormatter.value.format(date)
}

function formatFileSize(value: unknown) {
  const size = normalizeNumber(value)
  if (size == null) {
    return t('admin.mediaManagement.labels.notAvailable')
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let current = size
  let unitIndex = 0

  while (current >= 1024 && unitIndex < units.length - 1) {
    current /= 1024
    unitIndex += 1
  }

  const formatted = unitIndex === 0 ? current.toFixed(0) : current.toFixed(1)
  return `${formatted} ${units[unitIndex]}`
}

const refresh = () =>
  Promise.all([adminStore.refreshMedia(), adminStore.refreshMediaCount()])
</script>

<template>
  <v-container fluid class="py-6">
    <AdminDataTable
      v-model:search="search"
      :headers="headers"
      :items="items"
      :loading="mediaPending"
      :error="tableError"
      :title="t('admin.mediaManagement.title')"
      :subtitle="subtitle"
      color="primary"
      @refresh="refresh"
    >
      <template #[`item.context`]="{ value }">
        <span v-if="value">{{ value }}</span>
        <span v-else class="text-medium-emphasis">
          {{ t('admin.mediaManagement.labels.noContext') }}
        </span>
      </template>

      <template #[`item.mimeType`]="{ value }">
        <span v-if="value">{{ value }}</span>
        <span v-else class="text-medium-emphasis">
          {{ t('admin.mediaManagement.labels.notAvailable') }}
        </span>
      </template>

      <template #[`item.fileSize`]="{ value }">
        {{ formatFileSize(value) }}
      </template>

      <template #[`item.private`]="{ value }">
        <v-chip
          :color="value ? 'error' : 'success'"
          size="small"
          variant="tonal"
        >
          {{
            value
              ? t('admin.mediaManagement.labels.private')
              : t('admin.mediaManagement.labels.public')
          }}
        </v-chip>
      </template>

      <template #[`item.favorite`]="{ value }">
        <v-chip :color="value ? 'warning' : undefined" size="small" variant="tonal">
          {{
            value
              ? t('admin.mediaManagement.labels.favorite')
              : t('admin.mediaManagement.labels.notFavorite')
          }}
        </v-chip>
      </template>

      <template #[`item.createdAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.updatedAt`]="{ value }">
        {{ formatDate(value) }}
      </template>
    </AdminDataTable>
  </v-container>
</template>
