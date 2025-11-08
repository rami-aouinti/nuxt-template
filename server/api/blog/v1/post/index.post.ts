import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { BlogPost, BlogPostPayload } from '~/types/blogPost'
import { invalidateBlogCollection } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogPostPayload>(event)

  const response = await requestBlogWithJsonBody<BlogPost, BlogPostPayload>(
    event,
    '/post',
    'POST',
    body,
  )

  await invalidateBlogCollection('post')

  return response
})
