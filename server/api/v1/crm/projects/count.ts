import type { Count } from '~/types/count'
import type { CrmProjectCollection } from '~/types/crm'
import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import { fetchAdminCount } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminCount<Count>(event, 'crm_project', async () => {
    const collection = await broWorldCrmRequest<CrmProjectCollection>(
      event,
      '/api/projects',
    )
    const count = Number(
      collection.totalItems ?? collection.member?.length ?? 0,
    )

    return { count: String(count) }
  })
})
