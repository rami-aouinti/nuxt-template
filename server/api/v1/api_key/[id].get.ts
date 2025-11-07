import { getRouterParam } from 'h3'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {ApiKey} from "~/types/apiKey";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: "Identifiant d'utilisateur manquant" },
    })
  }

  return await broWorldRequest<ApiKey>(event, `/api_key/${id}`)
})
