import type { NotificationBatchPayload } from '~/types/notification'
import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'
import { buildNotificationBatchFormData } from '~~/server/utils/notification'

export default defineEventHandler(async (event) => {
  const payload =
    (await readBody<Partial<NotificationBatchPayload>>(event)) ?? {}

  const formData = buildNotificationBatchFormData(payload)

  const response = await broWorldNotificationRequest<string>(
    event,
    '/platform/notifications/batch',
    {
      method: 'POST',
      body: formData,
    },
  )

  await invalidateAdminCollection('notification')

  return response
})
