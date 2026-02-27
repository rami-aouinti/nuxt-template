import type { H3Event } from 'h3'
import { FetchError, type FetchOptions } from 'ofetch'

export type HeadersInput = FetchOptions<'json'>['headers']
export type ServiceRequestOptions = FetchOptions<'json'>

type SessionInput = Record<string, unknown> | null | undefined

type TokenResolver = (
  session: SessionInput,
  path: string,
  event: H3Event,
) => string | null | Promise<string | null>

export type ServiceClientOptions = {
  baseUrl: string
  defaultErrorMessage: string
  tokenResolver?: TokenResolver
  fallbackAuthorizationHeader?: (event: H3Event) => string | null | undefined
}

export type ServiceClientRequest<T> = (
  event: H3Event,
  path: string,
  options?: ServiceRequestOptions,
) => Promise<T>

export function normalizeHeaders(
  headers?: HeadersInput,
): Record<string, string> {
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
    if ('error' in data && typeof (data as { error?: unknown }).error === 'string') {
      return (data as { error: string }).error
    }
  }

  return null
}

function extractSessionToken(session: SessionInput): string | null {
  if (!session || typeof session !== 'object') {
    return null
  }

  const token = session.token
  return typeof token === 'string' && token.trim().length > 0 ? token : null
}

export function mapFetchErrorToCreateError(
  error: unknown,
  defaultErrorMessage: string,
) {
  if (error instanceof FetchError && error.response) {
    const message =
      extractErrorMessage(error.data) ||
      error.response.statusText ||
      defaultErrorMessage

    return createError({
      statusCode: error.response.status,
      statusMessage: error.response.statusText || 'API request failed',
      data: { message },
    })
  }

  return createError({
    statusCode: 500,
    statusMessage: 'API request failed',
    data: {
      message: error instanceof Error ? error.message : defaultErrorMessage,
    },
  })
}

export function createServiceClient({
  baseUrl,
  defaultErrorMessage,
  tokenResolver,
  fallbackAuthorizationHeader,
}: ServiceClientOptions) {
  return async function serviceRequest<T>(
    event: H3Event,
    path: string,
    options: ServiceRequestOptions = {},
  ): Promise<T> {
    const session = (await getUserSession(event)) as SessionInput
    const resolvedToken = tokenResolver
      ? await tokenResolver(session, path, event)
      : extractSessionToken(session)

    const { headers: providedHeaders, ...restOptions } = options
    const headers = normalizeHeaders(providedHeaders)

    if (resolvedToken) {
      headers.Authorization = `Bearer ${resolvedToken}`
    } else {
      const headerValue = fallbackAuthorizationHeader?.(event)?.trim()
      if (headerValue) {
        headers.Authorization = headerValue
      }
    }

    try {
      return await $fetch<T>(`${baseUrl}${path}`, {
        ...restOptions,
        headers,
      })
    } catch (error) {
      throw mapFetchErrorToCreateError(error, defaultErrorMessage)
    }
  }
}
