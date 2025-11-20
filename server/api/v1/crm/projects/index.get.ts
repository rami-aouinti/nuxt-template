import type { CrmProjectCollection } from '~/types/crm'
import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'crm_project', () =>
    broWorldCrmRequest<CrmProjectCollection>(event, '/api/projects'),
  )
})
