import { getRouterParam } from 'h3'
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

  await broWorldRequest<unknown>(event, `/user/${id}`, { method: 'DELETE' })

  return { success: true }
})
