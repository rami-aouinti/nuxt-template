import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la clé API')

  await broWorldRequest<unknown>(event, `/api_key/${id}`, { method: 'DELETE' })

  return { success: true }
})
