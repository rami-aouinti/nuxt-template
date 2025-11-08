import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import {
  invalidateBlogCollection,
  invalidateBlogDetail,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'article")

  await broWorldBlogRequest<unknown>(event, `/post/${id}`, { method: 'DELETE' })

  await Promise.all([
    invalidateBlogDetail('post', id),
    invalidateBlogCollection('post'),
  ])

  return { success: true }
})
