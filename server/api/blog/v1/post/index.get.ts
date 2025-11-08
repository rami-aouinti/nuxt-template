import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogList } from '~~/server/utils/cache/blog'
import type { BlogPost } from '~/types/blogPost'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  return await fetchBlogList(event, 'post', queryString, () =>
    broWorldBlogRequest<BlogPost[]>(event, `/post${queryString}`),
  )
})
