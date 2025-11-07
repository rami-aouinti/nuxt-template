import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  await broWorldRequest<unknown>(event, `/role/${id}`, { method: 'DELETE' })

  return { success: true }
})
