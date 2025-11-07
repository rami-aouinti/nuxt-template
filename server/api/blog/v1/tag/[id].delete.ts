import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du tag')

  await broWorldBlogRequest<unknown>(event, `/tag/${id}`, { method: 'DELETE' })

  return { success: true }
})
