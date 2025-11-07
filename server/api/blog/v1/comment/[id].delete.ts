import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du commentaire')

  await broWorldBlogRequest<unknown>(event, `/comment/${id}`, { method: 'DELETE' })

  return { success: true }
})
