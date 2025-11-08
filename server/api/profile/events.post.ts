import type { ProfileEvent, UpsertProfileEventPayload } from '~/types/events'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateProfileEvents } from '~~/server/utils/cache/profile-events'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<UpsertProfileEventPayload>(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: "Le contenu de l'événement est invalide.",
      },
    })
  }

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const start = typeof body.start === 'string' ? body.start : ''

  if (!title || !start) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Les champs titre et date de début sont requis.',
      },
    })
  }

  const payload: UpsertProfileEventPayload = {
    ...body,
    title,
    start,
  }

  const response = await broWorldRequest<ProfileEvent>(
    event,
    '/profile/events',
    {
      method: 'POST',
      body: payload,
    },
  )

  await invalidateProfileEvents(event)

  return response
})
