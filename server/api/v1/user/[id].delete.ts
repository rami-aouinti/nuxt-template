import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'utilisateur")

  await broWorldRequest<unknown>(event, `/user/${id}`, { method: 'DELETE' })

  return { success: true }
})
