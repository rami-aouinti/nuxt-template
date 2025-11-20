import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
  invalidateAdminCount,
} from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'tâche CRM')

  const response = await broWorldCrmRequest(event, `/api/tasks/${id}`, {
    method: 'DELETE',
  })

  await invalidateAdminCollection('crm_task')
  await invalidateAdminDetail('crm_task', id)
  await invalidateAdminCount('crm_task')

  return response
})
