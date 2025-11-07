<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { BlogComment } from '~/types/blogComment'
import type { BlogPost } from '~/types/blogPost'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  normalizeCollection,
  pickString,
  resolveFirstAvailableNumber,
  resolvePostTitle,
  resolveUserName,
  resolveVisibilityFlag,
} from '~/utils/blog/admin'

definePageMeta({
  title: 'navigation.comments',
  icon: 'mdi-comment-text-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

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

interface CommentRow {
  id: string
  author: string
  post: string
  content: string | null
  publishedAt: string | null
  likes: number
  replies: number
  visible: boolean
}

const search = ref('')

const {
  data: rawComments,
  pending,
  error,
  refresh,
} = await useFetch<BlogComment[]>('/api/blog/v1/comment', {
  key: 'admin-comment-list',
  headers,
  credentials: 'include',
  transform: (data) => normalizeCollection<BlogComment>(data),
})

const comments = computed<CommentRow[]>(() => {
  const entries = rawComments.value ?? []

  return entries.map((comment, index) => {
    const identifier =
      pickString(comment?.id, comment?.uuid) ?? `comment-${index}`
    const author =
      resolveUserName(comment?.user ?? comment?.author) ??
      t('admin.blogManagement.common.none')
    const relatedPost =
      (comment?.post ??
        comment?.article ??
        comment?.entry ??
        comment?.target) as BlogPost | undefined
    const postTitle =
      pickString(
        comment?.postTitle,
        comment?.post_title,
        resolvePostTitle(relatedPost),
      ) || t('admin.blogManagement.common.none')
    const content =
      pickString(comment?.content, comment?.body, comment?.message, comment?.text) ??
      null
    const publishedAt = pickString(
      comment?.publishedAt,
      comment?.published_at,
      comment?.createdAt,
      comment?.created_at,
    )
    const likes = resolveFirstAvailableNumber(
      [comment?.likes, comment?.likeCount, comment?.likesCount, comment?.reactionsCount],
      0,
    )
    const replies = resolveFirstAvailableNumber(
      [comment?.replies, comment?.replyCount, comment?.repliesCount, comment?.replies_count],
      0,
    )
    const visible = resolveVisibilityFlag(comment ?? null)

    return {
      id: identifier,
      author,
      post: postTitle,
      content,
      publishedAt: publishedAt ?? null,
      likes,
      replies,
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
      :loading="pending"
      :error="errorMessage"
      :title="t('admin.blogManagement.comments.title')"
      :subtitle="t('admin.blogManagement.comments.subtitle')"
      color="primary"
      @refresh="refresh"
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
