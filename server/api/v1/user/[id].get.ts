import { getRouterParam } from 'h3'
import type { User } from '~/types/user'
import { broWorldRequest } from '~~/server/utils/broWorldApi'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: "Identifiant d'utilisateur manquant" },
    })
  }

  return await broWorldRequest<User>(event, `/user/${id}`)
})
