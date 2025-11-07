import { createError, getRouterParam, type H3Event } from 'h3'

import { broWorldRequest } from './broWorldApi'

export function requireEntityId(event: H3Event, entityLabel: string) {
  const id = getRouterParam(event, 'id')

  if (id) {
    return id
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    data: { message: `Identifiant ${entityLabel} manquant` },
  })
}

export async function requestWithJsonBody<Response, Payload>(
  event: H3Event,
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body: Payload,
) {
  return await broWorldRequest<Response>(event, path, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  })
}
