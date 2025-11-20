import type { CrmProject, CrmProjectPayload } from '~/types/crm'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
  invalidateAdminCount,
} from '~~/server/utils/cache/admin'
import { requestCrmWithJsonBody, requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'projet CRM')
  const payload = await readBody<CrmProjectPayload>(event)

  const response = await requestCrmWithJsonBody<CrmProject, CrmProjectPayload>(
    event,
    `/api/projects/${id}`,
    'PUT',
    payload,
  )

  await invalidateAdminCollection('crm_project')
  await invalidateAdminDetail('crm_project', id)
  await invalidateAdminCount('crm_project')

  return response
})
