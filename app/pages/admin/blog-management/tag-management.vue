<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { BlogTag } from '~/types/blogTag'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  pickString,
  resolveFirstAvailableNumber,
  resolveVisibilityFlag,
} from '~/utils/blog/admin'
import { normalizeCollection } from '~/utils/collections'
import {
  createDateFormatter,
  createNumberFormatter,
  formatDateValue,
  formatNumberValue,
} from '~/utils/formatters'
import type { DateInput } from '~/utils/formatters'

definePageMeta({
  title: 'navigation.tags',
  icon: 'mdi-tag-multiple-outline',
  drawerIndex: 4,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const tableHeaders = computed<DataTableHeader[]>(() => [
  {
    title: t('admin.blogManagement.tags.table.name'),
    key: 'name',
    minWidth: 160,
  },
  {
    title: t('admin.blogManagement.tags.table.description'),
    key: 'description',
    minWidth: 280,
  },
  {
    title: t('admin.blogManagement.tags.table.color'),
    key: 'color',
    minWidth: 150,
  },
  {
    title: t('admin.blogManagement.tags.table.usage'),
    key: 'usage',
    align: 'end',
    width: 120,
  },
  {
    title: t('admin.blogManagement.tags.table.createdAt'),
    key: 'createdAt',
    minWidth: 180,
  },
  {
    title: t('admin.blogManagement.tags.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 180,
  },
  {
    title: t('admin.blogManagement.tags.table.visibility'),
    key: 'visible',
    align: 'end',
    minWidth: 140,
  },
])

interface TagRow {
  id: string
  name: string
  description: string | null
  color: string | null
  usage: number
  createdAt: string | null
  updatedAt: string | null
  visible: boolean
}

const search = ref('')

const {
  data: rawTags,
  pending,
  error,
  refresh,
} = await useFetch<BlogTag[]>('/api/blog/v1/tag', {
  key: 'admin-tag-list',
  credentials: 'include',
  transform: (data) => normalizeCollection<BlogTag>(data),
})

const tags = computed<TagRow[]>(() => {
  const entries = rawTags.value ?? []

  return entries.map((tag, index) => {
    const identifier =
      pickString(tag?.id, tag?.uuid, tag?.name, tag?.label) ?? `tag-${index}`
    const name =
      pickString(tag?.name, tag?.title, tag?.label) ||
      t('admin.blogManagement.common.none')
    const description = pickString(tag?.description, tag?.summary)
    const color = pickString(
      tag?.color,
      tag?.hex,
      tag?.hexColor,
      tag?.hex_color,
    )
    const usage = resolveFirstAvailableNumber(
      [
        tag?.usage,
        tag?.usageCount,
        tag?.count,
        tag?.total,
        tag?.posts,
        tag?.postCount,
        tag?.post_count,
      ],
      0,
    )
    const createdAt = pickString(tag?.createdAt, tag?.created_at)
    const updatedAt = pickString(tag?.updatedAt, tag?.updated_at)
    const visible = resolveVisibilityFlag(tag ?? null)

    return {
      id: identifier,
      name,
      description: description ?? null,
      color: color ?? null,
      usage,
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

  const err = error.value as {
    data?: { message?: string }
    message?: string
  } | null

  return (
    (err?.data && typeof err.data.message === 'string' && err.data.message) ||
    (typeof err?.message === 'string' ? err.message : null) ||
    t('common.unexpectedError')
  )
})

const dateFormatter = createDateFormatter(locale)
const numberFormatter = createNumberFormatter(locale)

const formatDate = (value: DateInput) =>
  formatDateValue(value, dateFormatter.value, t('admin.blogManagement.common.none'))

const formatNumber = (value: number | string | null | undefined) =>
  formatNumberValue(value, numberFormatter.value)
</script>

<template>
  <v-container fluid class="py-6">
    <AdminDataTable
      v-model:search="search"
      :headers="tableHeaders"
      :items="tags"
      :loading="pending"
      :error="errorMessage"
      :title="t('admin.blogManagement.tags.title')"
      :subtitle="t('admin.blogManagement.tags.subtitle')"
      color="primary"
      @refresh="refresh"
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
