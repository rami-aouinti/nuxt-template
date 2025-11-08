import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import {
  invalidateBlogCollection,
  invalidateBlogDetail,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du commentaire')

  await broWorldBlogRequest<unknown>(event, `/comment/${id}`, {
    method: 'DELETE',
  })

  await Promise.all([
    invalidateBlogDetail('comment', id),
    invalidateBlogCollection('comment'),
  ])

  return { success: true }
})
