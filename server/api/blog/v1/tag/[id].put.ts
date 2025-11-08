import { requestBlogWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { BlogTag, BlogTagPayload } from '~/types/blogTag'
import {
  invalidateBlogDetail,
  invalidateBlogList,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du tag')
  const body = await readBody<BlogTagPayload>(event)

  const response = await requestBlogWithJsonBody<BlogTag, BlogTagPayload>(
    event,
    `/tag/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateBlogDetail('tag', id),
    invalidateBlogList('tag'),
  ])

  return response
})
