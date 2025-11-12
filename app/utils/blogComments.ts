import type { BlogComment, BlogCommentLike, BlogPostUser } from '~/types/blog'

function isValidUser(value: unknown): value is BlogPostUser {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as { id?: unknown }
  return typeof record.id === 'string' && record.id.trim().length > 0
}

function toArray<T>(
  value: unknown,
  keys: string[],
  predicate: (item: unknown) => item is T,
): T[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(predicate)
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>

    for (const key of keys) {
      if (key in record) {
        const nested = toArray(record[key], keys, predicate)
        if (nested.length || Array.isArray(record[key])) {
          return nested
        }
      }
    }
  }

  return []
}

export function extractCommentLikes(value: unknown): BlogCommentLike[] {
  return toArray<BlogCommentLike>(
    value,
    ['data', 'items', 'results', 'likes'],
    (item): item is BlogCommentLike => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const record = item as BlogCommentLike
      return isValidUser(record.user ?? null)
    },
  )
}

export function extractCommentList(value: unknown): BlogComment[] {
  return toArray<BlogComment>(
    value,
    ['data', 'items', 'results', 'comments', 'children', 'edges', 'nodes'],
    (item): item is BlogComment => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const record = item as BlogComment
      return typeof record.id === 'string' && isValidUser(record.user ?? null)
    },
  )
}
