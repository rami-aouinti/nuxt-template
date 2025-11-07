<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'

definePageMeta({
  title: 'navigation.tags',
  icon: 'mdi-tag-multiple-outline',
  drawerIndex: 4,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

interface TagRow {
  name: string
  description: string
  color: string
  usage: number
  createdAt: string
  updatedAt: string
  visible: boolean
}

const search = ref('')

const tags = ref<TagRow[]>([
  {
    name: 'Architecture',
    description: 'Articles covering system and software architecture decisions.',
    color: '#6366F1',
    usage: 18,
    createdAt: '2022-09-12T10:15:00Z',
    updatedAt: '2024-03-01T08:22:00Z',
    visible: true,
  },
  {
    name: 'Product',
    description: 'Product discovery, roadmaps, and release notes.',
    color: '#22C55E',
    usage: 24,
    createdAt: '2023-01-05T08:00:00Z',
    updatedAt: '2024-04-18T12:40:00Z',
    visible: true,
  },
  {
    name: 'Community',
    description: 'Highlights and stories from our global community.',
    color: '#F97316',
    usage: 9,
    createdAt: '2021-11-22T14:45:00Z',
    updatedAt: '2024-02-07T17:10:00Z',
    visible: false,
  },
])

const headers = computed<DataTableHeader[]>(() => [
  { title: t('admin.blogManagement.tags.table.name'), key: 'name', minWidth: 160 },
  { title: t('admin.blogManagement.tags.table.description'), key: 'description', minWidth: 280 },
  { title: t('admin.blogManagement.tags.table.color'), key: 'color', minWidth: 150 },
  {
    title: t('admin.blogManagement.tags.table.usage'),
    key: 'usage',
    align: 'end',
    width: 120,
  },
  { title: t('admin.blogManagement.tags.table.createdAt'), key: 'createdAt', minWidth: 180 },
  { title: t('admin.blogManagement.tags.table.updatedAt'), key: 'updatedAt', minWidth: 180 },
  {
    title: t('admin.blogManagement.tags.table.visibility'),
    key: 'visible',
    align: 'end',
    minWidth: 140,
  },
])

const dateFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value ?? 'en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
)

const numberFormatter = computed(
  () => new Intl.NumberFormat(locale.value ?? 'en'),
)

function formatDate(value: string | number | Date | null | undefined) {
  if (value == null) {
    return t('admin.blogManagement.common.none')
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : t('admin.blogManagement.common.none')
  }

  return dateFormatter.value.format(date)
}

function formatNumber(value: number | string | null | undefined) {
  if (value == null) {
    return '0'
  }

  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return String(value)
  }

  return numberFormatter.value.format(numeric)
}
</script>

<template>
  <v-container fluid class="py-6">
    <AdminDataTable
      v-model:search="search"
      :headers="headers"
      :items="tags"
      :title="t('admin.blogManagement.tags.title')"
      :subtitle="t('admin.blogManagement.tags.subtitle')"
      color="primary"
    >
      <template #[`item.color`]="{ value }">
        <template v-if="value">
          <v-chip
            class="text-uppercase font-weight-medium"
            size="small"
            variant="flat"
            :style="{ backgroundColor: value, color: 'white' }"
          >
            {{ value }}
          </v-chip>
        </template>
        <span v-else class="text-medium-emphasis">
          {{ t('admin.blogManagement.common.none') }}
        </span>
      </template>

      <template #[`item.usage`]="{ value }">
        {{ formatNumber(value) }}
      </template>

      <template #[`item.createdAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.updatedAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.visible`]="{ value }">
        <v-chip
          :color="value ? 'success' : 'warning'"
          class="text-uppercase"
          size="small"
          variant="flat"
        >
          {{
            value
              ? t('admin.blogManagement.common.visibility.visible')
              : t('admin.blogManagement.common.visibility.hidden')
          }}
        </v-chip>
      </template>
    </AdminDataTable>
  </v-container>
</template>
