import type { CrmTask, CrmTaskPayload } from '~/types/crm'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
  invalidateAdminCount,
} from '~~/server/utils/cache/admin'
import { requestCrmWithJsonBody, requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'tâche CRM')
  const payload = await readBody<CrmTaskPayload>(event)

  const response = await requestCrmWithJsonBody<CrmTask, CrmTaskPayload>(
    event,
    `/api/tasks/${id}`,
    'PUT',
    payload,
  )

  await invalidateAdminCollection('crm_task')
  await invalidateAdminDetail('crm_task', id)
  await invalidateAdminCount('crm_task')

  return response
})
