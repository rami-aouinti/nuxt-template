import type { ProfileEvent, UpsertProfileEventPayload } from '~/types/events'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateProfileEvents } from '~~/server/utils/cache/profile-events'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<UpsertProfileEventPayload>(event)

  if (!body || typeof body !== 'object' || !body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: "L'identifiant de l'événement est requis pour la mise à jour.",
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
      method: 'PUT',
      body: payload,
    },
  )

  await invalidateProfileEvents(event)

  return response
})
