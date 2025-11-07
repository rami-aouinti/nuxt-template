import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { BlogTag, BlogTagPayload } from '~/types/blogTag'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du tag')
  const body = await readBody<BlogTagPayload>(event)

  return await requestBlogWithJsonBody<BlogTag, BlogTagPayload>(
    event,
    `/tag/${id}`,
    'PUT',
    body,
  )
})
