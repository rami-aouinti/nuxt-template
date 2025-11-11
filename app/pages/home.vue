<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import BlogReactionsDialog from '~/components/Blog/ReactionsDialog.vue'
import BlogPostCard from '~/components/Blog/PostCard.vue'
import BlogPostCardSkeleton from '~/components/Blog/PostCardSkeleton.vue'
import DialogConfirm from '~/components/DialogConfirm.vue'
import WorkplaceManagerDialog from '~/components/workplace/WorkplaceManagerDialog.vue'
import {
  BLOG_POSTS_DEFAULT_LIMIT,
  AuthenticationRequiredError,
  useBlogApi,
} from '~/composables/useBlogApi'
import type {
  BlogComment,
  BlogCommentLike,
  BlogCommentViewModel,
  BlogPost,
  BlogPostSharePayload,
  BlogPostViewModel,
  BlogPostUser,
  BlogReactionPreview,
  BlogReactionType,
  BlogSummary,
} from '~/types/blog'
import type { PublicProfileData } from '~/types/profile'
import type { Workplace } from '~/types/workplace'
import { Notify } from '~/stores/notification'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import { DEFAULT_REACTION_TYPE, resolveReactionType } from '~/utils/reactions'

definePageMeta({
  title: 'navigation.home',
})

const { t, locale } = useI18n()
const translate = (key: string, fallback: string) => {
  const value = t(key)
  return value && value !== key ? value : fallback
}
const { session, loggedIn } = useUserSession()

const currentUsername = computed(
  () => session.value?.user?.login || session.value?.profile?.username || null,
)

const { getAuthorName, getAuthorAvatar } = useBlogAuthor()

const localSearch = ref('')

const searchTerm = computed(() => localSearch.value.trim().toLowerCase())
const hasSearchTerm = computed(() => searchTerm.value.length > 0)

const normalizeSearchValue = (value: string | null | undefined) =>
  typeof value === 'string' ? value.trim().toLowerCase() : ''

const matchesSearchTerm = (value: string | null | undefined) => {
  if (!hasSearchTerm.value) {
    return true
  }

  const normalized = normalizeSearchValue(value)
  return normalized.length > 0 && normalized.includes(searchTerm.value)
}

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

const {
  fetchPosts,
  fetchPublicBlogs,
  fetchUserBlogs,
  fetchComments,
  createComment,
  replyToComment,
  reactToPost,
  removePostReaction,
  reactToComment,
  removeCommentReaction,
  updatePost,
  deletePost,
  createBlog,
  updateBlog,
  deleteBlog,
  createPost,
  sharePost: sharePostRequest,
} = useBlogApi()

const POST_EXCERPT_MAX_LENGTH = 150

const posts = ref<BlogPostViewModel[]>([])
const filteredPosts = computed(() => {
  if (!hasSearchTerm.value) {
    return posts.value
  }

  return posts.value.filter((post) => {
    return [
      post.title,
      post.summary ?? null,
      post.blog?.title ?? null,
      post.blog?.blogSubtitle ?? null,
    ].some((field) => matchesSearchTerm(field))
  })
})
const pagination = reactive({
  page: 1,
  limit: BLOG_POSTS_DEFAULT_LIMIT,
  total: 0,
})

const isInitialLoading = ref(false)
const isLoadingMore = ref(false)
const postsError = ref<string | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const deleteDialog = ref<InstanceType<typeof DialogConfirm> | null>(null)

const publicBlogs = ref<BlogSummary[]>([])
const publicBlogsLoading = ref(false)
const publicBlogsError = ref<string | null>(null)

const myBlogs = ref<BlogSummary[]>([])
const filteredMyBlogs = computed(() => {
  if (!hasSearchTerm.value) {
    return myBlogs.value
  }

  return myBlogs.value.filter((blog) =>
    [blog.title, blog.blogSubtitle ?? null, blog.author].some((field) =>
      matchesSearchTerm(field),
    ),
  )
})
const myBlogsLoading = ref(false)
const myBlogsError = ref<string | null>(null)

const myWorkplaces = ref<Workplace[]>([])
const filteredMyWorkplaces = computed(() => {
  if (!hasSearchTerm.value) {
    return myWorkplaces.value
  }

  return myWorkplaces.value.filter((workplace) =>
    [workplace.name, workplace.slug].some((field) => matchesSearchTerm(field)),
  )
})
const myWorkplacesLoading = ref(false)
const myWorkplacesError = ref<string | null>(null)

const addWorldDialogOpen = ref(false)

const sidebarIntro = computed(() =>
  translate(
    'blog.sidebar.intro',
    "Retrouvez vos espaces d'écriture et créez un nouvel article.",
  ),
)
const workplaceDrawerTitle = computed(() =>
  translate('workplace.drawer.title', 'World'),
)
const workplaceEmptyMessage = computed(() =>
  translate('workplace.drawer.emptyList', 'You have no worlds yet.'),
)
const addWorldLabel = computed(() =>
  translate('workplace.drawer.addWorld', 'Add world'),
)

const createBlogDialog = reactive({
  open: false,
  loading: false,
  form: {
    title: '',
    subtitle: '',
  },
})

const editBlogDialog = reactive({
  open: false,
  loading: false,
  blogId: '',
  form: {
    title: '',
    subtitle: '',
  },
})

const blogDeleteLoadingId = ref<string | null>(null)

const isBlogDeleting = (blogId: string) => blogDeleteLoadingId.value === blogId
const isBlogEditing = (blogId: string) =>
  editBlogDialog.loading && editBlogDialog.blogId === blogId
const isBlogMenuDisabled = (blogId: string) =>
  isBlogDeleting(blogId) || isBlogEditing(blogId)

const createPostDialog = reactive({
  open: false,
  loading: false,
  form: {
    blogId: '',
    title: '',
    summary: '',
    content: '',
    url: '',
  },
})

const shareDialog = reactive({
  open: false,
  post: null as BlogPostViewModel | null,
  message: '',
  loading: false,
})

const reactionsDialog = reactive({
  open: false,
  items: [] as BlogReactionPreview[],
})

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

const createPostTitle = computed(() => t('blog.feed.composer.title'))

const createPostPrompt = computed(() =>
  t('blog.feed.composer.placeholder', {
    name: currentUserDisplayName.value,
  }),
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
    const username = profile.username.trim().length
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

const hasMore = computed(
  () => posts.value.length < pagination.total && posts.value.length > 0,
)

const myBlogsOptions = computed(() =>
  myBlogs.value.map((blog) => ({
    value: blog.id,
    title: blog.title,
  })),
)

function getBlogInitials(title: string | null | undefined): string {
  if (!title) {
    return '??'
  }

  const trimmed = title.trim()
  if (!trimmed) {
    return '??'
  }

  const alphanumericChars = Array.from(trimmed).filter((char) =>
    /\p{Letter}|\p{Number}/u.test(char),
  )
  const fallbackChars = alphanumericChars.length
    ? alphanumericChars
    : Array.from(trimmed).filter((char) => char.trim().length > 0)

  if (!fallbackChars.length) {
    return '??'
  }

  const initials = fallbackChars.slice(0, 2)
  if (initials.length === 1) {
    initials.push(initials[0])
  }

  return initials.join('').toUpperCase()
}

let activeRequest = 0
let previousLoggedIn = loggedIn.value

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

function resolvePostComments(post: BlogPost): BlogComment[] {
  if (Array.isArray(post.comments_preview) && post.comments_preview.length) {
    return post.comments_preview
  }

  const withComments = post as BlogPost & { comments?: BlogComment[] | null }
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

  const id = user.id.trim().length ? user.id.trim() : null
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
  const username = user.username.trim().length
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
    id: reaction.id.trim().length ? reaction.id : `${id}-${type}`,
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

function createPostViewModel(post: BlogPost): BlogPostViewModel {
  const reactionsPreview = normalizeReactionsPreview(post.reactions_preview)

  return {
    ...post,
    reactions_preview: reactionsPreview,
    comments: resolvePostComments(post).map(createCommentViewModel),
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
  myBlogs.value = []
  myWorkplaces.value = []
  pagination.page = 1
  pagination.total = 0
  await loadPosts(1, { replace: true })
  await Promise.all([loadMyBlogList(), loadMyWorkplaceList()])
}

async function loadMorePosts() {
  if (
    isInitialLoading.value ||
    isLoadingMore.value ||
    !hasMore.value ||
    hasSearchTerm.value
  ) {
    return
  }
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

async function loadPublicBlogList() {
  publicBlogsLoading.value = true
  publicBlogsError.value = null

  try {
    publicBlogs.value = await fetchPublicBlogs()
  } catch (error) {
    publicBlogsError.value = extractErrorMessage(
      error,
      t('blog.errors.loadBlogsFailed'),
    )
  } finally {
    publicBlogsLoading.value = false
  }
}

async function loadMyBlogList() {
  if (!loggedIn.value) {
    myBlogs.value = []
    return
  }

  myBlogsLoading.value = true
  myBlogsError.value = null

  try {
    myBlogs.value = await fetchUserBlogs()
  } catch (error) {
    myBlogsError.value = extractErrorMessage(
      error,
      t('blog.errors.loadBlogsFailed'),
    )
  } finally {
    myBlogsLoading.value = false
  }
}

async function loadMyWorkplaceList() {
  if (!loggedIn.value) {
    myWorkplaces.value = []
    myWorkplacesError.value = null
    myWorkplacesLoading.value = false
    return
  }

  myWorkplacesLoading.value = true
  myWorkplacesError.value = null

  try {
    const workplaces = await $fetch<Workplace[]>('/api/frontend/workplaces')
    myWorkplaces.value = Array.isArray(workplaces)
      ? workplaces.reduce<Workplace[]>((accumulator, item) => {
          if (!item || typeof item !== 'object') {
            return accumulator
          }

          const record = item as Record<string, unknown>
          const rawId = record.id
          const rawSlug = record.slug
          const rawName = record.name

          const normalizedId =
            typeof rawId === 'number'
              ? String(rawId)
              : typeof rawId === 'string'
                ? rawId.trim()
                : ''
          const normalizedSlug =
            typeof rawSlug === 'string' ? rawSlug.trim() : ''

          if (!normalizedId || !normalizedSlug) {
            return accumulator
          }

          const normalizedName =
            typeof rawName === 'string' && rawName.trim().length > 0
              ? rawName.trim()
              : normalizedSlug

          const sanitized = {
            ...(record as Record<string, unknown>),
            id: normalizedId,
            name: normalizedName,
            slug: normalizedSlug,
          } as Workplace

          accumulator.push(sanitized)

          return accumulator
        }, [])
      : []
  } catch (error) {
    myWorkplacesError.value = extractErrorMessage(
      error,
      t('common.unexpectedError'),
    )
  } finally {
    myWorkplacesLoading.value = false
  }
}

async function refreshWorkplaces() {
  await loadMyWorkplaceList()
}

function resetCreateBlogForm() {
  createBlogDialog.form.title = ''
  createBlogDialog.form.subtitle = ''
}

function resetEditBlogForm() {
  editBlogDialog.blogId = ''
  editBlogDialog.form.title = ''
  editBlogDialog.form.subtitle = ''
}

function resetCreatePostForm() {
  createPostDialog.form.blogId = myBlogs.value[0]?.id ?? ''
  createPostDialog.form.title = ''
  createPostDialog.form.summary = ''
  createPostDialog.form.content = ''
  createPostDialog.form.url = ''
}

function openAddWorldDialog() {
  if (!ensureAuthenticated()) return

  addWorldDialogOpen.value = true
}

function openCreateBlogDialog() {
  if (!ensureAuthenticated()) return

  resetCreateBlogForm()
  createBlogDialog.open = true
}

function openEditBlogDialog(blog: BlogSummary) {
  if (!ensureAuthenticated()) return

  const blogId = blog?.id?.toString().trim()
  if (!blogId) {
    Notify.warning(t('blog.errors.updateBlogFailed'))
    return
  }

  editBlogDialog.blogId = blogId
  editBlogDialog.form.title = typeof blog.title === 'string' ? blog.title : ''
  editBlogDialog.form.subtitle =
    typeof blog.blogSubtitle === 'string' ? blog.blogSubtitle : ''
  editBlogDialog.open = true
}

function closeEditBlogDialog() {
  if (editBlogDialog.loading) {
    return
  }

  editBlogDialog.open = false
  resetEditBlogForm()
}

async function submitCreateBlog() {
  if (!ensureAuthenticated()) return

  const title = createBlogDialog.form.title.trim()
  const subtitle = createBlogDialog.form.subtitle.trim()

  if (!title.length) {
    Notify.warning(t('blog.errors.createBlogFailed'))
    return
  }

  createBlogDialog.loading = true

  try {
    const created = await createBlog({
      title,
      blogSubtitle: subtitle.length ? subtitle : null,
    })

    myBlogs.value = [
      created,
      ...myBlogs.value.filter((blog) => blog.id !== created.id),
    ]

    await loadMyBlogList()
    Notify.success(t('blog.notifications.blogCreated'))
    createBlogDialog.open = false
    resetCreateBlogForm()
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.createBlogFailed')))
  } finally {
    createBlogDialog.loading = false
  }
}

async function submitEditBlog() {
  if (!ensureAuthenticated()) return

  const blogId = editBlogDialog.blogId
  const title = editBlogDialog.form.title.trim()

  if (!blogId || !title.length) {
    Notify.warning(t('blog.errors.updateBlogFailed'))
    return
  }

  editBlogDialog.loading = true

  try {
    const subtitle = editBlogDialog.form.subtitle.trim()
    const payload = {
      title,
      blogSubtitle: subtitle.length ? subtitle : null,
    }

    const updated = await updateBlog(blogId, payload)
    const updatedBlog =
      updated && typeof updated === 'object' ? (updated as BlogSummary) : null

    const normalizedTitle =
      typeof updatedBlog?.title === 'string' && updatedBlog.title.trim().length
        ? updatedBlog.title
        : title
    const hasSubtitleFromResponse =
      updatedBlog != null &&
      Object.prototype.hasOwnProperty.call(updatedBlog, 'blogSubtitle')
    const normalizedSubtitle = hasSubtitleFromResponse
      ? (updatedBlog?.blogSubtitle ?? null)
      : subtitle.length
        ? subtitle
        : null

    myBlogs.value = myBlogs.value.map((blog) => {
      if (blog.id !== blogId) {
        return blog
      }

      const merged = updatedBlog ? { ...blog, ...updatedBlog } : { ...blog }

      return {
        ...merged,
        title: normalizedTitle,
        blogSubtitle: normalizedSubtitle,
      }
    })

    Notify.success(t('blog.notifications.blogUpdated'))
    editBlogDialog.open = false
    resetEditBlogForm()
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.updateBlogFailed')))
  } finally {
    editBlogDialog.loading = false
  }
}

async function confirmDeleteBlog(blog: BlogSummary) {
  if (!ensureAuthenticated()) return

  const blogId = blog?.id?.toString().trim()
  if (!blogId) {
    Notify.warning(t('blog.errors.deleteBlogFailed'))
    return
  }

  if (!import.meta.client) {
    return
  }

  const confirmation = deleteDialog.value
    ? await deleteDialog.value.open(t('blog.dialogs.deleteBlogConfirm'))
    : window.confirm(t('blog.dialogs.deleteBlogConfirm'))

  if (!confirmation) {
    return
  }

  blogDeleteLoadingId.value = blogId
  try {
    await deleteBlog(blogId)
    myBlogs.value = myBlogs.value.filter((item) => item.id !== blogId)

    if (createPostDialog.form.blogId === blogId) {
      createPostDialog.form.blogId = myBlogs.value[0]?.id ?? ''
    }

    Notify.success(t('blog.notifications.blogDeleted'))
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.deleteBlogFailed')))
  } finally {
    blogDeleteLoadingId.value = null
  }
}

function openCreatePostDialog() {
  if (!ensureAuthenticated()) return

  if (!myBlogs.value.length) {
    Notify.warning(t('blog.sidebar.noBlogs'))
    return
  }

  resetCreatePostForm()
  createPostDialog.open = true
}

async function submitCreatePost() {
  if (!ensureAuthenticated()) return

  const blogId = createPostDialog.form.blogId
  const title = createPostDialog.form.title.trim()
  const summary = createPostDialog.form.summary.trim()
  const content = createPostDialog.form.content.trim()
  const url = createPostDialog.form.url.trim()

  if (!blogId || !title.length) {
    Notify.warning(t('blog.errors.createPostFailed'))
    return
  }

  createPostDialog.loading = true

  try {
    const created = await createPost({
      blog: blogId,
      title,
      summary: summary.length ? summary : null,
      content: content.length ? content : null,
      url: url.length ? url : null,
    })

    const newPost = createPostViewModel(created)
    posts.value = [
      newPost,
      ...posts.value.filter((post) => post.id !== newPost.id),
    ]
    pagination.total += 1
    Notify.success(t('blog.notifications.postCreated'))
    createPostDialog.open = false
    resetCreatePostForm()
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.createPostFailed')))
  } finally {
    createPostDialog.loading = false
  }
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

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}…`
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

const formatPublishedAt = (publishedAt: string) => {
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime())) {
    return publishedAt
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

const relativeTimeFormat = computed(
  () =>
    new Intl.RelativeTimeFormat(locale.value, {
      numeric: 'auto',
    }),
)

function formatRelativePublishedAt(publishedAt: string) {
  const target = new Date(publishedAt)
  if (Number.isNaN(target.getTime())) {
    return formatPublishedAt(publishedAt)
  }

  const diffInSeconds = Math.round((target.getTime() - Date.now()) / 1000)
  const thresholds: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 60 * 60 * 24 * 365 },
    { unit: 'month', seconds: 60 * 60 * 24 * 30 },
    { unit: 'week', seconds: 60 * 60 * 24 * 7 },
    { unit: 'day', seconds: 60 * 60 * 24 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ]

  for (const { unit, seconds } of thresholds) {
    if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
      if (unit === 'second' && Math.abs(diffInSeconds) < 45) {
        return relativeTimeFormat.value.format(0, 'second')
      }

      const value = Math.round(diffInSeconds / seconds)
      return relativeTimeFormat.value.format(value, unit)
    }
  }

  return formatPublishedAt(publishedAt)
}

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

  if (!import.meta.client) {
    return
  }

  const confirmation = deleteDialog.value
    ? await deleteDialog.value.open(t('blog.dialogs.deleteConfirm'))
    : window.confirm(t('blog.dialogs.deleteConfirm'))

  if (!confirmation) {
    return
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
    Notify.error(extractErrorMessage(error, t('blog.errors.likeFailed')))
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
    Notify.error(extractErrorMessage(error, t('blog.errors.likeFailed')))
  } finally {
    post.ui.likeLoading = false
  }
}

function openPostReactions(post: BlogPostViewModel) {
  reactionsDialog.items = normalizeReactionsPreview(post.reactions_preview)
  reactionsDialog.open = true
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
    Notify.error(extractErrorMessage(error, t('blog.errors.likeFailed')))
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
    const viewModel = createPostViewModel(sharedPost)
    const previousPosts = posts.value
    const existingIds = new Set(previousPosts.map((item) => item.id))

    posts.value = [
      viewModel,
      ...previousPosts.filter((item) => item.id !== viewModel.id),
    ]

    if (!existingIds.has(viewModel.id)) {
      pagination.total += 1
    }

    Notify.success(t('blog.notifications.postShared'))
    shareDialog.open = false
  } catch (error) {
    Notify.error(extractErrorMessage(error, t('blog.errors.shareFailed')))
  } finally {
    shareDialog.loading = false
  }
}

watch(
  () => myBlogs.value.map((blog) => blog.id),
  (ids) => {
    if (!ids.length) {
      createPostDialog.form.blogId = ''
      return
    }

    if (!ids.includes(createPostDialog.form.blogId)) {
      createPostDialog.form.blogId = ids[0]
    }
  },
)

watch(
  () => createPostDialog.open,
  (open) => {
    if (open && myBlogs.value.length && !createPostDialog.form.blogId) {
      createPostDialog.form.blogId = myBlogs.value[0].id
    }
  },
)

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
  () => loggedIn.value,
  (value) => {
    if (value === previousLoggedIn) return
    previousLoggedIn = value

    if (!value) {
      myBlogs.value = []
      myBlogsError.value = null
      myWorkplaces.value = []
      myWorkplacesError.value = null
      myWorkplacesLoading.value = false
      createBlogDialog.open = false
      createPostDialog.open = false
      addWorldDialogOpen.value = false
    }

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

async function hydrateInitialData() {
  await loadPublicBlogList()

  if (loggedIn.value) {
    await Promise.all([loadMyBlogList(), loadMyWorkplaceList()])
  }

  await loadPosts(1, { replace: true })
}

if (import.meta.client) {
  onMounted(() => {
    void hydrateInitialData()
  })
}
</script>

<template>
  <v-container fluid class="blog-page px-6 px-md-10">
    <client-only>
      <teleport to="#app-drawer">
        <BlogSidebarMyWorkplacesSection
          :title="workplaceDrawerTitle"
          :description="sidebarIntro"
          :logged-in="loggedIn"
          :login-message="t('blog.sidebar.loginToManage')"
          :loading="myWorkplacesLoading"
          :error="myWorkplacesError"
          :workplaces="myWorkplaces"
          :filtered-workplaces="filteredMyWorkplaces"
          :has-search-term="hasSearchTerm"
          :no-results-message="t('blog.search.noResults')"
          :empty-message="workplaceEmptyMessage"
          :add-world-label="addWorldLabel"
          :get-initials="getBlogInitials"
          @refresh="refreshWorkplaces"
          @add-world="openAddWorldDialog"
        />
      </teleport>
    </client-only>
    <client-only>
      <teleport to="#app-drawer-right">
        <BlogSidebarMyBlogsSection
          :title="t('blog.sidebar.myBlogsTitle')"
          :description="sidebarIntro"
          :logged-in="loggedIn"
          :login-message="t('blog.sidebar.loginToManage')"
          :loading="myBlogsLoading"
          :error="myBlogsError"
          :blogs="myBlogs"
          :filtered-blogs="filteredMyBlogs"
          :has-search-term="hasSearchTerm"
          :no-results-message="t('blog.search.noResults')"
          :empty-message="t('blog.sidebar.myBlogsEmpty')"
          :create-label="t('blog.sidebar.createBlog')"
          :edit-label="t('blog.actions.editBlog')"
          :delete-label="t('blog.actions.deleteBlog')"
          :get-initials="getBlogInitials"
          :is-menu-disabled="isBlogMenuDisabled"
          :is-deleting="isBlogDeleting"
          @create="openCreateBlogDialog"
          @edit="openEditBlogDialog"
          @delete="confirmDeleteBlog"
        />
      </teleport>
    </client-only>
    <teleport to="#app-bar">
      <div class="d-flex align-items">
        <v-text-field
          v-model="localSearch"
          class="mr-2"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          rounded="xl"
          flat
          icon-color
          glow
          color="primary"
          variant="outlined"
          style="width: 250px"
        />
        <v-btn
          variant="text"
          :loading="isInitialLoading"
          class="dock-navbar__action-button"
          :aria-label="t('blog.actions.refresh')"
          @click="refreshPosts"
        >
          <v-icon icon="mdi-refresh" />
        </v-btn>
      </div>
    </teleport>
    <v-row class="blog-layout justify-center">
      <v-col cols="12">
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

        <v-row v-if="isInitialLoading" class="g-6">
          <v-col v-for="index in 3" :key="index" cols="12">
            <BlogPostCardSkeleton />
          </v-col>
        </v-row>

        <template v-else>
          <v-card
            v-if="loggedIn"
            class="create-post-card mb-6"
            elevation="0"
            rounded="xl"
          >
            <v-card-text class="create-post-card__body">
              <div
                class="create-post-card__composer"
                role="button"
                tabindex="0"
                :aria-label="createPostTitle"
                @click="openCreatePostDialog"
                @keydown.enter.prevent="openCreatePostDialog"
                @keydown.space.prevent="openCreatePostDialog"
              >
                <AppAvatar
                  :src="currentUserAvatar"
                  :alt="currentUserDisplayName"
                  size="32"
                  class="create-post-card__avatar"
                />
                <div class="create-post-card__placeholder">
                  {{ createPostPrompt }}
                </div>
              </div>
              <v-divider class="my-4" />
              <div class="create-post-card__actions">
                <v-btn
                  variant="text"
                  class="create-post-card__action"
                  color="error"
                  prepend-icon="mdi-video-outline"
                  @click="openCreatePostDialog"
                >
                  {{ t('blog.feed.composer.actions.liveVideo') }}
                </v-btn>
                <v-btn
                  variant="text"
                  class="create-post-card__action"
                  color="success"
                  prepend-icon="mdi-image-multiple-outline"
                  @click="openCreatePostDialog"
                >
                  {{ t('blog.feed.composer.actions.photoVideo') }}
                </v-btn>
                <v-btn
                  variant="text"
                  class="create-post-card__action"
                  color="warning"
                  prepend-icon="mdi-emoticon-happy-outline"
                  @click="openCreatePostDialog"
                >
                  {{ t('blog.feed.composer.actions.feelingActivity') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
          <v-row v-if="filteredPosts.length" class="g-6">
            <v-col v-for="post in filteredPosts" :key="post.id" cols="12">
              <BlogPostCard
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
              />
            </v-col>
          </v-row>

          <v-alert
            v-else-if="hasSearchTerm"
            type="info"
            variant="tonal"
            class="mb-6"
            border="start"
            prominent
          >
            {{ t('blog.search.noResults') }}
          </v-alert>

          <v-sheet v-else class="blog-feed__empty" elevation="1" rounded="xl">
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
          v-show="hasMore && !hasSearchTerm"
          ref="loadMoreTrigger"
          class="blog-infinite-trigger"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="shareDialog.open" max-width="640">
      <v-card class="share-dialog">
        <v-card-title class="d-flex align-center">
          <span>{{ t('blog.dialogs.shareTitle') }}</span>
          <v-spacer />
          <v-btn
            icon
            variant="text"
            :disabled="shareDialog.loading"
            @click="closeShareDialog"
          >
            <v-icon icon="mdi-close" />
          </v-btn>
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
          <v-btn
            variant="text"
            :disabled="shareDialog.loading"
            @click="closeShareDialog"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!shareDialog.post || shareDialog.loading"
            :loading="shareDialog.loading"
            @click="submitShare"
          >
            {{ t('common.actions.share') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editBlogDialog.open" max-width="520" persistent>
      <v-card>
        <v-card-title>{{ t('blog.dialogs.editBlogTitle') }}</v-card-title>
        <v-card-text class="d-flex flex-column gap-4">
          <v-text-field
            v-model="editBlogDialog.form.title"
            :label="t('blog.forms.createBlog.title')"
            :disabled="editBlogDialog.loading"
            variant="outlined"
            rounded
            density="comfortable"
            autofocus
          />
          <v-text-field
            v-model="editBlogDialog.form.subtitle"
            :label="t('blog.forms.createBlog.subtitle')"
            :disabled="editBlogDialog.loading"
            variant="outlined"
            density="comfortable"
            rounded
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            :disabled="editBlogDialog.loading"
            @click="closeEditBlogDialog"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="editBlogDialog.loading"
            :disabled="!editBlogDialog.form.title.trim().length"
            @click="submitEditBlog"
          >
            {{ t('common.actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <WorkplaceManagerDialog
      v-model="addWorldDialogOpen"
      :workplaces="myWorkplaces"
    />

    <v-dialog v-model="createBlogDialog.open" max-width="520" persistent>
      <v-card>
        <v-card-title>{{ t('blog.sidebar.createBlog') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="createBlogDialog.form.title"
            :label="t('blog.forms.createBlog.title')"
            :disabled="createBlogDialog.loading"
            required
            rounded
          />
          <v-text-field
            v-model="createBlogDialog.form.subtitle"
            :label="t('blog.forms.createBlog.subtitle')"
            :disabled="createBlogDialog.loading"
            rounded
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="createBlogDialog.loading"
            @click="createBlogDialog.open = false"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="createBlogDialog.loading"
            :disabled="!createBlogDialog.form.title.trim().length"
            @click="submitCreateBlog"
          >
            {{ t('common.actions.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createPostDialog.open" max-width="640" persistent>
      <v-card>
        <v-card-title>{{ t('blog.sidebar.createPost') }}</v-card-title>
        <v-card-text>
          <v-select
            v-model="createPostDialog.form.blogId"
            :items="myBlogsOptions"
            item-title="title"
            item-value="value"
            :label="t('blog.forms.createPost.blog')"
            :disabled="createPostDialog.loading"
            rounded
          />
          <v-text-field
            v-model="createPostDialog.form.title"
            :label="t('blog.forms.createPost.title')"
            :disabled="createPostDialog.loading"
            required
            rounded
          />
          <v-text-field
            v-model="createPostDialog.form.summary"
            :label="t('blog.forms.createPost.summary')"
            :disabled="createPostDialog.loading"
            rounded
          />
          <v-textarea
            v-model="createPostDialog.form.content"
            :label="t('blog.forms.createPost.content')"
            :disabled="createPostDialog.loading"
            rows="6"
            auto-grow
            rounded
          />
          <v-text-field
            v-model="createPostDialog.form.url"
            :label="t('blog.forms.createPost.url')"
            :disabled="createPostDialog.loading"
            rounded
            type="url"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="createPostDialog.loading"
            @click="createPostDialog.open = false"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="createPostDialog.loading"
            :disabled="
              !createPostDialog.form.title.trim().length ||
              !createPostDialog.form.blogId
            "
            @click="submitCreatePost"
          >
            {{ t('common.actions.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <BlogReactionsDialog
      v-model="reactionsDialog.open"
      :reactions="reactionsDialog.items"
    />
    <DialogConfirm ref="deleteDialog" />
  </v-container>
</template>

<style scoped>
.dock-navbar__action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 9999px;
}

.blog-page {
  position: relative;
  z-index: 1;
}

.blog-hero {
  display: grid;
  gap: 24px;
  border-radius: 32px;
}

.blog-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.blog-hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.blog-feed {
  border-radius: 28px;
}

.create-post-card {
  background: var(--blog-feed-background);
  box-shadow: var(--blog-feed-shadow);
}

.create-post-card__body {
  display: flex;
  flex-direction: column;
}

.create-post-card__composer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 999px;
  border: solid;
  border-color: rgba(var(--v-theme-surface-variant), 0.5);
  cursor: pointer;
  transition: background-color 0.2s ease;
  outline: none;
}

.create-post-card__composer:hover,
.create-post-card__composer:focus-visible {
  background: rgba(var(--v-theme-surface-variant), 0.1);
}

.create-post-card__avatar {
  flex-shrink: 0;
}

.create-post-card__placeholder {
  flex: 1 1 auto;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-weight: 500;
}

.create-post-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}

.create-post-card__action {
  flex: 1 1 auto;
  justify-content: flex-start;
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 600px) {
  .create-post-card__actions {
    flex-direction: column;
  }
}

.blog-feed__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  border-radius: 24px;
  background: var(--blog-feed-empty-background);
}

.share-dialog {
  border-radius: 24px;
}

.share-dialog__composer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.share-dialog__avatar {
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
}

.share-dialog__user-name {
  font-weight: 600;
  font-size: 1.05rem;
}

.share-dialog__audience {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.85rem;
}

.share-dialog__preview {
  border-radius: 20px;
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
  background: rgba(var(--blog-surface-rgb), 0.72);
  padding: 16px;
}

.share-dialog__preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.share-dialog__preview-author {
  font-weight: 600;
}

.share-dialog__preview-meta {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.share-dialog__preview-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 6px;
}

.share-dialog__preview-text {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.72);
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

.blog-sidebar__list {
  background: transparent;
}

.blog-sidebar__menu-btn {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.blog-sidebar__menu-btn:hover,
.blog-sidebar__menu-btn:focus-visible {
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.blog-avatar__initials {
  font-weight: 600;
  letter-spacing: 0.08em;
}

.workplace-card {
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08),
    rgba(var(--v-theme-surface), 0.9)
  );
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.workplace-card__link {
  padding: 8px 0;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.workplace-card__link:hover .text-body-1 {
  color: rgb(var(--v-theme-primary));
}

.blog-infinite-trigger {
  height: 1px;
}

@media (max-width: 960px) {
}

@media (prefers-color-scheme: dark) {
  .blog-page {
    --blog-hero-background: rgba(var(--blog-surface-rgb), 0.88);
    --blog-hero-shadow: var(
      --app-shadow,
      0 24px 60px rgba(0, 0, 0, 0.55)
    );
    --blog-feed-background: rgba(var(--blog-surface-rgb), 0.88);
    --blog-feed-shadow: var(
      --app-shadow,
      0 24px 60px rgba(0, 0, 0, 0.55)
    );
    --blog-sidebar-background: rgba(var(--blog-surface-rgb), 0.88);
    --blog-sidebar-shadow: var(
      --app-shadow,
      0 24px 60px rgba(0, 0, 0, 0.55)
    );
    --blog-feed-empty-background: rgba(var(--blog-surface-variant-rgb), 0.18);
    --blog-post-card-background: rgba(var(--blog-surface-rgb), 0.9);
    --blog-post-card-shadow: var(
      --app-shadow,
      0 24px 60px rgba(0, 0, 0, 0.55)
    );
    --blog-post-card-hover-shadow: var(
      --app-shadow,
      0 30px 68px rgba(0, 0, 0, 0.6)
    );
    --blog-comments-empty-background: rgba(
      var(--blog-surface-variant-rgb),
      0.12
    );
  }
}

:global(.v-theme--dark) .blog-page {
  --blog-hero-background: rgba(var(--blog-surface-rgb), 0.88);
  --blog-hero-shadow: var(
    --app-shadow,
    0 24px 60px rgba(0, 0, 0, 0.55)
  );
  --blog-feed-background: rgba(var(--blog-surface-rgb), 0.88);
  --blog-feed-shadow: var(
    --app-shadow,
    0 24px 60px rgba(0, 0, 0, 0.55)
  );
  --blog-sidebar-background: rgba(var(--blog-surface-rgb), 0.88);
  --blog-sidebar-shadow: var(
    --app-shadow,
    0 24px 60px rgba(0, 0, 0, 0.55)
  );
  --blog-feed-empty-background: rgba(var(--blog-surface-variant-rgb), 0.18);
  --blog-post-card-background: rgba(var(--blog-surface-rgb), 0.9);
  --blog-post-card-shadow: var(
    --app-shadow,
    0 24px 60px rgba(0, 0, 0, 0.55)
  );
  --blog-post-card-hover-shadow: var(
    --app-shadow,
    0 30px 68px rgba(0, 0, 0, 0.6)
  );
  --blog-comments-empty-background: rgba(var(--blog-surface-variant-rgb), 0.12);
}
</style>
