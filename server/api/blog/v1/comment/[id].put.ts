import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { BlogComment, BlogCommentPayload } from '~/types/blogComment'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du commentaire')
  const body = await readBody<BlogCommentPayload>(event)

  return await requestBlogWithJsonBody<BlogComment, BlogCommentPayload>(
    event,
    `/comment/${id}`,
    'PUT',
    body,
  )
})
