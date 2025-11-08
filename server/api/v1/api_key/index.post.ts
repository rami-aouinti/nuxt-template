import { requestWithJsonBody } from '~~/server/utils/crud'
import type { ApiKey, ApiKeyPayload } from '~/types/apiKey'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<ApiKeyPayload>(event)

  const response = await requestWithJsonBody<ApiKey, ApiKeyPayload>(
    event,
    '/api_key',
    'POST',
    body,
  )

  await invalidateAdminCollection('api_key')

  return response
})
