import { getRouterParam } from 'h3'
import type { Role, RolePayload } from '~/types/role'
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

  const body = await readBody<RolePayload>(event)

  return await broWorldRequest<Role>(event, `/role/${id}`, {
    method: 'PUT',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
