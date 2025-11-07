import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du blog')

  await broWorldBlogRequest<unknown>(event, `/blog/${id}`, { method: 'DELETE' })

  return { success: true }
})
