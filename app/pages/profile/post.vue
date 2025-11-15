<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import BlogMyBlogsList from '~/components/Blog/MyBlogsList.vue'
import BlogPostCard from '~/components/Blog/PostCard.vue'
import BlogReactionsDialog from '~/components/Blog/ReactionsDialog.vue'
import AppAvatar from '~/components/AppAvatar.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppModal from '~/components/ui/AppModal.vue'
import {
  BLOG_POSTS_DEFAULT_LIMIT,
  AuthenticationRequiredError,
  useBlogApi,
} from '~/composables/useBlogApi'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import { useProfilePostsStore } from '~/stores/profile-posts'
import { Notify } from '~/stores/notification'
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
import {
  createPostViewModel,
  createCommentViewModel,
  normalizeReaction,
  normalizeReactionsPreview,
} from '~/utils/blog/posts'
import {
  truncateText,
  formatPublishedAt as formatBlogPublishedAt,
  formatRelativePublishedAt as formatBlogRelativePublishedAt,
} from '~/utils/formatters'

definePageMeta({
  title: 'navigation.profile',
  middleware: 'auth',
})

const { t, locale } = useI18n()
const {
  fetchProfilePosts,
  fetchUserBlogs,
  fetchComments,
  createComment,
  replyToComment,
  reactToPost,
  removePostReaction,
  reactToComment,
  removeCommentReaction,
  updateComment,
  deleteComment,
  updatePost,
  deletePost,
  sharePost: sharePostRequest,
} = useBlogApi()
const { session, loggedIn } = useAppUserSession()
const { getAuthorName, getAuthorAvatar } = useBlogAuthor()
const POST_EXCERPT_MAX_LENGTH = 150
const currentUsername = computed(
  () => session.value?.user?.login || session.value?.profile?.username || null,
)

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

const profilePostsStore = useProfilePostsStore()
const {
  posts: rawPosts,
  pagination,
  isInitialLoading,
  isLoadingMore,
  error: postsError,
} = storeToRefs(profilePostsStore)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const postViewModels = ref<BlogPostViewModel[]>([])
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

const myBlogs = ref<BlogSummary[]>([])
const myBlogsLoading = ref(false)
const myBlogsError = ref<string | null>(null)

const hasMore = computed(
  () =>
    rawPosts.value.length < pagination.value.total && rawPosts.value.length > 0,
)

let activeRequest = 0

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

function ensureAuthenticated(showNotification = true) {
  if (!loggedIn.value) {
    if (showNotification) {
      Notify.warning(t('blog.errors.authenticationRequired'))
    }
    return false
  }

  return true
}

function refreshPostViewModels() {
  const existing = new Map(postViewModels.value.map((post) => [post.id, post]))

  postViewModels.value = rawPosts.value.map((post) => {
    const previous = existing.get(post.id)
    const viewModel = createPostViewModel(post, {
      currentUserId: currentUserId.value,
      commentsVisible: previous?.ui.commentsVisible ?? false,
    })

    if (previous) {
      viewModel.comments = previous.ui.commentsLoaded
        ? previous.comments
        : viewModel.comments
      viewModel.ui = {
        ...viewModel.ui,
        commentsVisible: previous.ui.commentsVisible,
        commentsLoaded: previous.ui.commentsLoaded,
        commentsLoading: previous.ui.commentsLoading,
        commentsError: previous.ui.commentsError,
        commentContent: previous.ui.commentContent,
        commentLoading: previous.ui.commentLoading,
        likeLoading: previous.ui.likeLoading,
        deleteLoading: previous.ui.deleteLoading,
        editDialog: previous.ui.editDialog,
        editForm: {
          ...viewModel.ui.editForm,
          title: previous.ui.editForm.title,
          summary: previous.ui.editForm.summary,
          content: previous.ui.editForm.content,
          loading: previous.ui.editForm.loading,
        },
      }
    }

    return viewModel
  })
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
    const response = await fetchProfilePosts(
      pageNumber,
      pagination.value.limit || BLOG_POSTS_DEFAULT_LIMIT,
    )

    if (requestId !== activeRequest) {
      return
    }

    profilePostsStore.applyResponse(response, { replace })
    refreshPostViewModels()
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
    myBlogsError.value = extractErrorMessage(error, t('blog.alerts.loadFailed'))
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

const formatPublishedAt = (publishedAt: string) =>
  formatBlogPublishedAt(publishedAt, locale.value)

const formatRelativePublishedAt = (publishedAt: string) =>
  formatBlogRelativePublishedAt(publishedAt, locale.value)

const buildCommentViewModel = (comment: BlogComment) =>
  createCommentViewModel(comment, { currentUserId: currentUserId.value })

const buildPostViewModel = (post: BlogPost) =>
  createPostViewModel(post, { currentUserId: currentUserId.value })

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
    let total = 0

    while (true) {
      const response = await fetchComments(post.id, page, limit)
      const mapped = response.data.map(buildCommentViewModel)
      allComments.push(...mapped)
      total = response.count

      const loaded = page * response.limit
      if (loaded >= response.count || mapped.length < response.limit) {
        break
      }

      page += 1
    }

    post.comments = allComments
    post.totalComments = total || allComments.length
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

async function submitCommentEdit(
  post: BlogPostViewModel,
  comment: BlogCommentViewModel,
  content: string,
) {
  if (!ensureAuthenticated()) return

  const trimmed = content.trim()
  if (!trimmed.length) {
    Notify.warning(t('blog.errors.updateCommentFailed'))
    return
  }

  comment.ui.editLoading = true
  try {
    await updateComment(comment.id, { content: trimmed })
    comment.ui.editOpen = false
    Notify.success(t('blog.notifications.commentUpdated'))
    await loadComments(post)
  } catch (error) {
    Notify.error(
      extractErrorMessage(error, t('blog.errors.updateCommentFailed')),
    )
  } finally {
    comment.ui.editLoading = false
  }
}

async function deleteCommentFromPost(
  post: BlogPostViewModel,
  comment: BlogCommentViewModel,
) {
  if (!ensureAuthenticated()) return
  if (!import.meta.client) return

  const confirmed = window.confirm(t('blog.dialogs.deleteCommentConfirm'))
  if (!confirmed) {
    return
  }

  comment.ui.deleteLoading = true
  try {
    await deleteComment(comment.id)
    post.totalComments = Math.max((post.totalComments ?? 1) - 1, 0)
    Notify.success(t('blog.notifications.commentDeleted'))
    await loadComments(post)
  } catch (error) {
    Notify.error(
      extractErrorMessage(error, t('blog.errors.deleteCommentFailed')),
    )
  } finally {
    comment.ui.deleteLoading = false
  }
}

async function applyPostReaction(
  post: BlogPostViewModel,
  type: BlogReactionType,
) {
  if (!ensureAuthenticated()) return
  if (post.ui.likeLoading) return

  const previousReaction = resolveReactionType(post.isReacted ?? null)
  const sanitizedPreview = normalizeReactionsPreview(post.reactions_preview)

  post.ui.likeLoading = true
  try {
    await reactToPost(post.id, type)
    post.isReacted = type

    if (!previousReaction) {
      post.reactions_count = (post.reactions_count ?? 0) + 1
    }

    const currentUser = currentUserReactionUser.value
    if (currentUser) {
      const filtered = sanitizedPreview.filter(
        (reaction) => reaction.user.id !== currentUser.id,
      )
      const normalizedReaction = normalizeReaction({
        id: `${post.id}-${currentUser.id}`,
        type,
        user: currentUser,
      } as BlogReactionPreview)

      post.reactions_preview = normalizedReaction
        ? [normalizedReaction, ...filtered]
        : filtered
    } else {
      post.reactions_preview = sanitizedPreview
    }

    Notify.success(t('blog.notifications.postLiked'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    post.ui.likeLoading = false
  }
}

async function removePostReactionFromPost(post: BlogPostViewModel) {
  if (!ensureAuthenticated()) return
  if (post.ui.likeLoading) return

  const currentType = resolveReactionType(post.isReacted ?? null)
  if (!currentType) {
    return
  }

  const sanitizedPreview = normalizeReactionsPreview(post.reactions_preview)

  post.ui.likeLoading = true
  try {
    await removePostReaction(post.id)
    post.isReacted = null
    post.reactions_count = Math.max((post.reactions_count ?? 1) - 1, 0)

    const currentId = currentUserId.value
    post.reactions_preview = currentId
      ? sanitizedPreview.filter((reaction) => reaction.user.id !== currentId)
      : sanitizedPreview

    Notify.info(t('blog.notifications.postUnliked'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    post.ui.likeLoading = false
  }
}

async function applyCommentReaction(
  _post: BlogPostViewModel,
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
  _post: BlogPostViewModel,
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

function toggleCommentsVisibility(post: BlogPostViewModel) {
  post.ui.commentsVisible = !post.ui.commentsVisible

  if (post.ui.commentsVisible && !post.ui.commentsLoaded && loggedIn.value) {
    void loadComments(post)
  }
}

function openPostReactions(post: BlogPostViewModel) {
  reactionsDialog.items = normalizeReactionsPreview(post.reactions_preview)
  reactionsDialog.open = true
}

function canEditPost(post: BlogPostViewModel) {
  if (!loggedIn.value) {
    return false
  }

  const postUsername = post.user?.username
  const userUsername = currentUsername.value

  if (!postUsername || !userUsername) {
    return false
  }

  return postUsername === userUsername
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

  if (!import.meta.client) {
    return
  }

  const confirmation = window.confirm(t('blog.dialogs.deleteConfirm'))
  if (!confirmation) {
    return
  }

  post.ui.deleteLoading = true
  try {
    await deletePost(post.id)
    const remaining = rawPosts.value.filter((item) => item.id !== post.id)
    profilePostsStore.setPosts(remaining, { replace: true })
    pagination.value.total = Math.max(pagination.value.total - 1, 0)
    refreshPostViewModels()
    Notify.success(t('blog.notifications.postDeleted'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.deleteFailed')))
  } finally {
    post.ui.deleteLoading = false
  }
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

function openShareDialog(post: BlogPostViewModel) {
  if (!ensureAuthenticated()) {
    return
  }

  shareDialog.post = post
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
    const sharedPost = await sharePostRequest(postId, payload)
    const viewModel = buildPostViewModel(sharedPost)
    profilePostsStore.setPosts(
      [
        sharedPost,
        ...rawPosts.value.filter((item) => item.id !== viewModel.id),
      ],
      { replace: true },
    )
    refreshPostViewModels()
    Notify.success(t('blog.notifications.postShared'))
    shareDialog.open = false
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.shareFailed')))
  } finally {
    shareDialog.loading = false
  }
}

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
  () => rawPosts.value,
  () => {
    refreshPostViewModels()
  },
  { immediate: true },
)

watch(
  () => currentUserId.value,
  () => {
    refreshPostViewModels()
  },
)

watch(
  () => loggedIn.value,
  (value) => {
    if (value) {
      void Promise.all([loadPosts(1, { replace: true }), loadMyBlogs()])
    } else {
      profilePostsStore.reset()
      postViewModels.value = []
      pagination.value.limit = BLOG_POSTS_DEFAULT_LIMIT
      myBlogs.value = []
      myBlogsError.value = null
      myBlogsLoading.value = false
    }
  },
)
</script>

<template>
  <div class="profile-post-page">
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
            <v-row v-if="postViewModels.length">
              <v-col
                v-for="post in postViewModels"
                :key="post.id"
                cols="12"
                class="pb-6"
              >
                <BlogPostCard
                  :post="post"
                  :logged-in="loggedIn"
                  :can-edit="canEditPost(post)"
                  :excerpt="getPostExcerpt(post)"
                  :format-relative-published-at="formatRelativePublishedAt"
                  :format-published-at="formatPublishedAt"
                  :current-user-id="currentUserId"
                  @request-edit="openEditDialog"
                  @submit-edit="submitEdit"
                  @delete="confirmDeletePost"
                  @select-reaction="
                    ({ post: cardPost, type }) =>
                      applyPostReaction(cardPost, type)
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
                  @submit-comment-edit="
                    ({ post: cardPost, comment, content }) =>
                      submitCommentEdit(cardPost, comment, content)
                  "
                  @delete-comment="
                    ({ post: cardPost, comment }) =>
                      deleteCommentFromPost(cardPost, comment)
                  "
                />
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
    </ProfilePageShell>
    <BlogReactionsDialog
      v-model="reactionsDialog.open"
      :reactions="reactionsDialog.items"
    />
    <AppModal
      v-model="shareDialog.open"
      icon="mdi-share-variant"
      :title="t('blog.dialogs.shareTitle')"
      max-width="640"
      :close-disabled="shareDialog.loading"
      @close="closeShareDialog"
    >
      <div class="share-dialog">
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
                getPostExcerpt(shareDialog.post)
              }}
            </p>
          </div>
        </div>
      </div>
      <template #actions>
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
      </template>
    </AppModal>
  </div>
</template>

<style scoped src="~/assets/styles/pages/profile/post.css"></style>
