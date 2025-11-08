import { requestWithJsonBody, requireEntityId } from '~~/server/utils/crud'
import type { ApiKey, ApiKeyPayload } from '~/types/apiKey'
import { invalidateAdminDetail, invalidateAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la clé API')

  const body = await readBody<ApiKeyPayload>(event)

  const response = await requestWithJsonBody<ApiKey, ApiKeyPayload>(
    event,
    `/api_key/${id}`,
    'PUT',
    body,
  )

  await Promise.all([
    invalidateAdminDetail('api_key', id),
    invalidateAdminList('api_key'),
  ])

  return response
})
