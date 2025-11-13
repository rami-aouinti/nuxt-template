import type {
  BlogComment,
  BlogCommentViewModel,
  BlogPost,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionPreview,
} from '~/types/blog'
import { pickString } from '~/utils/blog/admin'
import { DEFAULT_REACTION_TYPE, resolveReactionType } from '~/utils/reactions'
import { extractCommentLikes, extractCommentList } from '~/utils/blogComments'
import { resolveStringList } from '~/utils/blog/admin'

export interface CommentTransformOptions {
  currentUserId?: string | null
}

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const normalizeComment = (
  comment: BlogComment,
  { currentUserId }: CommentTransformOptions = {},
): BlogComment => {
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

  if (!isReacted && currentUserId) {
    const selfReaction = likes.find((like) => like.user.id === currentUserId)
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

export const createCommentViewModel = (
  comment: BlogComment,
  options: CommentTransformOptions = {},
): BlogCommentViewModel => {
  const normalized = normalizeComment(comment, options)

  return {
    ...normalized,
    replies: (normalized.comments_preview ?? []).map((reply) =>
      createCommentViewModel(reply, options),
    ),
    ui: {
      replyOpen: false,
      replyContent: '',
      replyLoading: false,
      likeLoading: false,
      editOpen: false,
      editContent: normalized.content,
      editLoading: false,
      deleteLoading: false,
    },
  }
}

export const resolvePostComments = (post: BlogPost): BlogComment[] => {
  const preview = extractCommentList(post.comments_preview)
  if (preview.length) {
    return preview
  }

  const withComments = post as BlogPost & { comments?: unknown }
  const comments = extractCommentList(withComments.comments)
  if (comments.length) {
    return comments
  }

  return []
}

export const normalizeReaction = (
  reaction: BlogReactionPreview | null | undefined,
): BlogReactionPreview | null => {
  if (!reaction || typeof reaction !== 'object') {
    return null
  }

  const user = (reaction as { user?: BlogPostUser | null }).user
  if (!user || typeof user !== 'object') {
    return null
  }

  const id = toTrimmedString(user.id)
  if (!id) {
    return null
  }

  const type =
    resolveReactionType(reaction.type ?? null) ?? DEFAULT_REACTION_TYPE

  const firstName = toTrimmedString(user.firstName ?? undefined)
  const lastName = toTrimmedString(user.lastName ?? undefined)
  const username = toTrimmedString(user.username ?? undefined)
  const email = toTrimmedString(user.email ?? undefined)
  const photo = toTrimmedString(user.photo ?? undefined)

  const reactionId = toTrimmedString(reaction.id ?? undefined)

  return {
    id: reactionId ?? `${id}-${type}`,
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

export const normalizeReactionsPreview = (
  reactions: BlogReactionPreview[] | null | undefined,
): BlogReactionPreview[] => {
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

export interface CreatePostViewModelOptions extends CommentTransformOptions {
  commentsVisible?: boolean
}

export const normalizePostTagValue = (value: string) =>
  value
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '')

const normalizeTagValue = normalizePostTagValue

export const resolvePostTags = (
  post: BlogPost | BlogPostViewModel | null | undefined,
): string[] => {
  if (!post) {
    return []
  }

  const source =
    (post as BlogPost & {
      tagList?: unknown
      tagNames?: unknown
      categories?: unknown
    }).tags ??
    (post as { tagList?: unknown }).tagList ??
    (post as { tagNames?: unknown }).tagNames ??
    (post as { categories?: unknown }).categories ??
    []

  const rawTags = resolveStringList(source, ['name', 'title', 'label', 'value'])

  const unique = new Map<string, string>()
  for (const tag of rawTags) {
    const normalized = normalizeTagValue(tag)
    if (!normalized) {
      continue
    }

    const key = normalized.toLowerCase()
    if (!unique.has(key)) {
      unique.set(key, normalized)
    }
  }

  return Array.from(unique.values())
}

const hashtagPattern = /(^|\s)#([\p{L}\p{N}_-]+)/giu

export const extractPostTagsFromText = (value: string): string[] => {
  if (typeof value !== 'string' || !value.trim()) {
    return []
  }

  const matches = value.matchAll(hashtagPattern)
  const unique = new Map<string, string>()

  for (const match of matches) {
    const tagValue = match[2] ?? ''
    const normalized = normalizePostTagValue(tagValue)
    if (!normalized) {
      continue
    }

    const key = normalized.toLowerCase()
    if (!unique.has(key)) {
      unique.set(key, normalized)
    }
  }

  return Array.from(unique.values())
}

export const createPostViewModel = (
  post: BlogPost,
  { currentUserId, commentsVisible = false }: CreatePostViewModelOptions = {},
): BlogPostViewModel => {
  const reactionsPreview = normalizeReactionsPreview(post.reactions_preview)

  const normalizedTitle =
    pickString(
      post.title,
      post.name,
      post.slug,
      post.identifier,
      post.url,
      post.permalink,
      post.link,
      post.href,
    ) ?? ''
  const normalizedSummary = pickString(post.summary, post.description) ?? ''
  const normalizedContent = pickString(post.content) ?? ''

  return {
    ...post,
    title: normalizedTitle,
    reactions_preview: reactionsPreview,
    comments: resolvePostComments(post).map((comment) =>
      createCommentViewModel(comment, { currentUserId }),
    ),
    ui: {
      commentsVisible,
      commentsLoaded: false,
      commentsLoading: false,
      commentsError: null,
      commentContent: '',
      commentLoading: false,
      likeLoading: false,
      deleteLoading: false,
      editDialog: false,
      editForm: {
        title: normalizedTitle,
        summary: normalizedSummary,
        content: normalizedContent,
        loading: false,
      },
    },
  }
}
