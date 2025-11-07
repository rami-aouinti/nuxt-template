<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'

definePageMeta({
  title: 'navigation.comments',
  icon: 'mdi-comment-text-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

interface CommentRow {
  author: string
  post: string
  content: string
  publishedAt: string
  likes: number
  replies: number
  visible: boolean
}

const search = ref('')

const comments = ref<CommentRow[]>([
  {
    author: 'Sara Lang',
    post: 'Understanding Domain Events',
    content:
      'Great breakdown of domain events and their lifecycle. The diagrams made it much easier to explain to our team.',
    publishedAt: '2024-05-13T09:20:00Z',
    likes: 8,
    replies: 2,
    visible: true,
  },
  {
    author: 'Leonard Böhm',
    post: 'Designing Product Narratives',
    content:
      'We used this storytelling structure for our last release and it resonated so well with stakeholders. Thanks for sharing!',
    publishedAt: '2024-05-02T16:45:00Z',
    likes: 5,
    replies: 1,
    visible: true,
  },
  {
    author: 'Maya Chen',
    post: 'Building Stronger Communities Online',
    content:
      'Could you elaborate on how you moderate long-running discussion threads? We are looking for best practices.',
    publishedAt: '2024-03-18T11:05:00Z',
    likes: 2,
    replies: 0,
    visible: false,
  },
])

const headers = computed<DataTableHeader[]>(() => [
  { title: t('admin.blogManagement.comments.table.author'), key: 'author', minWidth: 180 },
  { title: t('admin.blogManagement.comments.table.post'), key: 'post', minWidth: 220 },
  { title: t('admin.blogManagement.comments.table.content'), key: 'content', minWidth: 320 },
  { title: t('admin.blogManagement.comments.table.publishedAt'), key: 'publishedAt', minWidth: 180 },
  {
    title: t('admin.blogManagement.comments.table.likes'),
    key: 'likes',
    align: 'end',
    width: 120,
  },
  {
    title: t('admin.blogManagement.comments.table.replies'),
    key: 'replies',
    align: 'end',
    width: 120,
  },
  {
    title: t('admin.blogManagement.comments.table.visibility'),
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

function truncateContent(content: string | null | undefined) {
  if (!content) {
    return t('admin.blogManagement.common.none')
  }
  const limit = 120
  if (content.length <= limit) {
    return content
  }
  return `${content.slice(0, limit)}…`
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
      :items="comments"
      :title="t('admin.blogManagement.comments.title')"
      :subtitle="t('admin.blogManagement.comments.subtitle')"
      color="primary"
    >
      <template #[`item.content`]="{ value }">
        <span class="text-body-2">{{ truncateContent(value) }}</span>
      </template>

      <template #[`item.publishedAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.likes`]="{ value }">
        {{ formatNumber(value) }}
      </template>

      <template #[`item.replies`]="{ value }">
        {{ formatNumber(value) }}
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
