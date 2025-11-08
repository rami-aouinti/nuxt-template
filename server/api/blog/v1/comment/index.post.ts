import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { BlogComment, BlogCommentPayload } from '~/types/blogComment'
import { invalidateBlogCollection } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCommentPayload>(event)

  const response = await requestBlogWithJsonBody<BlogComment, BlogCommentPayload>(
    event,
    '/comment',
    'POST',
    body,
  )

  await invalidateBlogCollection('comment')

  return response
})
