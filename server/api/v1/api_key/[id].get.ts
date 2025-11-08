import type { ApiKey } from '~/types/apiKey'
import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la clé API')

  return await fetchAdminDetail(event, 'api_key', id, () =>
    broWorldRequest<ApiKey>(event, `/api_key/${id}`),
  )
})
