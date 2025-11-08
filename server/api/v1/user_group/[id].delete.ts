import { requireEntityId } from '~~/server/utils/crud'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du groupe d'utilisateurs")

  await broWorldRequest<unknown>(event, `/user_group/${id}`, {
    method: 'DELETE',
  })

  await Promise.all([
    invalidateAdminDetail('user_group', id),
    invalidateAdminCollection('user_group'),
  ])

  return { success: true }
})
