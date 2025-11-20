import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import {
  invalidateAdminCollection,
  invalidateAdminDetail,
  invalidateAdminCount,
} from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'projet CRM')

  const response = await broWorldCrmRequest(event, `/api/projects/${id}`, {
    method: 'DELETE',
  })

  await invalidateAdminCollection('crm_project')
  await invalidateAdminDetail('crm_project', id)
  await invalidateAdminCount('crm_project')

  return response
})
