import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {ApiKey, ApiKeyPayload} from "~/types/apiKey";

export default defineEventHandler(async (event) => {
  const body = await readBody<ApiKeyPayload>(event)

  return await broWorldRequest<ApiKey>(event, '/api_key', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
