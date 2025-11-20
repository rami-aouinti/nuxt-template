import type { Count } from '~/types/count'
import type { CrmTaskCollection } from '~/types/crm'
import { broWorldCrmRequest } from '~~/server/utils/broWorldCrmApi'
import { fetchAdminCount } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminCount<Count>(event, 'crm_task', async () => {
    const collection = await broWorldCrmRequest<CrmTaskCollection>(
      event,
      '/api/tasks',
    )
    const count = Number(
      collection.totalItems ?? collection.member?.length ?? 0,
    )

    return { count: String(count) }
  })
})
