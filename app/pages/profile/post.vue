<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { BLOG_POSTS_DEFAULT_LIMIT, useBlogApi } from '~/composables/useBlogApi'
import type { BlogPostUser } from '~/types/blog'
import { useProfilePostsStore } from '~/stores/profile-posts'

definePageMeta({
  title: 'navigation.profile',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const { fetchProfilePosts } = useBlogApi()
const { loggedIn } = useUserSession()

const profilePostsStore = useProfilePostsStore()
const {
  posts,
  pagination,
  isInitialLoading,
  isLoadingMore,
  error: postsError,
} = storeToRefs(profilePostsStore)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const hasMore = computed(
  () => posts.value.length < pagination.value.total && posts.value.length > 0,
)

const formatPublishedAt = (publishedAt: string) =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(publishedAt))

const AUTHOR_PLACEHOLDER = '__AUTHOR__'

function getAuthorName(user: BlogPostUser) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  if (user.firstName) {
    return user.firstName
  }

  return user.username
}

function getAuthorProfileLink(user: BlogPostUser) {
  const username = typeof user.username === 'string' ? user.username.trim() : ''
  return username.length ? `/profile/${encodeURIComponent(username)}` : null
}

function getAuthorMetaParts(date: string) {
  const template = t('blog.meta.author', {
    author: AUTHOR_PLACEHOLDER,
    date,
  })

  const [prefix = '', suffix = ''] = template.split(AUTHOR_PLACEHOLDER)
  return { prefix, suffix }
}

async function loadPosts(
  pageNumber: number,
  { replace = false }: { replace?: boolean } = {},
) {
  postsError.value = null

  if (pageNumber === 1 && replace) {
    isInitialLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await fetchProfilePosts(
      pageNumber,
      pagination.value.limit || BLOG_POSTS_DEFAULT_LIMIT,
    )
    profilePostsStore.applyResponse(response, { replace })
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

  await loadPosts(pagination.value.page + 1)
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

if (loggedIn.value) {
  await loadPosts(1, { replace: true })
}

watch(
  () => loggedIn.value,
  (value) => {
    if (value) {
      void loadPosts(1, { replace: true })
    } else {
      profilePostsStore.reset()
      pagination.value.limit = BLOG_POSTS_DEFAULT_LIMIT
    }
  },
)
</script>

<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12" lg="10" xl="8">
        <v-sheet class="rounded-xl mb-6" elevation="2">
          <div
            class="pa-6 d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4"
          >
            <div>
              <h1 class="text-h4 text-h3-md font-weight-bold mb-1">
                {{ t('blog.title') }}
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ t('blog.sidebar.myBlogsTitle') }}
              </p>
            </div>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-note-plus"
              to="/blog"
            >
              {{ t('blog.sidebar.createPost') }}
            </v-btn>
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
              <v-card class="rounded-xl" elevation="2">
                <v-card-item>
                  <v-card-title class="text-h5 text-wrap">
                    <NuxtLink :to="`/post/${post.slug}`" class="blog-post-link">
                      {{ post.title }}
                    </NuxtLink>
                  </v-card-title>
                  <v-card-subtitle
                    class="text-body-2 text-medium-emphasis d-flex flex-wrap align-center"
                  >
                    <span>
                      {{
                        getAuthorMetaParts(formatPublishedAt(post.publishedAt))
                          .prefix
                      }}
                    </span>
                    <NuxtLink
                      v-if="getAuthorProfileLink(post.user)"
                      :to="getAuthorProfileLink(post.user)"
                      class="blog-post-card__author-link mx-1"
                    >
                      {{ getAuthorName(post.user) }}
                    </NuxtLink>
                    <span v-else class="mx-1">{{
                      getAuthorName(post.user)
                    }}</span>
                    <span>
                      {{
                        getAuthorMetaParts(formatPublishedAt(post.publishedAt))
                          .suffix
                      }}
                    </span>
                  </v-card-subtitle>
                </v-card-item>

                <v-card-text>
                  <p class="text-body-1 mb-4">
                    {{ post.summary || t('blog.placeholders.noSummary') }}
                  </p>
                  <div class="d-flex flex-wrap align-center">
                    <div
                      class="d-flex align-center text-medium-emphasis mr-6 mb-2"
                    >
                      <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
                      {{
                        t('blog.stats.reactions', {
                          count: post.reactions_count ?? 0,
                        })
                      }}
                    </div>
                    <div
                      class="d-flex align-center text-medium-emphasis mr-6 mb-2"
                    >
                      <v-icon icon="mdi-comment-text-outline" class="mr-1" />
                      {{
                        t('blog.stats.comments', {
                          count: post.totalComments ?? 0,
                        })
                      }}
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions class="pt-0 pb-4 px-4">
                  <v-btn
                    :href="post.url || undefined"
                    :disabled="!post.url"
                    target="_blank"
                    color="primary"
                    variant="text"
                    append-icon="mdi-open-in-new"
                  >
                    {{ t('blog.actions.read') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
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

.blog-post-card__author-link {
  color: inherit;
  text-decoration: none;
}

.blog-post-card__author-link:hover,
.blog-post-card__author-link:focus-visible {
  text-decoration: underline;
}

.blog-infinite-trigger {
  height: 1px;
}
</style>
