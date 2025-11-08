import type { Count } from '~/types/count'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import { fetchBlogCount } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  return await fetchBlogCount(event, 'tag', () =>
    broWorldBlogRequest<Count | number>(event, '/tag/count'),
  )
})
