import type { Count } from '~/types/count'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogCount } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  return await fetchBlogCount(event, 'blog', () =>
    broWorldBlogRequest<Count | number>(event, '/blog/count'),
  )
})
