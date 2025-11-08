import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogList } from '~~/server/utils/cache/blog'
import type { Blog } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  return await fetchBlogList(event, 'blog', queryString, () =>
    broWorldBlogRequest<Blog[]>(event, `/blog${queryString}`),
  )
})
