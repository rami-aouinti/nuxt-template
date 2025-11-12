<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import BlogMyBlogsList from '~/components/Blog/MyBlogsList.vue'
import { BLOG_POSTS_DEFAULT_LIMIT, useBlogApi } from '~/composables/useBlogApi'
import { useProfilePostsStore } from '~/stores/profile-posts'
import type {BlogPostViewModel, BlogSummary} from '~/types/blog'
import AppButton from "~/components/ui/AppButton.vue";
import AppCard from "~/components/ui/AppCard.vue";
import BlogPostCard from "~/components/Blog/PostCard.vue";
import { truncateText, formatPublishedAt as formatBlogPublishedAt } from '~/utils/formatters'

definePageMeta({
  title: 'navigation.profile',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const { fetchProfilePosts, fetchUserBlogs } = useBlogApi()
const { session, loggedIn } = useUserSession()
const POST_EXCERPT_MAX_LENGTH = 150
const currentUsername = computed(
  () => session.value?.user?.login || session.value?.profile?.username || null,
)

const profilePostsStore = useProfilePostsStore()
const {
  posts,
  pagination,
  isInitialLoading,
  isLoadingMore,
  error: postsError,
} = storeToRefs(profilePostsStore)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const myBlogs = ref<BlogSummary[]>([])
const myBlogsLoading = ref(false)
const myBlogsError = ref<string | null>(null)

const hasMore = computed(
  () => posts.value.length < pagination.value.total && posts.value.length > 0,
)

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

async function loadMyBlogs() {
  if (!loggedIn.value) {
    myBlogs.value = []
    myBlogsError.value = null
    myBlogsLoading.value = false
    return
  }

  myBlogsLoading.value = true
  myBlogsError.value = null

  try {
    myBlogs.value = await fetchUserBlogs()
  } catch (error) {
    myBlogsError.value =
      error instanceof Error && error.message
        ? error.message
        : t('blog.alerts.loadFailed')
  } finally {
    myBlogsLoading.value = false
  }
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
  await Promise.all([loadPosts(1, { replace: true }), loadMyBlogs()])
}

function canEditPost(post: BlogPostViewModel) {
  return loggedIn.value && post.user.username === currentUsername.value
}

function getPostExcerpt(post: BlogPostViewModel) {
  const summary = typeof post.summary === 'string' ? post.summary.trim() : ''
  if (summary.length) {
    return truncateText(summary, POST_EXCERPT_MAX_LENGTH)
  }

  const content = getPostPlainContent(post.content)
  if (content.length) {
    return truncateText(content, POST_EXCERPT_MAX_LENGTH)
  }

  return ''
}

function getPostPlainContent(content: string | null | undefined) {
  if (!content) {
    return ''
  }

  if (typeof window !== 'undefined' && 'DOMParser' in window) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const text = doc.body.textContent || ''
    return text.replace(/\s+/g, ' ').trim()
  }

  return content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const formatPublishedAt = (publishedAt: string) =>
  formatBlogPublishedAt(publishedAt, locale.value)

watch(
  () => loggedIn.value,
  (value) => {
    if (value) {
      void Promise.all([loadPosts(1, { replace: true }), loadMyBlogs()])
    } else {
      profilePostsStore.reset()
      pagination.value.limit = BLOG_POSTS_DEFAULT_LIMIT
      myBlogs.value = []
      myBlogsError.value = null
      myBlogsLoading.value = false
    }
  },
)
</script>

<template>
  <ProfilePageShell>
    <v-row class="justify-center">
      <v-col cols="12">
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
                    {{ post.summary || t('blog.placeholders.noSummary') }}
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
    <client-only>
      <teleport to="#app-drawer-right">
        <div class="animated-badge mb-4">
          <span class="animated-badge__pulse" />
          {{ t('blog.sidebar.myBlogsTitle') }}
        </div>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ t('blog.sidebar.intro') }}
        </p>
        <BlogMyBlogsList
          :logged-in="loggedIn"
          :blogs="myBlogs"
          :loading="myBlogsLoading"
          :error="myBlogsError"
        />
      </teleport>
    </client-only>
  </ProfilePageShell>
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

.blog-sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.blog-sidebar {
  border-radius: 24px;
  background: var(--blog-sidebar-background);
  box-shadow: var(--blog-sidebar-shadow);
}
</style>
