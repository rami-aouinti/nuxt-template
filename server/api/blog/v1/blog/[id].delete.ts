import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'
import {
  invalidateBlogCollection,
  invalidateBlogDetail,
} from '~~/server/utils/cache/blog'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du blog')

  await broWorldBlogRequest<unknown>(event, `/blog/${id}`, { method: 'DELETE' })

  await Promise.all([
    invalidateBlogDetail('blog', id),
    invalidateBlogCollection('blog'),
  ])

  return { success: true }
})
