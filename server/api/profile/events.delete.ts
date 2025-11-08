import { broWorldRequest } from '~~/server/utils/broWorldApi'

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

  return broWorldRequest(event, '/profile/events', {
    method: 'DELETE',
    body: { id },
  })
})
