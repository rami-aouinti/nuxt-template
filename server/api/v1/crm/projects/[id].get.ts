import type { CrmProject } from '~/types/crm'
import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'projet CRM')

  return await fetchAdminDetail(event, 'crm_project', id, () =>
    broWorldCrmRequest<CrmProject>(event, `/api/projects/${id}`),
  )
})
