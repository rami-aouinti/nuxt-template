import { getHeader } from 'h3'

import { createServiceClient } from './httpClient'

const BASE_URL = 'https://bro-world.org/api/v1'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API Bro World échouée"

type SessionInput = Record<string, unknown> | null | undefined

type TokenResolver = (session: SessionInput, path: string) => string | null

function extractToken(session: SessionInput, key: string) {
  if (!session || typeof session !== 'object') {
    return null
  }

  const value = session[key]
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  return null
}

export function createBroWorldRequest(
  baseUrl: string,
  defaultErrorMessage = DEFAULT_ERROR_MESSAGE,
  config: { resolveToken?: TokenResolver } = {},
) {
  return createServiceClient({
    baseUrl,
    defaultErrorMessage,
    tokenResolver: (session, path) => {
      if (typeof config.resolveToken === 'function') {
        return config.resolveToken(session, path)
      }

      return extractToken(session, 'token')
    },
    fallbackAuthorizationHeader: event => getHeader(event, 'authorization'),
  })
}

export const broWorldRequest = createServiceClient({
  baseUrl: BASE_URL,
  defaultErrorMessage: DEFAULT_ERROR_MESSAGE,
  fallbackAuthorizationHeader: event => getHeader(event, 'authorization'),
})
