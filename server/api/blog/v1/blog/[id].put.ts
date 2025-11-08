import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { Blog, BlogPayload } from '~/types/blog'
import { invalidateBlogDetail, invalidateBlogList } from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du blog')
  const body = await readBody<BlogPayload>(event)

  const response = await requestBlogWithJsonBody<Blog, BlogPayload>(
    event,
    `/blog/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateBlogDetail('blog', id),
    invalidateBlogList('blog'),
  ])

  return response
})
