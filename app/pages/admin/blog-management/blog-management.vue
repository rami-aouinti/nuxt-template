<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { Blog } from '~/types/blog'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  normalizeCollection,
  pickString,
  resolveStringList,
  resolveUserName,
  resolveVisibilityFlag,
} from '~/utils/blog/admin'

definePageMeta({
  title: 'navigation.blogs',
  icon: 'mdi-notebook-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = import.meta.server
  ? useRequestHeaders(['cookie', 'authorization'])
  : undefined

interface BlogRow {
  id: string
  title: string
  subtitle?: string | null
  author: string
  teams: string[]
  createdAt: string | null
  updatedAt: string | null
  visible: boolean
}

const search = ref('')

const {
  data: rawBlogs,
  pending,
  error,
  refresh,
} = await useFetch<Blog[]>('/api/blog/v1/blog', {
  key: 'admin-blog-list',
  headers,
  credentials: 'include',
  transform: (data) => normalizeCollection<Blog>(data),
})

const blogs = computed<BlogRow[]>(() => {
  const entries = rawBlogs.value ?? []

  return entries.map((blog, index) => {
    const identifier =
      pickString(blog?.id, blog?.uuid, blog?.slug, blog?.name) ?? `blog-${index}`
    const title =
      pickString(blog?.title, blog?.name, blog?.slug) ||
      t('admin.blogManagement.common.none')
    const subtitle = pickString(blog?.subtitle, blog?.description)
    const author =
      resolveUserName(blog?.owner ?? blog?.user ?? blog?.author) ??
      t('admin.blogManagement.common.none')
    const teamsSource =
      blog?.teams ?? blog?.categories ?? blog?.groups ?? []
    const teams = resolveStringList(teamsSource, ['name', 'title', 'label', 'slug'])
    const createdAt = pickString(blog?.createdAt, blog?.created_at)
    const updatedAt = pickString(blog?.updatedAt, blog?.updated_at)
    const visible = resolveVisibilityFlag(blog ?? null)

    return {
      id: identifier,
      title,
      subtitle: subtitle ?? null,
      author,
      teams,
      createdAt: createdAt ?? null,
      updatedAt: updatedAt ?? null,
      visible,
    }
  })
})

const errorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  const err = error.value as
    | { data?: { message?: string }; message?: string }
    | null

  return (
    (err?.data && typeof err.data.message === 'string' && err.data.message) ||
    (typeof err?.message === 'string' ? err.message : null) ||
    t('common.unexpectedError')
  )
})

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
      :loading="pending"
      :error="errorMessage"
      :title="t('admin.blogManagement.blogs.title')"
      :subtitle="t('admin.blogManagement.blogs.subtitle')"
      color="primary"
      @refresh="refresh"
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
