<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'

definePageMeta({
  title: 'navigation.blogs',
  icon: 'mdi-notebook-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

interface BlogRow {
  title: string
  subtitle?: string | null
  author: string
  teams: string[]
  createdAt: string
  updatedAt: string
  visible: boolean
}

const search = ref('')

const blogs = ref<BlogRow[]>([
  {
    title: 'Tech Insights',
    subtitle: 'Exploring architecture, tooling, and developer culture.',
    author: 'Rami Aouinti',
    teams: ['Engineering', 'Platform'],
    createdAt: '2023-08-15T09:24:00Z',
    updatedAt: '2024-04-12T13:15:00Z',
    visible: true,
  },
  {
    title: 'Product Pulse',
    subtitle: 'Stories from our product and design squads.',
    author: 'Julia Hoffmann',
    teams: ['Product', 'Design'],
    createdAt: '2023-11-02T11:05:00Z',
    updatedAt: '2024-03-28T08:40:00Z',
    visible: true,
  },
  {
    title: 'Community Chronicles',
    subtitle: 'Highlights from partners, customers, and open source.',
    author: 'Imran Malik',
    teams: ['Developer Relations'],
    createdAt: '2022-05-22T14:12:00Z',
    updatedAt: '2024-01-19T17:22:00Z',
    visible: false,
  },
])

const headers = computed<DataTableHeader[]>(() => [
  { title: t('admin.blogManagement.blogs.table.title'), key: 'title', minWidth: 200 },
  { title: t('admin.blogManagement.blogs.table.subtitle'), key: 'subtitle', minWidth: 260 },
  { title: t('admin.blogManagement.blogs.table.author'), key: 'author', minWidth: 180 },
  { title: t('admin.blogManagement.blogs.table.teams'), key: 'teams', minWidth: 200 },
  { title: t('admin.blogManagement.blogs.table.createdAt'), key: 'createdAt', minWidth: 180 },
  { title: t('admin.blogManagement.blogs.table.updatedAt'), key: 'updatedAt', minWidth: 180 },
  {
    title: t('admin.blogManagement.blogs.table.visibility'),
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
</script>

<template>
  <v-container fluid class="py-6">
    <AdminDataTable
      v-model:search="search"
      :headers="headers"
      :items="blogs"
      :title="t('admin.blogManagement.blogs.title')"
      :subtitle="t('admin.blogManagement.blogs.subtitle')"
      color="primary"
    >
      <template #[`item.subtitle`]="{ value }">
        {{ value || t('admin.blogManagement.common.none') }}
      </template>

      <template #[`item.teams`]="{ value }">
        <div class="d-flex flex-wrap align-center ga-2">
          <template v-if="value?.length">
            <v-chip
              v-for="team in value"
              :key="team"
              color="primary"
              size="small"
              variant="tonal"
            >
              {{ team }}
            </v-chip>
          </template>
          <span v-else class="text-medium-emphasis">
            {{ t('admin.blogManagement.common.none') }}
          </span>
        </div>
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
