import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du groupe d'utilisateurs")

  await broWorldRequest<unknown>(event, `/user_group/${id}`, { method: 'DELETE' })

  return { success: true }
})
