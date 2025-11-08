import type { Count } from '~/types/count'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminCount } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminCount(event, 'api_key', () =>
    broWorldRequest<Count>(event, '/api_key/count'),
  )
})
