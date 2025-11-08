import type { H3Event } from 'h3'
import { FetchError, type FetchOptions } from 'ofetch'

const BASE_URL = 'https://bro-world.org/api/v1'
const DEFAULT_ERROR_MESSAGE = "Requête à l'API Bro World échouée"

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

export function createBroWorldRequest(
  baseUrl: string,
  defaultErrorMessage = DEFAULT_ERROR_MESSAGE,
) {
  return async function broWorldRequest<T>(
    event: H3Event,
    path: string,
    options: FetchOptions<'json'> = {},
  ): Promise<T> {
    const session = await getUserSession(event)
    const token = session?.token
    const { headers: providedHeaders, ...restOptions } = options

    const headers = normalizeHeaders(providedHeaders)
    if (token) {
      headers.Authorization = `Bearer ${token}`
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
