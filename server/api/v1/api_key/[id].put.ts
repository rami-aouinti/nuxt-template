import { getRouterParam } from 'h3'
import { broWorldRequest } from '~~/server/utils/broWorldApi'
import type {ApiKey, ApiKeyPayload} from "~/types/apiKey";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: "Identifiant d'utilisateur manquant" },
    })
  }

  const body = await readBody<ApiKeyPayload>(event)

  return await broWorldRequest<ApiKey>(event, `/api_key/${id}`, {
    method: 'PUT',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
})
