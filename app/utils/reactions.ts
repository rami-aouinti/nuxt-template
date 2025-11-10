import type { BlogReactionPreview, BlogReactionType } from '~/types/blog'

export interface BlogReactionDefinition {
  type: BlogReactionType
  emoji: string
  icon: string
  color?: string
}

export const DEFAULT_REACTION_TYPE: BlogReactionType = 'like'

export const BLOG_REACTIONS: BlogReactionDefinition[] = [
  { type: 'like', emoji: '👍', icon: 'mdi-thumb-up', color: 'primary' },
  { type: 'love', emoji: '❤️', icon: 'mdi-heart', color: 'red' },
  {
    type: 'care',
    emoji: '🤗',
    icon: 'mdi-emoticon-happy-outline',
    color: 'orange',
  },
  {
    type: 'haha',
    emoji: '😂',
    icon: 'mdi-emoticon-excited-outline',
    color: 'yellow-darken-2',
  },
  {
    type: 'wow',
    emoji: '😮',
    icon: 'mdi-emoticon-surprised-outline',
    color: 'amber-darken-2',
  },
  { type: 'sad', emoji: '😢', icon: 'mdi-emoticon-sad-outline', color: 'blue' },
  {
    type: 'angry',
    emoji: '😡',
    icon: 'mdi-emoticon-angry-outline',
    color: 'deep-orange',
  },
]

const BLOG_REACTIONS_BY_TYPE = new Map<
  BlogReactionType,
  BlogReactionDefinition
>(BLOG_REACTIONS.map((reaction) => [reaction.type, reaction]))

export const resolveReactionType = (
  value: string | boolean | null | undefined,
): BlogReactionType | null => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (BLOG_REACTIONS_BY_TYPE.has(normalized as BlogReactionType)) {
      return normalized as BlogReactionType
    }
  }

  if (value === true) {
    return DEFAULT_REACTION_TYPE
  }

  return null
}

export const getReactionDefinition = (
  type: string | null | undefined,
): BlogReactionDefinition | null => {
  if (!type) {
    return null
  }

  const normalized = type.trim().toLowerCase() as BlogReactionType
  return BLOG_REACTIONS_BY_TYPE.get(normalized) ?? null
}

export const normalizeReactionPreview = (
  reaction: BlogReactionPreview | null | undefined,
): BlogReactionPreview | null => {
  if (!reaction || typeof reaction !== 'object') {
    return null
  }

  const type =
    typeof reaction.type === 'string' && reaction.type.trim().length
      ? reaction.type.trim().toLowerCase()
      : DEFAULT_REACTION_TYPE

  return {
    ...reaction,
    id:
      typeof reaction.id === 'string' && reaction.id.trim().length
        ? reaction.id
        : `${reaction.user.id}-${type}`,
    type,
  }
}
