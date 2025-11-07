import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { Blog, BlogPayload } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du blog')
  const body = await readBody<BlogPayload>(event)

  return await requestBlogWithJsonBody<Blog, BlogPayload>(
    event,
    `/blog/${id}`,
    'PUT',
    body,
  )
})
