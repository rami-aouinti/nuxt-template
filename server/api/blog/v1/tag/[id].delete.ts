import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import {
  invalidateBlogCollection,
  invalidateBlogDetail,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du tag')

  await broWorldBlogRequest<unknown>(event, `/tag/${id}`, { method: 'DELETE' })

  await Promise.all([
    invalidateBlogDetail('tag', id),
    invalidateBlogCollection('tag'),
  ])

  return { success: true }
})
