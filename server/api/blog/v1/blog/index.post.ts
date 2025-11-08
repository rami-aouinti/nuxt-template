import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { Blog, BlogPayload } from '~/types/blog'
import { invalidateBlogCollection } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogPayload>(event)

  const response = await requestBlogWithJsonBody<Blog, BlogPayload>(
    event,
    '/blog',
    'POST',
    body,
  )

  await invalidateBlogCollection('blog')

  return response
})
