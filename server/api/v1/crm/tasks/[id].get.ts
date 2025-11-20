import type { CrmTask } from '~/types/crm'
import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'tâche CRM')

  return await fetchAdminDetail(event, 'crm_task', id, () =>
    broWorldCrmRequest<CrmTask>(event, `/api/tasks/${id}`),
  )
})
