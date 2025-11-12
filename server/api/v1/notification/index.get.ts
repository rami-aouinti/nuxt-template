import type { AdminNotification } from '~/types/notification'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'notification', () =>
    broWorldRequest<AdminNotification[]>(event, '/notification'),
  )
})
