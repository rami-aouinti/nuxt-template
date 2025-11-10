import { createError, getRouterParam } from 'h3'
import type { ProfilePlugin } from '~/types/plugin'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateProfilePlugins } from '~~/server/utils/cache/profile-plugins'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const key = getRouterParam(event, 'key')
  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid plugin key',
      data: { message: 'A valid plugin key must be provided.' },
    })
  }

  const response = await broWorldRequest<
    ProfilePlugin | { active?: boolean } | Record<string, unknown>
  >(event, `/profile/plugin/${encodeURIComponent(key)}/toggle`, {
    method: 'POST',
  })

  await invalidateProfilePlugins(event)

  return response
})
