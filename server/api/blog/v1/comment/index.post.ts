import { requestBlogWithJsonBody } from '~~/server/utils/crud'
import type { BlogComment, BlogCommentPayload } from '~/types/blogComment'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCommentPayload>(event)

  return await requestBlogWithJsonBody<BlogComment, BlogCommentPayload>(
    event,
    '/comment',
    'POST',
    body,
  )
})
