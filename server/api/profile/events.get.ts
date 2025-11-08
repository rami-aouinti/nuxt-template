import type { ProfileEvent } from '~/types/events'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return broWorldRequest<ProfileEvent[]>(event, '/profile/events', {
    method: 'GET',
  })
})
