<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { Blog } from '~/types/blog'
import type { BlogPost } from '~/types/blogPost'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  pickString,
  resolveFirstAvailableNumber,
  resolvePostUrl,
  resolveStringList,
  resolveUserName,
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
  title: 'navigation.posts',
  icon: 'mdi-post-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const tableHeaders = computed<DataTableHeader[]>(() => [
  {
    title: t('admin.blogManagement.posts.table.title'),
    key: 'title',
    minWidth: 220,
  },
  {
    title: t('admin.blogManagement.posts.table.blog'),
    key: 'blog',
    minWidth: 180,
  },
  {
    title: t('admin.blogManagement.posts.table.author'),
    key: 'author',
    minWidth: 180,
  },
  {
    title: t('admin.blogManagement.posts.table.publishedAt'),
    key: 'publishedAt',
    minWidth: 180,
  },
  {
    title: t('admin.blogManagement.posts.table.url'),
    key: 'url',
    minWidth: 220,
  },
  {
    title: t('admin.blogManagement.posts.table.tags'),
    key: 'tags',
    minWidth: 200,
  },
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

interface PostRow {
  id: string
  title: string
  blog: string
  author: string
  publishedAt: string | null
  url: string | null
  tags: string[]
  commentCount: number
  likeCount: number
  visible: boolean
}

const search = ref('')

const {
  data: rawPosts,
  pending,
  error,
  refresh,
} = await useFetch<BlogPost[]>('/api/blog/v1/post', {
  key: 'admin-post-list',
  credentials: 'include',
  transform: (data) => normalizeCollection<BlogPost>(data),
})

const posts = computed<PostRow[]>(() => {
  const entries = rawPosts.value ?? []

  return entries.map((post, index) => {
    const identifier =
      pickString(post?.id, post?.uuid, post?.slug, post?.identifier) ??
      `post-${index}`
    const title =
      pickString(post?.title, post?.name, post?.slug) ||
      t('admin.blogManagement.common.none')
    const blogRelation = post?.blog as Blog | undefined
    const blogName =
      pickString(
        post?.blogTitle,
        post?.blogName,
        blogRelation?.title,
        blogRelation?.name,
      ) || t('admin.blogManagement.common.none')
    const author =
      resolveUserName(post?.user ?? post?.author) ??
      t('admin.blogManagement.common.none')
    const publishedAt = pickString(
      post?.publishedAt,
      post?.published_at,
      post?.createdAt,
      post?.created_at,
    )
    const url = resolvePostUrl(post ?? null)
    const tagsSource =
      post?.tags ?? post?.tagList ?? post?.tagNames ?? post?.categories ?? []
    const tags = resolveStringList(tagsSource, [
      'name',
      'title',
      'label',
      'value',
    ])
    const commentCount = resolveFirstAvailableNumber(
      [
        post?.commentCount,
        post?.commentsCount,
        post?.totalComments,
        post?.comments,
      ],
      0,
    )
    const likeCount = resolveFirstAvailableNumber(
      [post?.likeCount, post?.likesCount, post?.likes, post?.reactionsCount],
      0,
    )
    const visible = resolveVisibilityFlag(post ?? null)

    return {
      id: identifier,
      title,
      blog: blogName,
      author,
      publishedAt: publishedAt ?? null,
      url,
      tags,
      commentCount,
      likeCount,
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
      :items="posts"
      :loading="pending"
      :error="errorMessage"
      :title="t('admin.blogManagement.posts.title')"
      :subtitle="t('admin.blogManagement.posts.subtitle')"
      color="primary"
      @refresh="refresh"
    >
      <template #[`item.publishedAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.url`]="{ value }">
        <template v-if="value">
          <a
            :href="value"
            class="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ value }}
          </a>
        </template>
        <span v-else class="text-medium-emphasis">
          {{ t('admin.blogManagement.common.none') }}
        </span>
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
