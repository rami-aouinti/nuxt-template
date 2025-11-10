import type { AdminPlugin } from '~/types/plugin'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'plugin', () =>
    broWorldRequest<AdminPlugin[]>(event, '/plugin'),
  )
})
