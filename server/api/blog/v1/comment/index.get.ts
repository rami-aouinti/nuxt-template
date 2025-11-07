import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import type { BlogComment } from '~/types/blogComment'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  return await broWorldBlogRequest<BlogComment[]>(event, `/comment${queryString}`)
})
