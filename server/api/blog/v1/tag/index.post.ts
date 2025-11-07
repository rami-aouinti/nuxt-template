import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { BlogTag, BlogTagPayload } from '~/types/blogTag'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogTagPayload>(event)

  return await requestBlogWithJsonBody<BlogTag, BlogTagPayload>(event, '/tag', 'POST', body)
})
