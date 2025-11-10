import type { ProfilePlugin } from '~/types/plugin'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return await broWorldRequest<ProfilePlugin[]>(event, '/profile/plugins')
})
