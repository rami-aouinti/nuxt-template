import type { NotificationTemplateUploadResponse } from '~/types/notification'
import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const response =
    await broWorldNotificationRequest<NotificationTemplateUploadResponse>(
      event,
      '/platform/templates/upload',
      {
        method: 'POST',
      },
    )

  if (response.status === 'success') {
    await invalidateAdminCollection('notification_template')
  }

  return response
})
