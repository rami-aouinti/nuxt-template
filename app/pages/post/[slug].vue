<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BlogPostCard from '~/components/Blog/PostCard.vue'
import BlogReactionsDialog from '~/components/Blog/ReactionsDialog.vue'
import AppAvatar from '~/components/AppAvatar.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppModal from '~/components/ui/AppModal.vue'
import {
  AuthenticationRequiredError,
  useBlogApi,
} from '~/composables/useBlogApi'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import type {
  BlogComment,
  BlogCommentViewModel,
  BlogPost,
  BlogPostSharePayload,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionPreview,
  BlogReactionType,
  BlogSummary,
} from '~/types/blog'
import type { PublicProfileData } from '~/types/profile'
import { Notify } from '~/stores/notification'
import { resolveReactionType } from '~/utils/reactions'
import {
  createPostViewModel,
  createCommentViewModel,
  normalizeReaction,
  normalizeReactionsPreview,
} from '~/utils/blog/posts'
import {
  formatPublishedAt as formatBlogPublishedAt,
  formatRelativePublishedAt as formatBlogRelativePublishedAt,
  truncateText,
} from '~/utils/formatters'

definePageMeta({
  icon: 'mdi-post-outline',
  title: 'Blog Post',
  drawerIndex: 1,
})

const route = useRoute()
const { t, locale } = useI18n()
const { session, loggedIn } = useUserSession()

const currentUsername = computed(
  () => session.value?.user?.login || session.value?.profile?.username || null,
)

const POST_EXCERPT_MAX_LENGTH = 150

const currentProfile = computed<PublicProfileData | null>(() => {
  const profile = session.value?.profile
  return profile && typeof profile === 'object'
    ? (profile as PublicProfileData)
    : null
})

const currentSessionUser = computed(
  () =>
    (
      session.value as {
        user?: {
          login?: string | null
          avatar_url?: string | null
          email?: string | null
        }
      } | null
    )?.user ?? null,
)

const currentUserDisplayName = computed(() => {
  const profile = currentProfile.value
  if (profile) {
    const firstName =
      typeof profile.firstName === 'string' ? profile.firstName.trim() : ''
    const lastName =
      typeof profile.lastName === 'string' ? profile.lastName.trim() : ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
    if (fullName.length) {
      return fullName
    }

    const username =
      typeof profile.username === 'string' ? profile.username.trim() : ''
    if (username.length) {
      return username
    }
  }

  const login =
    typeof currentSessionUser.value?.login === 'string'
      ? currentSessionUser.value.login.trim()
      : ''

  if (login.length) {
    return login
  }

  return t('auth.guest')
})

const currentUserAvatar = computed(() => {
  const profilePhoto =
    typeof currentProfile.value?.photo === 'string'
      ? currentProfile.value.photo
      : ''

  if (profilePhoto?.length) {
    return profilePhoto
  }

  const avatar =
    typeof currentSessionUser.value?.avatar_url === 'string'
      ? currentSessionUser.value.avatar_url
      : ''

  return avatar?.length ? avatar : undefined
})

const currentUserId = computed(() => {
  const sessionValue = session.value
  if (!sessionValue || typeof sessionValue !== 'object') {
    return null
  }

  const profile = (sessionValue as { profile?: { id?: string | null } }).profile
  if (profile && typeof profile === 'object') {
    const id = (profile as { id?: string | null }).id
    if (typeof id === 'string' && id.trim().length > 0) {
      return id
    }
  }

  const user = (sessionValue as { user?: { id?: string | null } }).user
  if (user && typeof user === 'object') {
    const id = (user as { id?: string | null }).id
    if (typeof id === 'string' && id.trim().length > 0) {
      return id
    }
  }

  return null
})

const currentUserReactionUser = computed<BlogPostUser | null>(() => {
  const id = currentUserId.value
  if (!id) {
    return null
  }

  const profile = currentProfile.value
  if (profile) {
    const firstName =
      typeof profile.firstName === 'string' ? profile.firstName : undefined
    const lastName =
      typeof profile.lastName === 'string' ? profile.lastName : undefined
    const username =
      typeof profile.username === 'string' && profile.username.trim().length
        ? profile.username
        : (currentUsername.value ?? undefined)

    return {
      id,
      firstName,
      lastName,
      username: username ?? t('auth.guest'),
      email:
        typeof profile.email === 'string' && profile.email.trim().length
          ? profile.email
          : undefined,
      photo: currentUserAvatar.value,
    }
  }

  const sessionUser = currentSessionUser.value
  const username =
    (typeof currentUsername.value === 'string' && currentUsername.value.length
      ? currentUsername.value
      : null) ??
    (typeof sessionUser?.login === 'string' && sessionUser.login.length
      ? sessionUser.login
      : null)

  return {
    id,
    username: username ?? t('auth.guest'),
    email:
      typeof sessionUser?.email === 'string' && sessionUser.email.trim().length
        ? sessionUser.email
        : undefined,
    photo: currentUserAvatar.value,
  }
})

const { getAuthorName, getAuthorAvatar } = useBlogAuthor()

const {
  fetchPostBySlug,
  fetchComments,
  createComment,
  replyToComment,
  reactToPost,
  removePostReaction,
  reactToComment,
  removeCommentReaction,
  updatePost,
  deletePost,
  sharePost: sharePostRequest,
} = useBlogApi()

const post = ref<BlogPostViewModel | null>(null)
const isLoading = ref(false)
const postError = ref<string | null>(null)

const reactionsDialog = reactive({
  open: false,
  items: [] as BlogReactionPreview[],
})

const shareDialog = reactive({
  open: false,
  post: null as BlogPostViewModel | null,
  message: '',
  loading: false,
})

const slug = computed(() => {
  const value = route.params.slug
  return typeof value === 'string'
    ? value
    : Array.isArray(value)
      ? (value[0] ?? '')
      : ''
})
const buildCommentViewModel = (comment: BlogComment) =>
  createCommentViewModel(comment, { currentUserId: currentUserId.value })

const buildPostViewModel = (postValue: BlogPost) =>
  createPostViewModel(postValue, {
    currentUserId: currentUserId.value,
    commentsVisible: true,
  })

function resolveBlogLink(blog: BlogSummary | null | undefined) {
  if (!blog) {
    return null
  }

  const slugValue = typeof blog.slug === 'string' ? blog.slug.trim() : ''
  return slugValue.length ? `/blog/${slugValue}` : null
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

const formatPublishedAt = (publishedAt: string) =>
  formatBlogPublishedAt(publishedAt, locale.value)

const formatRelativePublishedAt = (publishedAt: string) =>
  formatBlogRelativePublishedAt(publishedAt, locale.value)

function ensureAuthenticated(showNotification = true) {
  if (!loggedIn.value) {
    if (showNotification) {
      Notify.warning(t('blog.errors.authenticationRequired'))
    }
    return false
  }

  return true
}

async function loadComments(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated(false)) {
    postValue.ui.commentsError = t('blog.errors.authenticationRequired')
    postValue.ui.commentsLoaded = false
    return
  }

  if (postValue.ui.commentsLoading) return

  postValue.ui.commentsLoading = true
  postValue.ui.commentsError = null

  try {
    const allComments: BlogCommentViewModel[] = []
    let page = 1
    const limit = 25

    while (true) {
      const response = await fetchComments(postValue.id, page, limit)
      const mapped = response.data.map(buildCommentViewModel)
      allComments.push(...mapped)

      const loaded = page * response.limit
      if (loaded >= response.count || mapped.length < response.limit) {
        break
      }

      page += 1
    }

    postValue.comments = allComments
    postValue.ui.commentsLoaded = true
  } catch (error) {
    postValue.ui.commentsError = extractErrorMessage(
      error,
      t('blog.errors.loadCommentsFailed'),
    )
  } finally {
    postValue.ui.commentsLoading = false
  }
}

async function submitPostComment(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  const content = postValue.ui.commentContent.trim()
  if (!content) return

  postValue.ui.commentLoading = true
  try {
    await createComment(postValue.id, { content })
    postValue.ui.commentContent = ''
    postValue.totalComments = (postValue.totalComments ?? 0) + 1
    await loadComments(postValue)
    Notify.success(t('blog.notifications.commentCreated'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.commentFailed')))
  } finally {
    postValue.ui.commentLoading = false
  }
}

async function submitCommentReply(
  postValue: BlogPostViewModel,
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
    await loadComments(postValue)
    Notify.success(t('blog.notifications.replyCreated'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.commentFailed')))
  } finally {
    comment.ui.replyLoading = false
  }
}

async function applyPostReaction(
  postValue: BlogPostViewModel,
  type: BlogReactionType,
) {
  if (!ensureAuthenticated()) return
  if (postValue.ui.likeLoading) return

  const previousReaction = resolveReactionType(postValue.isReacted ?? null)
  const sanitizedPreview = normalizeReactionsPreview(
    postValue.reactions_preview,
  )

  postValue.ui.likeLoading = true
  try {
    await reactToPost(postValue.id, type)
    postValue.isReacted = type

    if (!previousReaction) {
      postValue.reactions_count = (postValue.reactions_count ?? 0) + 1
    }

    const currentUser = currentUserReactionUser.value
    if (currentUser) {
      const filtered = sanitizedPreview.filter(
        (reaction) => reaction.user.id !== currentUser.id,
      )
      const normalizedReaction = normalizeReaction({
        id: `${postValue.id}-${currentUser.id}`,
        type,
        user: currentUser,
      } as BlogReactionPreview)

      postValue.reactions_preview = normalizedReaction
        ? [normalizedReaction, ...filtered]
        : filtered
    } else {
      postValue.reactions_preview = sanitizedPreview
    }

    Notify.success(t('blog.notifications.postLiked'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    postValue.ui.likeLoading = false
  }
}

async function removePostReactionFromPost(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated()) return
  if (postValue.ui.likeLoading) return

  const currentType = resolveReactionType(postValue.isReacted ?? null)
  if (!currentType) {
    return
  }

  const sanitizedPreview = normalizeReactionsPreview(
    postValue.reactions_preview,
  )

  postValue.ui.likeLoading = true
  try {
    await removePostReaction(postValue.id)
    postValue.isReacted = null
    postValue.reactions_count = Math.max(
      (postValue.reactions_count ?? 1) - 1,
      0,
    )

    const currentId = currentUserId.value
    postValue.reactions_preview = currentId
      ? sanitizedPreview.filter((reaction) => reaction.user.id !== currentId)
      : sanitizedPreview

    Notify.info(t('blog.notifications.postUnliked'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    postValue.ui.likeLoading = false
  }
}

async function applyCommentReaction(
  _postValue: BlogPostViewModel,
  comment: BlogCommentViewModel,
  type: BlogReactionType,
) {
  if (!ensureAuthenticated()) return
  if (comment.ui.likeLoading) return

  const previousReaction = resolveReactionType(comment.isReacted ?? null)
  const sanitizedPreview = normalizeReactionsPreview(comment.reactions_preview)

  comment.ui.likeLoading = true
  try {
    await reactToComment(comment.id, type)
    comment.isReacted = type

    const previousCount =
      typeof comment.reactions_count === 'number'
        ? comment.reactions_count
        : typeof comment.likes_count === 'number'
          ? comment.likes_count
          : 0

    comment.reactions_count = previousReaction
      ? previousCount
      : previousCount + 1
    comment.likes_count = comment.reactions_count

    const currentUser = currentUserReactionUser.value
    if (currentUser) {
      const filtered = sanitizedPreview.filter(
        (reaction) => reaction.user.id !== currentUser.id,
      )
      const normalizedReaction = normalizeReaction({
        id: `${comment.id}-${currentUser.id}`,
        type,
        user: currentUser,
      } as BlogReactionPreview)

      comment.reactions_preview = normalizedReaction
        ? [normalizedReaction, ...filtered]
        : filtered
    } else {
      comment.reactions_preview = sanitizedPreview
    }

    Notify.success(t('blog.notifications.commentLiked'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    comment.ui.likeLoading = false
  }
}

async function removeCommentReactionFromComment(
  _postValue: BlogPostViewModel,
  comment: BlogCommentViewModel,
) {
  if (!ensureAuthenticated()) return
  if (comment.ui.likeLoading) return

  const currentType = resolveReactionType(comment.isReacted ?? null)
  if (!currentType) {
    return
  }

  const sanitizedPreview = normalizeReactionsPreview(comment.reactions_preview)

  comment.ui.likeLoading = true
  try {
    await removeCommentReaction(comment.id)
    const previousCount =
      typeof comment.reactions_count === 'number'
        ? comment.reactions_count
        : typeof comment.likes_count === 'number'
          ? comment.likes_count
          : 0
    const nextCount = Math.max(previousCount - 1, 0)

    comment.isReacted = null
    comment.reactions_count = nextCount
    comment.likes_count = nextCount

    const currentId = currentUserId.value
    comment.reactions_preview = currentId
      ? sanitizedPreview.filter((reaction) => reaction.user.id !== currentId)
      : sanitizedPreview

    Notify.info(t('blog.notifications.commentUnliked'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    comment.ui.likeLoading = false
  }
}

function toggleCommentsVisibility(postValue: BlogPostViewModel) {
  postValue.ui.commentsVisible = !postValue.ui.commentsVisible

  if (
    postValue.ui.commentsVisible &&
    !postValue.ui.commentsLoaded &&
    loggedIn.value
  ) {
    void loadComments(postValue)
  }
}

function openPostReactions(postValue: BlogPostViewModel) {
  reactionsDialog.items = normalizeReactionsPreview(postValue.reactions_preview)
  reactionsDialog.open = true
}

function canEditPost(postValue: BlogPostViewModel) {
  return loggedIn.value && postValue.user.username === currentUsername.value
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

function getPostExcerpt(postValue: BlogPostViewModel) {
  const summary =
    typeof postValue.summary === 'string' ? postValue.summary.trim() : ''
  if (summary.length) {
    return truncateText(summary, POST_EXCERPT_MAX_LENGTH)
  }

  const content = getPostPlainContent(postValue.content)
  if (content.length) {
    return truncateText(content, POST_EXCERPT_MAX_LENGTH)
  }

  return ''
}

function openEditDialog(postValue: BlogPostViewModel) {
  postValue.ui.editForm.title = postValue.title
  postValue.ui.editForm.summary = postValue.summary ?? ''
  postValue.ui.editForm.content = postValue.content ?? ''
  postValue.ui.editDialog = true
}

async function submitEdit(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  const form = postValue.ui.editForm
  const title = form.title.trim()

  if (!title) {
    Notify.warning(t('blog.errors.updateFailed'))
    return
  }

  form.loading = true
  try {
    const summary = form.summary.trim()
    const content = form.content.trim()

    const updated = await updatePost(postValue.id, {
      title,
      summary: summary.length ? summary : null,
      content: content.length ? content : null,
    })

    if (updated && typeof updated === 'object') {
      if ('title' in updated && typeof updated.title === 'string') {
        postValue.title = updated.title
      } else {
        postValue.title = title
      }

      if ('summary' in updated) {
        postValue.summary = (updated as BlogPost).summary ?? null
      } else {
        postValue.summary = summary.length ? summary : null
      }

      if ('content' in updated) {
        postValue.content = (updated as BlogPost).content ?? null
      } else {
        postValue.content = content.length ? content : null
      }
    } else {
      postValue.title = title
      postValue.summary = summary.length ? summary : null
      postValue.content = content.length ? content : null
    }

    postValue.ui.editDialog = false
    Notify.success(t('blog.notifications.postUpdated'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.updateFailed')))
  } finally {
    form.loading = false
  }
}

async function confirmDeletePost(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  if (!import.meta.client) {
    return
  }

  const confirmation = window.confirm(t('blog.dialogs.deleteConfirm'))
  if (!confirmation) {
    return
  }

  postValue.ui.deleteLoading = true
  try {
    await deletePost(postValue.id)
    post.value = null
    postError.value = t('blog.notifications.postDeleted')
    Notify.success(t('blog.notifications.postDeleted'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.deleteFailed')))
  } finally {
    postValue.ui.deleteLoading = false
  }
}

function openShareDialog(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated()) {
    return
  }

  shareDialog.post = postValue
  shareDialog.message = ''
  shareDialog.open = true
}

function closeShareDialog() {
  if (shareDialog.loading) {
    return
  }

  shareDialog.open = false
}

async function submitShare() {
  if (!ensureAuthenticated()) return

  const postToShare = shareDialog.post
  if (!postToShare || shareDialog.loading) return

  const postId = postToShare.id
  if (!postId) {
    Notify.error(t('blog.errors.shareFailed'))
    return
  }

  const message = shareDialog.message.trim()
  const payload: BlogPostSharePayload = message.length
    ? { content: message }
    : {}

  shareDialog.loading = true
  try {
    await sharePostRequest(postId, payload)
    Notify.success(t('blog.notifications.postShared'))
    shareDialog.open = false
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.shareFailed')))
  } finally {
    shareDialog.loading = false
  }
}

async function loadPost(slugValue: string) {
  const normalized = slugValue.trim()
  if (!normalized) {
    postError.value = t('blog.alerts.loadFailed')
    post.value = null
    return
  }

  isLoading.value = true
  postError.value = null

  try {
    const fetched = await fetchPostBySlug(normalized)
    const viewModel = buildPostViewModel(fetched)
    post.value = viewModel

    if (loggedIn.value) {
      await loadComments(viewModel)
    }
  } catch (error) {
    post.value = null
    postError.value = extractErrorMessage(error, t('blog.alerts.loadFailed'))
  } finally {
    isLoading.value = false
  }
}

await loadPost(slug.value)

watch(
  () => shareDialog.open,
  (open) => {
    if (!open) {
      shareDialog.post = null
      shareDialog.message = ''
      shareDialog.loading = false
    }
  },
)

watch(
  () => slug.value,
  (next, previous) => {
    if (next && next !== previous) {
      void loadPost(next)
    }
  },
)

watch(
  () => loggedIn.value,
  async (value, previous) => {
    if (!post.value) {
      return
    }

    if (value && !previous) {
      await loadComments(post.value)
    }

    if (!value) {
      post.value.comments = []
      post.value.ui.commentsLoaded = false
      post.value.ui.commentContent = ''
    }
  },
)
</script>

<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12">
        <v-alert
          v-if="postError"
          type="error"
          variant="tonal"
          border="start"
          prominent
          class="mb-4"
        >
          {{ postError }}
        </v-alert>

        <v-skeleton-loader
          v-if="isLoading"
          type="heading, paragraph, article"
          class="rounded-xl"
        />

        <BlogPostCard
          v-else-if="post"
          :post="post"
          :logged-in="loggedIn"
          :can-edit="canEditPost(post)"
          :excerpt="getPostExcerpt(post)"
          :format-relative-published-at="formatRelativePublishedAt"
          :format-published-at="formatPublishedAt"
          @request-edit="openEditDialog"
          @submit-edit="submitEdit"
          @delete="confirmDeletePost"
          @select-reaction="
            ({ post: cardPost, type }) => applyPostReaction(cardPost, type)
          "
          @remove-reaction="removePostReactionFromPost"
          @show-reactions="openPostReactions"
          @toggle-comments="toggleCommentsVisibility"
          @share="openShareDialog"
          @submit-comment="submitPostComment"
          @select-comment-reaction="
            ({ post: cardPost, comment, type }) =>
              applyCommentReaction(cardPost, comment, type)
          "
          @remove-comment-reaction="
            ({ post: cardPost, comment }) =>
              removeCommentReactionFromComment(cardPost, comment)
          "
          @submit-comment-reply="
            ({ post: cardPost, comment }) =>
              submitCommentReply(cardPost, comment)
          "
        />
      </v-col>
    </v-row>
    <BlogReactionsDialog
      v-model="reactionsDialog.open"
      :reactions="reactionsDialog.items"
    />
    <AppModal v-model="shareDialog.open" max-width="640">
      <AppCard class="share-dialog">
        <v-card-title class="d-flex align-center">
          <span>{{ t('blog.dialogs.shareTitle') }}</span>
          <v-spacer />
          <AppButton
            icon
            variant="text"
            :disabled="shareDialog.loading"
            @click="closeShareDialog"
          >
            <v-icon icon="mdi-close" />
          </AppButton>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div class="share-dialog__composer">
            <AppAvatar
              :src="currentUserAvatar"
              :alt="currentUserDisplayName"
              size="48"
              class="share-dialog__avatar"
            />
            <div>
              <div class="share-dialog__user-name">
                {{ currentUserDisplayName }}
              </div>
              <div class="share-dialog__audience">
                <v-icon icon="mdi-earth" size="16" class="mr-1" />
                {{ t('blog.dialogs.shareAudiencePublic') }}
              </div>
            </div>
          </div>
          <v-textarea
            v-model="shareDialog.message"
            :placeholder="t('blog.forms.sharePlaceholder')"
            rows="3"
            auto-grow
            variant="solo"
            bg-color="rgba(var(--v-theme-surface-variant), 0.35)"
            class="mt-4"
          />
          <div v-if="shareDialog.post" class="share-dialog__preview mt-4">
            <div class="share-dialog__preview-header">
              <AppAvatar
                :src="getAuthorAvatar(shareDialog.post.user)"
                :alt="getAuthorName(shareDialog.post.user)"
                size="40"
              />
              <div>
                <div class="share-dialog__preview-author">
                  {{ getAuthorName(shareDialog.post.user) }}
                </div>
                <div class="share-dialog__preview-meta">
                  {{ formatRelativePublishedAt(shareDialog.post.publishedAt) }}
                </div>
              </div>
            </div>
            <div class="share-dialog__preview-body">
              <div class="share-dialog__preview-title">
                {{ shareDialog.post.title }}
              </div>
              <p class="share-dialog__preview-text">
                {{
                  getPostExcerpt(shareDialog.post) ||
                  t('blog.placeholders.noSummary')
                }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <AppButton
            variant="text"
            :disabled="shareDialog.loading"
            @click="closeShareDialog"
          >
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="primary"
            :disabled="!shareDialog.post || shareDialog.loading"
            :loading="shareDialog.loading"
            @click="submitShare"
          >
            {{ t('common.actions.share') }}
          </AppButton>
        </v-card-actions>
      </AppCard>
    </AppModal>
  </v-container>
</template>

<style scoped>
.post-content {
  white-space: pre-line;
}

.share-dialog {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.share-dialog__composer {
  display: flex;
  gap: 16px;
  align-items: center;
}

.share-dialog__avatar {
  flex-shrink: 0;
}

.share-dialog__user-name {
  font-weight: 600;
  font-size: 1rem;
}

.share-dialog__audience {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.share-dialog__preview {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  background: rgba(var(--v-theme-surface-variant), 0.35);
  padding: 16px;
}

.share-dialog__preview-header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.share-dialog__preview-author {
  font-weight: 600;
}

.share-dialog__preview-meta {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.share-dialog__preview-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.share-dialog__preview-text {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
