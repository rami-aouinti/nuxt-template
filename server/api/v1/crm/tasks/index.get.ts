import type { CrmTaskCollection } from '~/types/crm'
import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'crm_task', () =>
    broWorldCrmRequest<CrmTaskCollection>(event, '/api/tasks'),
  )
})
