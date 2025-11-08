import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { BlogComment, BlogCommentPayload } from '~/types/blogComment'
import {
  invalidateBlogDetail,
  invalidateBlogList,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du commentaire')
  const body = await readBody<BlogCommentPayload>(event)

  const response = await requestBlogWithJsonBody<
    BlogComment,
    BlogCommentPayload
  >(event, `/comment/${id}`, 'PUT', body)

  await Promise.all([
    invalidateBlogDetail('comment', id),
    invalidateBlogList('comment'),
  ])

  return response
})
