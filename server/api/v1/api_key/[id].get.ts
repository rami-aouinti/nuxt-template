import type { ApiKey } from '~/types/apiKey'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la clé API')

  return await broWorldRequest<ApiKey>(event, `/api_key/${id}`)
})
