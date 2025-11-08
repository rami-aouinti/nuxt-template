import { getQuery } from 'h3'

import type { BlogPostListResponse } from '~/types/blog'

import { broWorldBlogProfileRequest } from '~~/server/utils/broWorldBlogProfileApi'
import { fetchProfilePosts } from '~~/server/utils/cache/profile-posts'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

function toPositiveInteger(value: unknown, fallback: number) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value)
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }

  return fallback
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const query = getQuery(event)
  const page = toPositiveInteger(query.page, DEFAULT_PAGE)
  const limit = toPositiveInteger(query.limit, DEFAULT_LIMIT)

  return await fetchProfilePosts(event, page, limit, () =>
    broWorldBlogProfileRequest<BlogPostListResponse>(
      event,
      '/profile/post',
      {
        params: { page, limit },
      },
    ),
  )
})
