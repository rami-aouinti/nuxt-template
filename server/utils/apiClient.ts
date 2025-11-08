import type { H3Event } from 'h3'
import { FetchError, type FetchOptions } from 'ofetch'

export type HeadersInput = FetchOptions<'json'>['headers']

type ApiRequestOptions = FetchOptions<'json'>

type ApiRequest<T> = (
  event: H3Event,
  path: string,
  options?: ApiRequestOptions,
) => Promise<T>

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
    if (
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
    ) {
      return (data as { message: string }).message
    }
    if (
      'error' in data &&
      typeof (data as { error?: unknown }).error === 'string'
    ) {
      return (data as { error: string }).error
    }
  }

  return null
}

export function createApiRequest(baseUrl: string): ApiRequest<unknown>
export function createApiRequest<T>(baseUrl: string): ApiRequest<T>
export function createApiRequest<T>(baseUrl: string): ApiRequest<T> {
  return async function apiRequest(
    event: H3Event,
    path: string,
    options: ApiRequestOptions = {},
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
          "Requête à l'API Bro World échouée"

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
          message:
            error instanceof Error
              ? error.message
              : "Requête à l'API Bro World échouée",
        },
      })
    }
  }
}

export function buildQueryString(
  query: Record<string, unknown> | undefined,
): string {
  if (!query) {
    return ''
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value == null) {
      continue
    }

    if (Array.isArray(value)) {
      for (const element of value) {
        if (element != null) {
          searchParams.append(key, String(element))
        }
      }
      continue
    }

    searchParams.append(key, String(value))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
