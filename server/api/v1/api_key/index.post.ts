import { requestWithJsonBody } from '~~/server/utils/crud'
import type { ApiKey, ApiKeyPayload } from '~/types/apiKey'

export default defineEventHandler(async (event) => {
  const body = await readBody<ApiKeyPayload>(event)

  return await requestWithJsonBody<ApiKey, ApiKeyPayload>(event, '/api_key', 'POST', body)
})
