import type { AdminNotificationDetail } from '~/types/notification'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchAdminDetail } from '~~/server/utils/cache/admin'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'de la notification')

  return await fetchAdminDetail(event, 'notification', id, () =>
    broWorldRequest<AdminNotificationDetail>(event, `/notification/${id}`),
  )
})
