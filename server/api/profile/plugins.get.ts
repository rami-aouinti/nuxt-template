import type { ProfilePlugin } from '~/types/plugin'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchProfilePlugins } from '~~/server/utils/cache/profile-plugins'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return await fetchProfilePlugins(event, () =>
    broWorldRequest<ProfilePlugin[]>(event, '/profile/plugins'),
  )
})
