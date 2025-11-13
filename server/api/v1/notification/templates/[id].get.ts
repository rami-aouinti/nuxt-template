import type { NotificationTemplate } from '~/types/notification'
import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du modèle de notification')

  return await fetchAdminDetail(event, 'notification_template', id, () =>
    broWorldNotificationRequest<NotificationTemplate>(event, `/templates/${id}`),
  )
})
