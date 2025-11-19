import { normalizeRequestHeaders } from '~/utils/headers'

const DEFAULT_HEADER_NAMES = ['cookie', 'authorization'] as const

type HeaderNames = string[] | readonly string[] | undefined

export function useServerRequestHeaders(
  names?: HeaderNames,
): Record<string, string> | undefined {
  if (!import.meta.server) {
    return undefined
  }

  return normalizeRequestHeaders(
    useRequestHeaders(names as string[] | undefined),
  )
}

export function useServerAuthRequestHeaders():
  | Record<string, string>
  | undefined {
  return useServerRequestHeaders(DEFAULT_HEADER_NAMES)
}
