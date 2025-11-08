import { broWorldRequest } from '~~/server/utils/broWorldApi'
import { invalidateProfileEvents } from '~~/server/utils/cache/profile-events'

interface DeletePayload {
  id?: string
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<DeletePayload>(event)

  const id = typeof body?.id === 'string' ? body.id.trim() : ''

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: "L'identifiant de l'événement est requis pour la suppression.",
      },
    })
  }

  const response = await broWorldRequest(event, '/profile/events', {
    method: 'DELETE',
    body: { id },
  })

  await invalidateProfileEvents(event)

  return response
})
