import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'dossier')

  await broWorldRequest<unknown>(event, `/folder/${id}`, { method: 'DELETE' })

  return { success: true }
})
