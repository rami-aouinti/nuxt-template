import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import type { BlogTag } from '~/types/blogTag'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  return await broWorldBlogRequest<BlogTag[]>(event, `/tag${queryString}`)
})
