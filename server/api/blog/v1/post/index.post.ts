import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { BlogPost, BlogPostPayload } from '~/types/blogPost'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogPostPayload>(event)

  return await requestBlogWithJsonBody<BlogPost, BlogPostPayload>(
    event,
    '/post',
    'POST',
    body,
  )
})
