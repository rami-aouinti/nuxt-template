import { getRouterParam } from 'h3'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {UserGroup} from "~/types/userGroup";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: "Identifiant d'utilisateur manquant" },
    })
  }

  return await broWorldRequest<UserGroup>(event, `/user_group/${id}`)
})
