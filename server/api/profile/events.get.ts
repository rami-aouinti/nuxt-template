import type { ProfileEvent } from '~/types/events'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchProfileEvents } from '~~/server/utils/cache/profile-events'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return await fetchProfileEvents(event, () =>
    broWorldRequest<ProfileEvent[]>(event, '/profile/events', {
      method: 'GET',
    }),
  )
})
