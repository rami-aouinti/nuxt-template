<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BlogCommentThread from '~/components/Blog/CommentThread.vue'
import BlogReactionsDialog from '~/components/Blog/ReactionsDialog.vue'
import {
  AuthenticationRequiredError,
  useBlogApi,
} from '~/composables/useBlogApi'
import type {
  BlogComment,
  BlogCommentLike,
  BlogCommentViewModel,
  BlogPost,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionPreview,
  BlogSummary,
} from '~/types/blog'
import type { PublicProfileData } from '~/types/profile'
import { Notify } from '~/stores/notification'

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

const {
  fetchPostBySlug,
  fetchComments,
  createComment,
  replyToComment,
  likePost,
  dislikePost,
  likeComment,
  dislikeComment,
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
  const likes = Array.isArray(comment.likes)
    ? comment.likes.filter((like): like is BlogCommentLike => {
        if (!like || typeof like !== 'object') {
          return false
        }

        const user = (like as { user?: BlogPostUser | null }).user
        return Boolean(
          user &&
            typeof user === 'object' &&
            'id' in user &&
            typeof user.id === 'string' &&
            user.id.trim().length > 0,
        )
      })
    : []

  const reactionsCount =
    typeof comment.reactions_count === 'number'
      ? comment.reactions_count
      : typeof comment.likes_count === 'number'
        ? comment.likes_count
        : likes.length

  const replies =
    Array.isArray(comment.comments_preview) && comment.comments_preview.length
      ? comment.comments_preview
      : Array.isArray(comment.children)
        ? comment.children
        : []

  let isReacted: BlogComment['isReacted'] = null
  if (typeof comment.isReacted === 'string' || comment.isReacted === null) {
    isReacted = comment.isReacted
  } else if (typeof comment.isReacted === 'boolean') {
    isReacted = comment.isReacted ? 'like' : null
  }

  if (!isReacted && currentUserId.value) {
    const hasLiked = likes.some((like) => like.user.id === currentUserId.value)
    if (hasLiked) {
      isReacted = 'like'
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
              type: like.type ?? 'like',
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
  if (
    Array.isArray(postValue.comments_preview) &&
    postValue.comments_preview.length
  ) {
    return postValue.comments_preview
  }

  const withComments = postValue as BlogPost & {
    comments?: BlogComment[] | null
  }
  if (Array.isArray(withComments.comments)) {
    return withComments.comments
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
    typeof reaction.type === 'string' && reaction.type.trim().length
      ? reaction.type.trim()
      : 'like'

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

const getAuthorAvatar = (user: BlogPostUser) => user.photo || undefined

const AUTHOR_PLACEHOLDER = '__AUTHOR__'

const formatPublishedAt = (publishedAt: string) =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(publishedAt))

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

async function togglePostReaction(postValue: BlogPostViewModel) {
  if (!ensureAuthenticated()) return

  postValue.ui.likeLoading = true
  const currentlyReacted = Boolean(postValue.isReacted)

  try {
    const sanitizedPreview = normalizeReactionsPreview(
      postValue.reactions_preview,
    )

    if (currentlyReacted) {
      await dislikePost(postValue.id)
      postValue.isReacted = null
      postValue.reactions_count = Math.max(
        (postValue.reactions_count ?? 1) - 1,
        0,
      )

      const currentId = currentUserId.value
      postValue.reactions_preview = currentId
        ? sanitizedPreview.filter((reaction) => reaction.user.id !== currentId)
        : sanitizedPreview
    } else {
      await likePost(postValue.id)
      postValue.isReacted = 'like'
      postValue.reactions_count = (postValue.reactions_count ?? 0) + 1

      const currentUser = currentUserReactionUser.value
      if (currentUser) {
        const filtered = sanitizedPreview.filter(
          (reaction) => reaction.user.id !== currentUser.id,
        )
        const normalizedReaction = normalizeReaction({
          id: `${postValue.id}-${currentUser.id}`,
          type: 'like',
          user: currentUser,
        } as BlogReactionPreview)

        postValue.reactions_preview = normalizedReaction
          ? [normalizedReaction, ...filtered]
          : filtered
      } else {
        postValue.reactions_preview = sanitizedPreview
      }
    }
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.reactionFailed')))
  } finally {
    postValue.ui.likeLoading = false
  }
}

async function toggleCommentReaction(
  postValue: BlogPostViewModel,
  comment: BlogCommentViewModel,
) {
  if (!ensureAuthenticated()) return

  comment.ui.likeLoading = true
  const currentlyReacted = Boolean(comment.isReacted)

  try {
    if (currentlyReacted) {
      await dislikeComment(comment.id)
      comment.isReacted = null
      comment.reactions_count = Math.max((comment.reactions_count ?? 1) - 1, 0)
    } else {
      await likeComment(comment.id)
      comment.isReacted = 'like'
      comment.reactions_count = (comment.reactions_count ?? 0) + 1
    }
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
        <v-btn
          class="mb-4"
          color="primary"
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/blog"
        >
          {{ t('common.actions.back') }}
        </v-btn>

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

        <v-card v-else-if="post" class="rounded-xl" elevation="2">
          <v-card-item>
            <template #prepend>
              <NuxtLink
                v-if="getAuthorProfileLink(post.user)"
                :to="getAuthorProfileLink(post.user)"
                class="post-card__avatar-link"
              >
                <v-avatar size="56">
                  <v-img
                    :src="getAuthorAvatar(post.user)"
                    :alt="getAuthorName(post.user)"
                  >
                    <template #error>
                      <v-icon icon="mdi-account-circle" size="56" />
                    </template>
                  </v-img>
                </v-avatar>
              </NuxtLink>
              <v-avatar v-else size="56">
                <v-img
                  :src="getAuthorAvatar(post.user)"
                  :alt="getAuthorName(post.user)"
                >
                  <template #error>
                    <v-icon icon="mdi-account-circle" size="56" />
                  </template>
                </v-img>
              </v-avatar>
            </template>
            <v-card-title class="text-h4 text-wrap">
              {{ post.title }}
            </v-card-title>
            <v-card-subtitle
              class="text-medium-emphasis d-flex flex-wrap align-center"
            >
              <span>
                {{
                  getAuthorMetaParts(formatPublishedAt(post.publishedAt)).prefix
                }}
              </span>
              <NuxtLink
                v-if="getAuthorProfileLink(post.user)"
                :to="getAuthorProfileLink(post.user)"
                class="post-card__author-link mx-1"
              >
                {{ getAuthorName(post.user) }}
              </NuxtLink>
              <span v-else class="mx-1">{{ getAuthorName(post.user) }}</span>
              <span>
                {{
                  getAuthorMetaParts(formatPublishedAt(post.publishedAt)).suffix
                }}
              </span>
            </v-card-subtitle>
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
            <div class="d-flex flex-wrap align-center mb-2">
              <v-btn
                variant="text"
                class="d-flex align-center text-medium-emphasis mr-6 mb-2 px-0"
                @click="openPostReactions(post)"
              >
                <v-icon icon="mdi-thumb-up-outline" class="mr-1" />
                <span class="text-body-2 font-weight-medium">
                  {{
                    t('blog.stats.reactions', {
                      count: post.reactions_count ?? 0,
                    })
                  }}
                </span>
              </v-btn>
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

          <v-card-actions class="px-4 pb-4 pt-0 flex-wrap">
            <v-btn
              v-if="post.url"
              :href="post.url || undefined"
              target="_blank"
              variant="text"
              color="primary"
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
              :resolve-profile-link="getAuthorProfileLink"
              @toggle-like="(comment) => toggleCommentReaction(post, comment)"
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
        </v-card>

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

.post-card__avatar-link {
  display: inline-flex;
}

.post-card__author-link {
  color: inherit;
  text-decoration: none;
}

.post-card__author-link:hover,
.post-card__author-link:focus-visible {
  text-decoration: underline;
}
</style>
