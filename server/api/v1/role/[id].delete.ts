import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  await broWorldRequest<unknown>(event, `/role/${id}`, { method: 'DELETE' })

  await Promise.all([
    invalidateAdminDetail('role', id),
    invalidateAdminCollection('role'),
  ])

  return { success: true }
})
