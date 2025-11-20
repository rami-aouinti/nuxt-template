import type { CrmTask, CrmTaskPayload } from '~/types/crm'
import {
  invalidateAdminCollection,
  invalidateAdminCount,
} from '~~/server/utils/cache/admin'
import { requestCrmWithJsonBody } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const payload = await readBody<CrmTaskPayload>(event)

  const response = await requestCrmWithJsonBody<CrmTask, CrmTaskPayload>(
    event,
    '/api/tasks',
    'POST',
    payload,
  )

  await invalidateAdminCollection('crm_task')
  await invalidateAdminCount('crm_task')

  return response
})
