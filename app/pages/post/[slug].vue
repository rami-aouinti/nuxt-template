<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BlogCommentThread from '~/components/Blog/CommentThread.vue'
import BlogReactionsDialog from '~/components/Blog/ReactionsDialog.vue'
import {
  AuthenticationRequiredError,
  useBlogApi,
} from '~/composables/useBlogApi'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import type {
  BlogComment,
  BlogCommentViewModel,
  BlogPost,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionPreview,
  BlogReactionType,
  BlogSummary,
} from '~/types/blog'
import type { PublicProfileData } from '~/types/profile'
import { Notify } from '~/stores/notification'
import { DEFAULT_REACTION_TYPE, resolveReactionType } from '~/utils/reactions'
import { extractCommentLikes, extractCommentList } from '~/utils/blogComments'
import { formatPublishedAt as formatBlogPublishedAt } from '~/utils/formatters'

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

const { getAuthorName, getAuthorProfileLink } = useBlogAuthor()

const {
  fetchPostBySlug,
  fetchComments,
  createComment,
  replyToComment,
  reactToPost,
  removePostReaction,
  reactToComment,
  removeCommentReaction,
} = useBlogApi()

const post = ref<BlogPostViewModel | null>(null)
const isLoading = ref(false)
const postError = ref<string | null>(null)

const reactionsDialog = reactive({
  open: false,
  items: [] as BlogReactionPreview[],
})

const slug = computed(() => {
  const value = route.params.slug
  return typeof value === 'string'
    ? value
    : Array.isArray(value)
      ? (value[0] ?? '')
      : ''
})

function normalizeComment(comment: BlogComment): BlogComment {
  const likes = extractCommentLikes(comment.likes)

  const reactionsCount =
    typeof comment.reactions_count === 'number'
      ? comment.reactions_count
      : typeof comment.likes_count === 'number'
        ? comment.likes_count
        : likes.length

  const repliesPreview = extractCommentList(comment.comments_preview)
  const replies = repliesPreview.length
    ? repliesPreview
    : extractCommentList(comment.children)

  let isReacted: BlogComment['isReacted'] = resolveReactionType(
    comment.isReacted ?? null,
  )

  if (!isReacted && currentUserId.value) {
    const selfReaction = likes.find(
      (like) => like.user.id === currentUserId.value,
    )
    if (selfReaction) {
      isReacted =
        resolveReactionType(selfReaction.type ?? null) ?? DEFAULT_REACTION_TYPE
    }
  }

  const reactionsPreview: BlogReactionPreview[] =
    Array.isArray(comment.reactions_preview) && comment.reactions_preview.length
      ? comment.reactions_preview
      : likes
          .map((like) => {
            if (!like.user) {
              return null
            }

            return {
              id: like.id ?? `${comment.id}-${like.user.id}`,
              type:
                resolveReactionType(like.type ?? null) ?? DEFAULT_REACTION_TYPE,
              user: like.user,
            }
          })
          .filter((preview): preview is BlogReactionPreview => Boolean(preview))

  return {
    ...comment,
    reactions_count: reactionsCount,
    likes_count:
      typeof comment.likes_count === 'number'
        ? comment.likes_count
        : reactionsCount,
    isReacted,
    reactions_preview: reactionsPreview,
    comments_preview: replies,
  }
}

function createCommentViewModel(comment: BlogComment): BlogCommentViewModel {
  const normalized = normalizeComment(comment)

  return {
    ...normalized,
    replies: (normalized.comments_preview ?? []).map(createCommentViewModel),
    ui: {
      replyOpen: false,
      replyContent: '',
      replyLoading: false,
      likeLoading: false,
    },
  }
}

function resolvePostComments(postValue: BlogPost): BlogComment[] {
  const preview = extractCommentList(postValue.comments_preview)
  if (preview.length) {
    return preview
  }

  const withComments = postValue as BlogPost & { comments?: unknown }
  const comments = extractCommentList(withComments.comments)
  if (comments.length) {
    return comments
  }

  return []
}

function normalizeReaction(
  reaction: BlogReactionPreview | null | undefined,
): BlogReactionPreview | null {
  if (!reaction || typeof reaction !== 'object') {
    return null
  }

  const user = (reaction as { user?: BlogPostUser | null }).user
  if (!user || typeof user !== 'object') {
    return null
  }

  const id =
    typeof user.id === 'string' && user.id.trim().length ? user.id.trim() : null
  if (!id) {
    return null
  }

  const type =
    resolveReactionType(reaction.type ?? null) ?? DEFAULT_REACTION_TYPE

  const firstName =
    typeof user.firstName === 'string' && user.firstName.trim().length
      ? user.firstName
      : undefined
  const lastName =
    typeof user.lastName === 'string' && user.lastName.trim().length
      ? user.lastName
      : undefined
  const username =
    typeof user.username === 'string' && user.username.trim().length
      ? user.username.trim()
      : undefined
  const email =
    typeof user.email === 'string' && user.email.trim().length
      ? user.email.trim()
      : undefined
  const photo =
    typeof user.photo === 'string' && user.photo.trim().length
      ? user.photo
      : undefined

  return {
    id:
      typeof reaction.id === 'string' && reaction.id.trim().length
        ? reaction.id
        : `${id}-${type}`,
    type,
    user: {
      id,
      firstName,
      lastName,
      username: username ?? email ?? id,
      email,
      photo,
    },
  }
}

function normalizeReactionsPreview(
  reactions: BlogReactionPreview[] | null | undefined,
): BlogReactionPreview[] {
  if (!Array.isArray(reactions)) {
    return []
  }

  const normalized = reactions
    .map((reaction) => normalizeReaction(reaction))
    .filter((reaction): reaction is BlogReactionPreview => Boolean(reaction))

  const unique = new Map<string, BlogReactionPreview>()
  for (const reaction of normalized) {
    unique.set(reaction.user.id, reaction)
  }

  return Array.from(unique.values())
}

function createPostViewModel(postValue: BlogPost): BlogPostViewModel {
  const reactionsPreview = normalizeReactionsPreview(
    postValue.reactions_preview,
  )

  return {
    ...postValue,
    reactions_preview: reactionsPreview,
    comments: resolvePostComments(postValue).map(createCommentViewModel),
    ui: {
      commentsVisible: true,
      commentsLoaded: false,
      commentsLoading: false,
      commentsError: null,
      commentContent: '',
      commentLoading: false,
      likeLoading: false,
      deleteLoading: false,
      editDialog: false,
      editForm: {
        title: postValue.title,
        summary: postValue.summary ?? '',
        content: postValue.content ?? '',
        loading: false,
      },
    },
  }
}

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
      const mapped = response.data.map(createCommentViewModel)
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

function openPostReactions(postValue: BlogPostViewModel) {
  reactionsDialog.items = normalizeReactionsPreview(postValue.reactions_preview)
  reactionsDialog.open = true
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
    const viewModel = createPostViewModel(fetched)
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
      <v-col cols="12" lg="9" xl="8">
        <AppButton
          class="mb-4"
          color="primary"
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/blog"
        >
          {{ t('common.actions.back') }}
        </AppButton>

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

        <AppCard v-else-if="post" class="rounded-xl" elevation="2">
          <v-card-item>
            <BlogPostAuthor
              class="mb-3"
              :user="post.user"
              :published-at="post.publishedAt"
              :format-date="formatPublishedAt"
              :avatar-size="56"
            />
            <v-card-title class="text-h4 text-wrap">
              {{ post.title }}
            </v-card-title>
            <v-card-subtitle v-if="post.blog" class="d-flex align-center mt-1">
              <v-icon icon="mdi-rss" size="18" class="mr-1" />
              <NuxtLink
                v-if="resolveBlogLink(post.blog)"
                :to="resolveBlogLink(post.blog) || undefined"
                class="text-primary text-decoration-none"
              >
                {{ post.blog?.title }}
              </NuxtLink>
              <span v-else>{{ post.blog?.title }}</span>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="pt-0">
            <p v-if="post.summary" class="text-body-1 font-weight-medium mb-4">
              {{ post.summary }}
            </p>
            <div v-if="post.content" class="post-content text-body-1 mb-6">
              <p
                v-for="(paragraph, index) in post.content.split('\n')"
                :key="index"
                class="mb-2"
              >
                {{ paragraph }}
              </p>
            </div>
            <BlogReactionBar
              class="mb-2"
              :reactions-count="post.reactions_count ?? 0"
              :comments-count="post.totalComments ?? 0"
              clickable
              @click:reactions="openPostReactions(post)"
            />
          </v-card-text>

          <v-card-actions class="px-4 pb-4 pt-0 flex-wrap">
            <AppButton
              v-if="post.url"
              :href="post.url || undefined"
              target="_blank"
              variant="text"
              color="primary"
              append-icon="mdi-open-in-new"
            >
              {{ t('blog.actions.read') }}
            </AppButton>
            <BlogReactionPicker
              class="ml-auto ml-sm-4"
              :model-value="resolveReactionType(post.isReacted ?? null)"
              :count="post.reactions_count ?? 0"
              :loading="post.ui.likeLoading"
              :disabled="!loggedIn"
              :show-caret="loggedIn"
              :show-count="false"
              @select="(type) => applyPostReaction(post, type)"
              @remove="removePostReactionFromPost(post)"
            />
          </v-card-actions>

          <v-divider />

          <div class="px-4 py-4">
            <h2 class="text-h5 mb-4">{{ t('blog.sections.comments') }}</h2>

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
                rows="3"
                variant="outlined"
                :disabled="post.ui.commentLoading"
              />
              <div class="d-flex justify-end mt-2">
                <AppButton
                  color="primary"
                  :loading="post.ui.commentLoading"
                  :disabled="
                    post.ui.commentLoading ||
                    !post.ui.commentContent.trim().length
                  "
                  @click="submitPostComment(post)"
                >
                  {{ t('blog.actions.addComment') }}
                </AppButton>
              </div>
            </div>

            <BlogCommentThread
              v-if="post.comments.length"
              :comments="post.comments"
              :format-author="getAuthorName"
              :format-date="formatPublishedAt"
              :can-interact="loggedIn"
              :resolve-profile-link="getAuthorProfileLink"
              @select-reaction="
                (payload) =>
                  applyCommentReaction(post, payload.comment, payload.type)
              "
              @remove-reaction="
                (comment) => removeCommentReactionFromComment(post, comment)
              "
              @submit-reply="(comment) => submitCommentReply(post, comment)"
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
        </AppCard>

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
      </v-col>
    </v-row>
    <BlogReactionsDialog
      v-model="reactionsDialog.open"
      :reactions="reactionsDialog.items"
    />
  </v-container>
</template>

<style scoped>
.post-content {
  white-space: pre-line;
}
</style>
