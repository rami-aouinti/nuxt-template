<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { BLOG_POSTS_DEFAULT_LIMIT, useBlogApi } from '~/composables/useBlogApi'
import type { BlogPost, BlogSummary } from '~/types/blog'
import {
  truncateText,
  formatPublishedAt as formatBlogPublishedAt,
} from '~/utils/formatters'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'

definePageMeta({
  icon: 'mdi-rss',
  title: 'Blog',
  drawerIndex: 1,
})

const route = useRoute()
const { t, locale } = useI18n()
const { fetchBlogPostsBySlug } = useBlogApi()

const slug = computed(() => {
  const value = route.params.slug
  return typeof value === 'string'
    ? value
    : Array.isArray(value)
      ? (value[0] ?? '')
      : ''
})

const posts = ref<BlogPost[]>([])
const blogInfo = ref<BlogSummary | null>(null)
const pagination = reactive({
  page: 1,
  limit: BLOG_POSTS_DEFAULT_LIMIT,
  total: 0,
})

const isInitialLoading = ref(false)
const isLoadingMore = ref(false)
const postsError = ref<string | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const hasMore = computed(
  () => posts.value.length < pagination.total && posts.value.length > 0,
)

const formatPublishedAt = (publishedAt: string) =>
  formatBlogPublishedAt(publishedAt, locale.value)

function getPostExcerpt(post: BlogPost, maxLength = 50) {
  const summary = typeof post.summary === 'string' ? post.summary : ''
  const content = typeof post.content === 'string' ? post.content : ''
  const source = summary.trim().length ? summary : content
  const normalized = source.replace(/\s+/g, ' ').trim()

  if (!normalized.length) {
    return t('blog.placeholders.noSummary')
  }

  return truncateText(normalized, maxLength)
}

async function loadPosts(
  pageNumber: number,
  { replace = false }: { replace?: boolean } = {},
) {
  const currentSlug = slug.value.trim()
  if (!currentSlug.length) {
    posts.value = []
    pagination.page = 1
    pagination.total = 0
    postsError.value = t('blog.errors.loadBlogsFailed')
    return
  }

  postsError.value = null

  if (pageNumber === 1 && replace) {
    isInitialLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await fetchBlogPostsBySlug(
      currentSlug,
      pageNumber,
      pagination.limit,
    )
    const data = Array.isArray(response.data) ? response.data : []

    if (!blogInfo.value) {
      const summary = data.find((post) => post.blog)?.blog
      if (summary) {
        blogInfo.value = summary
      }
    }

    if (replace) {
      posts.value = data
    } else {
      const existingIds = new Set(posts.value.map((post) => post.id))
      const merged = data.filter((post) => !existingIds.has(post.id))
      posts.value = [...posts.value, ...merged]
    }

    pagination.page = response.page
    pagination.limit = response.limit
    pagination.total = response.count
  } catch (error) {
    postsError.value =
      error instanceof Error && error.message
        ? error.message
        : t('blog.alerts.loadFailed')
  } finally {
    if (pageNumber === 1 && replace) {
      isInitialLoading.value = false
    } else {
      isLoadingMore.value = false
    }
  }
}

async function loadMorePosts() {
  if (isInitialLoading.value || isLoadingMore.value || !hasMore.value) {
    return
  }

  await loadPosts(pagination.page + 1)
}

if (import.meta.client) {
  useIntersectionObserver(
    loadMoreTrigger,
    ([entry]) => {
      if (entry?.isIntersecting) {
        void loadMorePosts()
      }
    },
    { rootMargin: '200px' },
  )
}

await loadPosts(1, { replace: true })

watch(
  () => slug.value,
  (next, previous) => {
    if (next && next !== previous) {
      blogInfo.value = null
      void loadPosts(1, { replace: true })
    }
  },
)
</script>

<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12" lg="10" xl="8">
        <AppButton
          class="mb-4"
          color="primary"
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/blog"
        >
          {{ t('common.actions.back') }}
        </AppButton>

        <v-sheet class="rounded-xl mb-6" elevation="2">
          <div class="pa-6">
            <h1 class="text-h4 text-h3-md font-weight-bold mb-1">
              {{ blogInfo?.title || slug }}
            </h1>
            <p
              v-if="blogInfo?.blogSubtitle"
              class="text-body-1 text-medium-emphasis mb-0"
            >
              {{ blogInfo.blogSubtitle }}
            </p>
            <p
              v-else-if="blogInfo?.author"
              class="text-body-1 text-medium-emphasis mb-0"
            >
              {{ blogInfo.author }}
            </p>
          </div>
        </v-sheet>

        <v-alert
          v-if="postsError"
          type="error"
          variant="tonal"
          border="start"
          prominent
          class="mb-4"
        >
          {{ postsError }}
        </v-alert>

        <v-row v-if="isInitialLoading">
          <v-col v-for="index in 3" :key="index" cols="12" class="pb-6">
            <v-skeleton-loader type="heading, paragraph" class="rounded-xl" />
          </v-col>
        </v-row>

        <template v-else>
          <v-row v-if="posts.length">
            <v-col v-for="post in posts" :key="post.id" cols="12" class="pb-6">
              <AppCard class="rounded-xl" elevation="2">
                <v-card-item>
                  <v-card-title class="text-h5 text-wrap">
                    <NuxtLink :to="`/post/${post.slug}`" class="blog-post-link">
                      {{ post.title }}
                    </NuxtLink>
                  </v-card-title>
                  <BlogPostMeta
                    tag="v-card-subtitle"
                    class="text-body-2 text-medium-emphasis"
                    :user="post.user"
                    :published-at="post.publishedAt"
                    :format-date="formatPublishedAt"
                  />
                </v-card-item>

                <v-card-text>
                  <p class="text-body-1 mb-4">
                    {{ getPostExcerpt(post) }}
                  </p>
                  <BlogReactionBar
                    :reactions-count="post.reactions_count ?? 0"
                    :comments-count="post.totalComments ?? 0"
                  />
                </v-card-text>

                <v-card-actions class="pt-0 pb-4 px-4">
                  <AppButton
                    :href="post.url || undefined"
                    :disabled="!post.url"
                    target="_blank"
                    color="primary"
                    variant="text"
                    append-icon="mdi-open-in-new"
                  >
                    {{ t('blog.actions.read') }}
                  </AppButton>
                </v-card-actions>
              </AppCard>
            </v-col>
          </v-row>

          <v-sheet
            v-else
            class="d-flex flex-column align-center justify-center py-16 text-center"
            elevation="1"
            rounded="xl"
          >
            <v-icon icon="mdi-post-outline" size="64" class="mb-4" />
            <h2 class="text-h5 mb-2">{{ t('blog.empty.title') }}</h2>
            <p class="text-medium-emphasis mb-0">
              {{ t('blog.empty.description') }}
            </p>
          </v-sheet>
        </template>

        <div class="d-flex justify-center py-4">
          <v-progress-circular
            v-if="isLoadingMore"
            indeterminate
            color="primary"
          />
        </div>

        <div
          v-show="hasMore"
          ref="loadMoreTrigger"
          class="blog-infinite-trigger"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.blog-post-link {
  color: inherit;
  text-decoration: none;
}

.blog-post-link:hover,
.blog-post-link:focus-visible {
  text-decoration: underline;
}

.blog-infinite-trigger {
  height: 1px;
}
</style>
