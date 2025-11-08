import { createError, getRouterParam } from 'h3'

import type { PublicProfileData } from '~/types/profile'

import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { fetchPublicProfile } from '~~/server/utils/cache/profile-public'

function sanitizeUsername(value: string | undefined | null) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

export default defineEventHandler(async (event) => {
  const rawUsername = getRouterParam(event, 'username')
  const username = sanitizeUsername(rawUsername)

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid username',
      data: { message: 'A valid username must be provided.' },
    })
  }

  return await fetchPublicProfile(event, username, () =>
    broWorldRequest<PublicProfileData>(
      event,
      `/profile/${encodeURIComponent(username)}`,
    ),
  )
})
