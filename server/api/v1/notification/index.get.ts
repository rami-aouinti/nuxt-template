import type { AdminNotification } from '~/types/notification'
import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  return await fetchAdminList(event, 'notification', () =>
    broWorldNotificationRequest<AdminNotification[]>(event, '/notification'),
  )
})
