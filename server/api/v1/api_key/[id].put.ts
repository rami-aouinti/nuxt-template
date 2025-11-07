import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { ApiKey, ApiKeyPayload } from '~/types/apiKey'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la clé API')

  const body = await readBody<ApiKeyPayload>(event)

  return await requestWithJsonBody<ApiKey, ApiKeyPayload>(
    event,
    `/api_key/${id}`,
    'PUT',
    body,
  )
})
