<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import BlogCommentThread from '~/components/Blog/CommentThread.vue'
import {
  BLOG_POSTS_DEFAULT_LIMIT,
  AuthenticationRequiredError,
  useBlogApi,
} from '~/composables/useBlogApi'
import type {
  BlogComment,
  BlogCommentViewModel,
  BlogPost,
  BlogPostViewModel,
  BlogPostUser,
} from '~/types/blog'
import { Notify } from '~/stores/notification'

definePageMeta({
  icon: 'mdi-home',
  title: 'navigation.blog',
  drawerIndex: 1,
})

const { t, locale } = useI18n()
const { session, loggedIn } = useUserSession()

const currentUsername = computed(
  () => session.value?.user?.login || session.value?.profile?.username || null,
)

const {
  fetchPosts,
  fetchComments,
  createComment,
  replyToComment,
  likePost,
  dislikePost,
  likeComment,
  dislikeComment,
  updatePost,
  deletePost,
} = useBlogApi()

const posts = ref<BlogPostViewModel[]>([])
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

let activeRequest = 0
let previousLoggedIn = loggedIn.value

function createCommentViewModel(comment: BlogComment): BlogCommentViewModel {
  return {
    ...comment,
    replies: (comment.comments_preview ?? []).map(createCommentViewModel),
    ui: {
      replyOpen: false,
      replyContent: '',
      replyLoading: false,
      likeLoading: false,
    },
  }
}

function createPostViewModel(post: BlogPost): BlogPostViewModel {
  return {
    ...post,
    comments: (post.comments_preview ?? []).map(createCommentViewModel),
    ui: {
      commentsVisible: false,
      commentsLoaded: false,
      commentsLoading: false,
      commentsError: null,
      commentContent: '',
      commentLoading: false,
      likeLoading: false,
      deleteLoading: false,
      editDialog: false,
      editForm: {
        title: post.title,
        summary: post.summary ?? '',
        content: post.content ?? '',
        loading: false,
      },
    },
  }
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AuthenticationRequiredError) {
    return t('blog.errors.authenticationRequired')
  }

  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    typeof (error as { data?: Record<string, unknown> }).data === 'object'
  ) {
    const data = (error as { data?: Record<string, unknown> }).data
    if (data && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

async function loadPosts(
  pageNumber: number,
  { replace = false }: { replace?: boolean } = {},
) {
  const requestId = ++activeRequest
  postsError.value = null

  if (pageNumber === 1 && replace) {
    isInitialLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await fetchPosts(pageNumber, pagination.limit)
    if (requestId !== activeRequest) return

    const mapped = response.data.map(createPostViewModel)

    if (replace) {
      posts.value = mapped
    } else {
      const existingIds = new Set(posts.value.map((post) => post.id))
      const merged = mapped.filter((post) => !existingIds.has(post.id))
      posts.value = [...posts.value, ...merged]
    }

    pagination.page = response.page
    pagination.limit = response.limit
    pagination.total = response.count
  } catch (error) {
    const message = extractErrorMessage(error, t('blog.alerts.loadFailed'))
    if (pageNumber === 1 && replace) {
      postsError.value = message
    } else {
      Notify.error(message)
    }
  } finally {
    if (pageNumber === 1 && replace) {
      isInitialLoading.value = false
    } else {
      isLoadingMore.value = false
    }
  }
}

async function refreshPosts() {
  posts.value = []
  pagination.page = 1
  pagination.total = 0
  await loadPosts(1, { replace: true })
}

async function loadMorePosts() {
  if (isInitialLoading.value || isLoadingMore.value || !hasMore.value) return
  await loadPosts(pagination.page + 1)
}

function ensureAuthenticated(showNotification = true) {
  if (!loggedIn.value) {
    if (showNotification) {
      Notify.warning(t('blog.errors.authenticationRequired'))
    }
    return false
  }

  return true
}

async function loadComments(post: BlogPostViewModel) {
  if (!ensureAuthenticated(false)) {
    post.ui.commentsError = t('blog.errors.authenticationRequired')
    post.ui.commentsLoaded = false
    return
  }

  if (post.ui.commentsLoading) return

  post.ui.commentsLoading = true
  post.ui.commentsError = null

  try {
    const allComments: BlogCommentViewModel[] = []
    let page = 1
    const limit = 25

    while (true) {
      const response = await fetchComments(post.id, page, limit)
      const mapped = response.data.map(createCommentViewModel)
      allComments.push(...mapped)

      const loaded = page * response.limit
      if (loaded >= response.count || mapped.length < response.limit) {
        break
      }

      page += 1
    }

    post.comments = allComments
    post.ui.commentsLoaded = true
  } catch (error) {
    post.ui.commentsError = extractErrorMessage(
      error,
      t('blog.errors.loadCommentsFailed'),
    )
  } finally {
    post.ui.commentsLoading = false
  }
}

function getAuthorName(user: BlogPostUser) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  if (user.firstName) {
    return user.firstName
  }

  return user.username
}

const getAuthorAvatar = (user: BlogPostUser) => user.photo || undefined

const formatPublishedAt = (publishedAt: string) =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(publishedAt))

function canEditPost(post: BlogPostViewModel) {
  return loggedIn.value && post.user.username === currentUsername.value
}

function openEditDialog(post: BlogPostViewModel) {
  post.ui.editForm.title = post.title
  post.ui.editForm.summary = post.summary ?? ''
  post.ui.editForm.content = post.content ?? ''
  post.ui.editDialog = true
}

async function submitEdit(post: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  const form = post.ui.editForm
  const title = form.title.trim()

  if (!title) {
    Notify.warning(t('blog.errors.updateFailed'))
    return
  }

  form.loading = true
  try {
    const summary = form.summary.trim()
    const content = form.content.trim()

    const updated = await updatePost(post.id, {
      title,
      summary: summary.length ? summary : null,
      content: content.length ? content : null,
    })

    if (updated && typeof updated === 'object') {
      if ('title' in updated && typeof updated.title === 'string') {
        post.title = updated.title
      } else {
        post.title = title
      }

      if ('summary' in updated) {
        post.summary = (updated as BlogPost).summary ?? null
      } else {
        post.summary = summary.length ? summary : null
      }

      if ('content' in updated) {
        post.content = (updated as BlogPost).content ?? null
      } else {
        post.content = content.length ? content : null
      }
    } else {
      post.title = title
      post.summary = summary.length ? summary : null
      post.content = content.length ? content : null
    }

    post.ui.editDialog = false
    Notify.success(t('blog.notifications.postUpdated'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.updateFailed')))
  } finally {
    form.loading = false
  }
}

async function confirmDeletePost(post: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  if (import.meta.client) {
    const confirmation = window.confirm(t('blog.dialogs.deleteConfirm'))
    if (!confirmation) {
      return
    }
  }

  post.ui.deleteLoading = true
  try {
    await deletePost(post.id)
    posts.value = posts.value.filter((item) => item.id !== post.id)
    pagination.total = Math.max(pagination.total - 1, 0)
    Notify.success(t('blog.notifications.postDeleted'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.deleteFailed')))
  } finally {
    post.ui.deleteLoading = false
  }
}

async function togglePostReaction(post: BlogPostViewModel) {
  if (!ensureAuthenticated()) return
  if (post.ui.likeLoading) return

  post.ui.likeLoading = true
  try {
    if (post.isReacted) {
      await dislikePost(post.id)
      post.isReacted = null
      post.reactions_count = Math.max((post.reactions_count ?? 1) - 1, 0)
      Notify.info(t('blog.notifications.postUnliked'))
    } else {
      await likePost(post.id)
      post.isReacted = 'like'
      post.reactions_count = (post.reactions_count ?? 0) + 1
      Notify.success(t('blog.notifications.postLiked'))
    }
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.likeFailed')))
  } finally {
    post.ui.likeLoading = false
  }
}

async function toggleCommentReaction(
  post: BlogPostViewModel,
  comment: BlogCommentViewModel,
) {
  if (!ensureAuthenticated()) return
  if (comment.ui.likeLoading) return

  comment.ui.likeLoading = true
  try {
    if (comment.isReacted) {
      await dislikeComment(comment.id)
      comment.isReacted = null
      comment.reactions_count = Math.max(
        (comment.reactions_count ?? comment.likes_count ?? 1) - 1,
        0,
      )
      Notify.info(t('blog.notifications.commentUnliked'))
    } else {
      await likeComment(comment.id)
      comment.isReacted = 'like'
      comment.reactions_count = (comment.reactions_count ?? 0) + 1
      Notify.success(t('blog.notifications.commentLiked'))
    }
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.likeFailed')))
  } finally {
    comment.ui.likeLoading = false
  }
}

async function submitPostComment(post: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  const content = post.ui.commentContent.trim()
  if (!content) return

  post.ui.commentLoading = true
  try {
    await createComment(post.id, { content })
    post.ui.commentContent = ''
    post.totalComments = (post.totalComments ?? 0) + 1
    await loadComments(post)
    post.ui.commentsVisible = true
    Notify.success(t('blog.notifications.commentCreated'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.commentFailed')))
  } finally {
    post.ui.commentLoading = false
  }
}

async function submitCommentReply(
  post: BlogPostViewModel,
  comment: BlogCommentViewModel,
) {
  if (!ensureAuthenticated()) return

  const content = comment.ui.replyContent.trim()
  if (!content) return

  comment.ui.replyLoading = true
  try {
    await replyToComment(comment.id, { content })
    comment.ui.replyContent = ''
    comment.ui.replyOpen = false
    comment.totalComments = (comment.totalComments ?? 0) + 1
    await loadComments(post)
    Notify.success(t('blog.notifications.replyCreated'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.commentFailed')))
  } finally {
    comment.ui.replyLoading = false
  }
}

function toggleCommentsVisibility(post: BlogPostViewModel) {
  post.ui.commentsVisible = !post.ui.commentsVisible

  if (post.ui.commentsVisible && !post.ui.commentsLoaded && loggedIn.value) {
    void loadComments(post)
  }
}

watch(
  () => loggedIn.value,
  (value) => {
    if (value === previousLoggedIn) return
    previousLoggedIn = value
    void refreshPosts()
  },
)

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
</script>

<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12" md="10" lg="8">
        <v-sheet class="pa-6" elevation="0" rounded="xl" color="transparent">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 text-h3-md font-weight-bold mb-1">
                {{ t('blog.title') }}
              </h1>
              <p class="text-medium-emphasis mb-0">
                {{ t('blog.description') }}
              </p>
            </div>
            <v-btn
              variant="tonal"
              color="primary"
              prepend-icon="mdi-refresh"
              :loading="isInitialLoading"
              @click="refreshPosts"
            >
              {{ t('blog.actions.refresh') }}
            </v-btn>
          </div>

          <v-alert
            v-if="postsError"
            type="error"
            variant="tonal"
            class="mb-6"
            border="start"
            prominent
          >
            {{ postsError }}
          </v-alert>

          <v-row v-if="isInitialLoading">
            <v-col v-for="index in 3" :key="index" cols="12" class="pb-6">
              <v-skeleton-loader
                type="heading, paragraph, actions"
                elevation="2"
                class="rounded-xl"
              />
            </v-col>
          </v-row>

          <template v-else>
            <v-row v-if="posts.length">
              <v-col
                v-for="post in posts"
                :key="post.id"
                cols="12"
                class="pb-6"
              >
                <v-card class="rounded-xl" elevation="2">
                  <v-card-item>
                    <template #prepend>
                      <v-avatar size="48">
                        <v-img
                          :src="getAuthorAvatar(post.user)"
                          :alt="getAuthorName(post.user)"
                        >
                          <template #error>
                            <v-icon icon="mdi-account-circle" size="48" />
                          </template>
                        </v-img>
                      </v-avatar>
                    </template>
                    <v-card-title class="text-h5 text-wrap">
                      {{ post.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-body-2 text-medium-emphasis">
                      {{
                        t('blog.meta.author', {
                          author: getAuthorName(post.user),
                          date: formatPublishedAt(post.publishedAt),
                        })
                      }}
                    </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{ post.summary || t('blog.placeholders.noSummary') }}
                    </p>
                    <v-divider class="mb-4" />
                    <div class="d-flex flex-wrap align-center">
                      <div class="d-flex align-center text-medium-emphasis mr-6 mb-2">
                        <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
                        {{
                          t('blog.stats.reactions', {
                            count: post.reactions_count ?? 0,
                          })
                        }}
                      </div>
                      <div class="d-flex align-center text-medium-emphasis mr-6 mb-2">
                        <v-icon icon="mdi-comment-text-outline" class="mr-1" />
                        {{
                          t('blog.stats.comments', {
                            count: post.totalComments ?? 0,
                          })
                        }}
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions class="pt-0 pb-4 px-4 flex-wrap">
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
                    <v-btn
                      variant="text"
                      color="primary"
                      :loading="post.ui.likeLoading"
                      @click="togglePostReaction(post)"
                    >
                      <v-icon
                        :icon="post.isReacted ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
                        class="mr-2"
                      />
                      {{
                        post.isReacted
                          ? t('blog.actions.unlike')
                          : t('blog.actions.like')
                      }}
                    </v-btn>
                    <v-btn
                      variant="text"
                      color="primary"
                      :loading="post.ui.commentsLoading"
                      @click="toggleCommentsVisibility(post)"
                    >
                      <v-icon
                        :icon="post.ui.commentsVisible
                          ? 'mdi-comment-off-outline'
                          : 'mdi-comment-text-outline'"
                        class="mr-2"
                      />
                      {{
                        post.ui.commentsVisible
                          ? t('blog.actions.hideComments')
                          : t('blog.actions.showComments')
                      }}
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      v-if="canEditPost(post)"
                      variant="text"
                      color="primary"
                      prepend-icon="mdi-pencil"
                      @click="openEditDialog(post)"
                    >
                      {{ t('common.actions.edit') }}
                    </v-btn>
                    <v-btn
                      v-if="canEditPost(post)"
                      variant="text"
                      color="error"
                      prepend-icon="mdi-delete"
                      :loading="post.ui.deleteLoading"
                      @click="confirmDeletePost(post)"
                    >
                      {{ t('common.actions.delete') }}
                    </v-btn>
                  </v-card-actions>

                  <v-expand-transition>
                    <div v-if="post.ui.commentsVisible" class="px-4 pb-4">
                      <v-alert
                        v-if="!loggedIn"
                        type="info"
                        variant="tonal"
                        class="mb-4"
                        density="comfortable"
                      >
                        {{ t('blog.prompts.loginToComment') }}
                      </v-alert>

                      <v-alert
                        v-if="post.ui.commentsError"
                        type="error"
                        variant="tonal"
                        class="mb-4"
                        density="comfortable"
                      >
                        {{ post.ui.commentsError }}
                      </v-alert>

                      <div v-if="loggedIn" class="mb-4">
                        <v-textarea
                          v-model="post.ui.commentContent"
                          :label="t('blog.forms.commentPlaceholder')"
                          auto-grow
                          rows="2"
                          variant="outlined"
                          :disabled="post.ui.commentLoading"
                        />
                        <div class="d-flex justify-end mt-2">
                          <v-btn
                            color="primary"
                            :loading="post.ui.commentLoading"
                            :disabled="
                              post.ui.commentLoading ||
                              !post.ui.commentContent.trim().length
                            "
                            @click="submitPostComment(post)"
                          >
                            {{ t('blog.actions.addComment') }}
                          </v-btn>
                        </div>
                      </div>

                      <BlogCommentThread
                        v-if="post.comments.length"
                        :comments="post.comments"
                        :format-author="getAuthorName"
                        :format-date="formatPublishedAt"
                        :can-interact="loggedIn"
                        @toggle-like="(comment) =>
                          toggleCommentReaction(post, comment)"
                        @submit-reply="(comment) =>
                          submitCommentReply(post, comment)"
                      />

                      <v-sheet
                        v-else
                        class="py-8 px-4 text-center rounded-lg"
                        variant="tonal"
                        color="surface"
                      >
                        <v-icon icon="mdi-comment-outline" size="48" class="mb-3" />
                        <h3 class="text-h6 mb-1">
                          {{ t('blog.emptyComments.title') }}
                        </h3>
                        <p class="text-body-2 mb-0 text-medium-emphasis">
                          {{ t('blog.emptyComments.description') }}
                        </p>
                      </v-sheet>
                    </div>
                  </v-expand-transition>

                  <v-dialog
                    v-model="post.ui.editDialog"
                    max-width="640"
                    persistent
                  >
                    <v-card>
                      <v-card-title>{{ t('blog.dialogs.editTitle') }}</v-card-title>
                      <v-card-text>
                        <v-text-field
                          v-model="post.ui.editForm.title"
                          :label="t('blog.forms.edit.title')"
                          :disabled="post.ui.editForm.loading"
                          required
                        />
                        <v-text-field
                          v-model="post.ui.editForm.summary"
                          :label="t('blog.forms.edit.summary')"
                          :disabled="post.ui.editForm.loading"
                        />
                        <v-textarea
                          v-model="post.ui.editForm.content"
                          :label="t('blog.forms.edit.content')"
                          :disabled="post.ui.editForm.loading"
                          rows="6"
                          auto-grow
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          variant="text"
                          :disabled="post.ui.editForm.loading"
                          @click="post.ui.editDialog = false"
                        >
                          {{ t('common.actions.cancel') }}
                        </v-btn>
                        <v-btn
                          color="primary"
                          :loading="post.ui.editForm.loading"
                          :disabled="!post.ui.editForm.title.trim().length"
                          @click="submitEdit(post)"
                        >
                          {{ t('common.actions.save') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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

          <div v-show="hasMore" ref="loadMoreTrigger" class="blog-infinite-trigger" />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.blog-infinite-trigger {
  height: 1px;
}

.blog-comment-thread__reply {
  margin-left: 32px;
}
</style>
