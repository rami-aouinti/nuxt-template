<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'

definePageMeta({
  title: 'navigation.posts',
  icon: 'mdi-post-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

interface PostRow {
  title: string
  blog: string
  author: string
  publishedAt: string
  url: string
  tags: string[]
  commentCount: number
  likeCount: number
  visible: boolean
}

const search = ref('')

const posts = ref<PostRow[]>([
  {
    title: 'Understanding Domain Events',
    blog: 'Tech Insights',
    author: 'Rami Aouinti',
    publishedAt: '2024-05-12T14:30:00Z',
    url: 'https://example.com/domain-events',
    tags: ['Architecture', 'PHP'],
    commentCount: 12,
    likeCount: 54,
    visible: true,
  },
  {
    title: 'Designing Product Narratives',
    blog: 'Product Pulse',
    author: 'Julia Hoffmann',
    publishedAt: '2024-04-28T09:10:00Z',
    url: 'https://example.com/product-narratives',
    tags: ['Product', 'Design'],
    commentCount: 5,
    likeCount: 31,
    visible: true,
  },
  {
    title: 'Building Stronger Communities Online',
    blog: 'Community Chronicles',
    author: 'Imran Malik',
    publishedAt: '2024-02-16T18:45:00Z',
    url: 'https://example.com/communities-online',
    tags: ['Community', 'Guides'],
    commentCount: 3,
    likeCount: 18,
    visible: false,
  },
])

const headers = computed<DataTableHeader[]>(() => [
  { title: t('admin.blogManagement.posts.table.title'), key: 'title', minWidth: 220 },
  { title: t('admin.blogManagement.posts.table.blog'), key: 'blog', minWidth: 180 },
  { title: t('admin.blogManagement.posts.table.author'), key: 'author', minWidth: 180 },
  { title: t('admin.blogManagement.posts.table.publishedAt'), key: 'publishedAt', minWidth: 180 },
  { title: t('admin.blogManagement.posts.table.url'), key: 'url', minWidth: 220 },
  { title: t('admin.blogManagement.posts.table.tags'), key: 'tags', minWidth: 200 },
  {
    title: t('admin.blogManagement.posts.table.comments'),
    key: 'commentCount',
    align: 'end',
    width: 120,
  },
  {
    title: t('admin.blogManagement.posts.table.likes'),
    key: 'likeCount',
    align: 'end',
    width: 120,
  },
  {
    title: t('admin.blogManagement.posts.table.visibility'),
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
      :items="posts"
      :title="t('admin.blogManagement.posts.title')"
      :subtitle="t('admin.blogManagement.posts.subtitle')"
      color="primary"
    >
      <template #[`item.publishedAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.url`]="{ value }">
        <a
          :href="value"
          class="text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ value }}
        </a>
      </template>

      <template #[`item.tags`]="{ value }">
        <div class="d-flex flex-wrap align-center ga-2">
          <template v-if="value?.length">
            <v-chip
              v-for="tag in value"
              :key="tag"
              color="primary"
              size="small"
              variant="tonal"
            >
              {{ tag }}
            </v-chip>
          </template>
          <span v-else class="text-medium-emphasis">
            {{ t('admin.blogManagement.common.none') }}
          </span>
        </div>
      </template>

      <template #[`item.commentCount`]="{ value }">
        {{ formatNumber(value) }}
      </template>

      <template #[`item.likeCount`]="{ value }">
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
