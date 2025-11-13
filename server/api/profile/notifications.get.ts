import { broWorldNotificationRequest } from '~~/server/utils/broWorldNotificationApi'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return await broWorldNotificationRequest<unknown>(
    event,
    '/profile/notifications',
  )
})
