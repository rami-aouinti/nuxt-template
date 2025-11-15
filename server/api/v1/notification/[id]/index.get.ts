import type { AdminNotificationDetail } from '~/types/notification'
import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la notification')

  return await fetchAdminDetail(event, 'notification', id, () =>
    broWorldNotificationRequest<AdminNotificationDetail>(
      event,
      `/notifications/${id}`,
    ),
  )
})
