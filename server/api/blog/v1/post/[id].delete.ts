import { requireEntityId } from '~~/server/utils/crud'
import { broWorldBlogRequest } from '~~/server/utils/broWorldBlogApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'article")

  await broWorldBlogRequest<unknown>(event, `/post/${id}`, { method: 'DELETE' })

  return { success: true }
})
