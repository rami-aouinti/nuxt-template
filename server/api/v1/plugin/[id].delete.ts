import { broWorldRequest } from '~~/server/utils/broWorldApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
} from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du plugin')

  const response = await broWorldRequest<unknown>(event, `/plugin/${id}`, {
    method: 'DELETE',
  })

  await Promise.all([
    invalidateAdminDetail('plugin', id),
    invalidateAdminCollection('plugin'),
  ])

  return response
})
