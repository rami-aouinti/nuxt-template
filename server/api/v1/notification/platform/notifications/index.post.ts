import type { NotificationCreatePayload } from '~/types/notification'
import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'
import { invalidateAdminCollection } from '~~/server/utils/cache/admin'
import { buildNotificationFormData } from '~~/server/utils/notification'

export default defineEventHandler(async (event) => {
  const payload =
    (await readBody<Partial<NotificationCreatePayload>>(event)) ?? {}

  const formData = buildNotificationFormData(payload)

  const response = await broWorldNotificationRequest<string>(
    event,
    '/platform/notifications',
    {
      method: 'POST',
      body: formData,
    },
  )

  await invalidateAdminCollection('notification')

  return response
})
