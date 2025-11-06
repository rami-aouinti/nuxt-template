import { getRouterParam } from 'h3'
import type { User, UserPayload } from '~/types/user'
import { broWorldRequest } from '~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: "Identifiant d'utilisateur manquant" },
    })
  }

  const body = await readBody<UserPayload>(event)

  return await broWorldRequest<User>(event, `/user/${id}`, {
    method: 'PUT',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
