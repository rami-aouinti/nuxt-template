import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la clé API')

  await broWorldRequest<unknown>(event, `/api_key/${id}`, { method: 'DELETE' })

  await Promise.all([
    invalidateAdminDetail('api_key', id),
    invalidateAdminCollection('api_key'),
  ])

  return { success: true }
})
