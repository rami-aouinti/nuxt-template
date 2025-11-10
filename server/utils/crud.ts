import { createError, getRouterParam, type H3Event } from 'h3'

import { broWorldRequest } from './broWorldApi'
import { broWorldBlogRequest } from './broWorldBlogApi'
import { broWorldMediaRequest } from './broWorldMediaApi'

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

export async function requestBlogWithJsonBody<Response, Payload>(
  event: H3Event,
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body: Payload,
) {
  return await broWorldBlogRequest<Response>(event, path, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function requestMediaWithJsonBody<Response, Payload>(
  event: H3Event,
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body: Payload,
) {
  return await broWorldMediaRequest<Response>(event, path, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  })
}
