import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { BlogTag, BlogTagPayload } from '~/types/blogTag'
import { invalidateBlogCollection } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogTagPayload>(event)

  const response = await requestBlogWithJsonBody<BlogTag, BlogTagPayload>(
    event,
    '/tag',
    'POST',
    body,
  )

  await invalidateBlogCollection('tag')

  return response
})
