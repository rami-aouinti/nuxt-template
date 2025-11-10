import { broWorldMediaRequest } from '~~/server/utils/broWorldMediaApi'
import { requireEntityId } from '~~/server/utils/crud'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du média')

  const response = await broWorldMediaRequest(event, `/media/${id}`, {
    method: 'DELETE',
  })

  await invalidateAdminCollection('media')

  return response
})
