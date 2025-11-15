import { createError, getRouterParam, type H3Event } from 'h3'

import { broWorldRequest } from './broWorldApi'
import { broWorldBlogRequest } from './broWorldBlogApi'
import { broWorldMediaRequest } from './broWorldMediaApi'
import { broWorldFrontendRequest } from './broWorldFrontendApi'
import { broWorldNotificationRequest } from './broWorldNotificationApi'

export function requireRouteParam(
  event: H3Event,
  paramName: string,
  errorMessage: string,
  _entityLabel: string,
) {
  const value = getRouterParam(event, paramName)

  if (value) {
    return value
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request',
    data: { message: errorMessage },
  })
}

export function requireEntityId(event: H3Event, entityLabel: string) {
  return requireRouteParam(event, 'id', `Identifiant ${entityLabel} manquant`)
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

export async function requestNotificationWithJsonBody<Response, Payload>(
  event: H3Event,
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body: Payload,
) {
  return await broWorldNotificationRequest<Response>(event, path, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function requestFrontendWithJsonBody<Response, Payload>(
  event: H3Event,
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body: Payload,
) {
  return await broWorldFrontendRequest<Response>(event, path, {
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
