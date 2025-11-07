export type HeaderValues = string | string[] | null | undefined
export type HeaderRecord = Record<string, HeaderValues>
export type NormalizableHeaders =
  | HeaderRecord
  | Headers
  | Array<[string, string]> 
  | undefined
  | null

function assignHeader(
  target: Record<string, string>,
  key: string,
  value: HeaderValues,
) {
  if (value == null) {
    return
  }

  target[key] = Array.isArray(value) ? value.join(', ') : String(value)
}

export function normalizeRequestHeaders(
  headers: NormalizableHeaders,
): Record<string, string> | undefined {
  if (!headers) {
    return undefined
  }

  const normalized: Record<string, string> = {}

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      assignHeader(normalized, key, value)
    })
    return Object.keys(normalized).length > 0 ? normalized : undefined
  }

  if (Array.isArray(headers)) {
    for (const [key, value] of headers) {
      assignHeader(normalized, key, value)
    }
    return Object.keys(normalized).length > 0 ? normalized : undefined
  }

  for (const [key, value] of Object.entries(headers)) {
    assignHeader(normalized, key, value)
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}
