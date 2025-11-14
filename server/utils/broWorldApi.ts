import type { H3Event } from 'h3'
import { FetchError, type FetchOptions } from 'ofetch'

const BASE_URL = 'https://bro-world.org/api/v1'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API Bro World échouée"

type SessionInput = Record<string, unknown> | null | undefined

type TokenResolver = (session: SessionInput, path: string) => string | null

type HeadersInput = FetchOptions<'json'>['headers']

function normalizeHeaders(headers?: HeadersInput): Record<string, string> {
  const normalized: Record<string, string> = {}

  if (!headers) {
    return normalized
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key] = value
    })
    return normalized
  }

  if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      normalized[key] = value
    }
    return normalized
  }

  return { ...headers }
}

function extractErrorMessage(data: unknown): string | null {
  if (!data) {
    return null
  }

  if (typeof data === 'string') {
    return data
  }

  if (typeof data === 'object') {
    if ('message' in data && typeof data.message === 'string') {
      return data.message
    }
    if ('error' in data && typeof data.error === 'string') {
      return data.error
    }
  }

  return null
}

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
  return async function broWorldRequest<T>(
    event: H3Event,
    path: string,
    requestOptions: FetchOptions<'json'> = {},
  ): Promise<T> {
    const session = await getUserSession(event)
    const resolvedToken =
      typeof config.resolveToken === 'function'
        ? config.resolveToken(session as SessionInput, path)
        : extractToken(session as SessionInput, 'token')
    const { headers: providedHeaders, ...restOptions } = requestOptions

    const headers = normalizeHeaders(providedHeaders)
    if (resolvedToken) {
      headers.Authorization = `Bearer ${resolvedToken}`
    }

    try {
      return await $fetch<T>(`${baseUrl}${path}`, {
        ...restOptions,
        headers,
      })
    } catch (error) {
      if (error instanceof FetchError && error.response) {
        const message =
          extractErrorMessage(error.data) ||
          error.response.statusText ||
          defaultErrorMessage

        throw createError({
          statusCode: error.response.status,
          statusMessage: error.response.statusText || 'API request failed',
          data: { message },
        })
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'API request failed',
        data: {
          message: error instanceof Error ? error.message : defaultErrorMessage,
        },
      })
    }
  }
}

export const broWorldRequest = createBroWorldRequest(BASE_URL)
