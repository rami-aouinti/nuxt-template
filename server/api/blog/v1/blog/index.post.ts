import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { Blog, BlogPayload } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogPayload>(event)

  return await requestBlogWithJsonBody<Blog, BlogPayload>(event, '/blog', 'POST', body)
})
