import type { AdminPlugin } from '~/types/plugin'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du plugin')

  return await fetchAdminDetail(event, 'plugin', id, () =>
    broWorldRequest<AdminPlugin>(event, `/plugin/${id}`),
  )
})
