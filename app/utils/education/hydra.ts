export type HydraCollection<T> = {
  'hydra:member'?: T[]
  hydraMember?: T[]
  'hydra:totalItems'?: number
  hydraTotalItems?: number
}

export function extractHydraMembers<T>(
  payload?: HydraCollection<T> | T[] | null,
) {
  if (!payload) return [] as T[]

  if (Array.isArray(payload)) return payload

  return payload.hydraMember ?? payload['hydra:member'] ?? []
}

export function extractHydraTotal(
  payload?: HydraCollection<unknown> | unknown[] | null,
) {
  if (!payload) return 0

  if (Array.isArray(payload)) return payload.length

  return payload.hydraTotalItems ?? payload['hydra:totalItems'] ?? 0
}
