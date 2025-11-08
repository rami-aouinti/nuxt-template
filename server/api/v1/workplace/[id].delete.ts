import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du rôle')

  await broWorldRequest<unknown>(event, `/workplace/${id}`, {
    method: 'DELETE',
  })

  await Promise.all([
    invalidateAdminDetail('workplace', id),
    invalidateAdminCollection('workplace'),
  ])

  return { success: true }
})
