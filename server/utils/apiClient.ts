import { createServiceClient } from './httpClient'

const DEFAULT_ERROR_MESSAGE = "Requête à l'API Bro World échouée"

export function createApiRequest(baseUrl: string) {
  return createServiceClient({
    baseUrl,
    defaultErrorMessage: DEFAULT_ERROR_MESSAGE,
  })
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
