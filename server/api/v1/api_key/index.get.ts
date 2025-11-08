import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'
import type { ApiKey } from '~/types/apiKey'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'api_key', () =>
    broWorldRequest<ApiKey[]>(event, '/api_key'),
  )
})
