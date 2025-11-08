import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'utilisateur")

  await broWorldRequest<unknown>(event, `/user/${id}`, { method: 'DELETE' })

  await Promise.all([
    invalidateAdminDetail('user', id),
    invalidateAdminCollection('user'),
  ])

  return { success: true }
})
