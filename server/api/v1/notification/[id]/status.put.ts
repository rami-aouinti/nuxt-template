import type {
  AdminNotificationDetail,
  NotificationStatusUpdatePayload,
} from '~/types/notification'
import {
  requestNotificationWithJsonBody,
  requireEntityId,
} from '~~/server/utils/crud'
import {
  invalidateAdminDetail,
  invalidateAdminList,
} from '~~/server/utils/cache/admin'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la notification')

  const body = await readBody<NotificationStatusUpdatePayload>(event)

  const response = await requestNotificationWithJsonBody<
    AdminNotificationDetail,
    NotificationStatusUpdatePayload
  >(event, `/notification/${id}/status`, 'PUT', body)

  await Promise.all([
    invalidateAdminDetail('notification', id),
    invalidateAdminList('notification'),
  ])

  return response
})
