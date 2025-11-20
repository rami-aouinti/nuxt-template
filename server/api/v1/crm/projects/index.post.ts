import type { CrmProject, CrmProjectPayload } from '~/types/crm'
import {
  invalidateAdminCollection,
  invalidateAdminCount,
} from '~~/server/utils/cache/admin'
import { requestCrmWithJsonBody } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const payload = await readBody<CrmProjectPayload>(event)

  const response = await requestCrmWithJsonBody<CrmProject, CrmProjectPayload>(
    event,
    '/api/projects',
    'POST',
    payload,
  )

  await invalidateAdminCollection('crm_project')
  await invalidateAdminCount('crm_project')

  return response
})
