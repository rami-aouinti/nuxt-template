import { getRouterParam } from 'h3'
import type { UserGroup, UserGroupPayload } from '~/types/userGroup'
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

  const body = await readBody<UserGroupPayload>(event)

  return await broWorldRequest<UserGroup>(event, `/user_group/${id}`, {
    method: 'PUT',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
