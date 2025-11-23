export interface ApiPlatformCollection<T> {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  'hydra:totalItems'?: number
  totalItems?: number
}

export function extractApiPlatformCollectionItems<T>(
  payload: ApiPlatformCollection<T> | T[] | null | undefined,
): T[] {
  if (!payload) {
    return []
  }

  if (Array.isArray(payload)) {
    return payload
  }

  if ('hydra:member' in payload && Array.isArray(payload['hydra:member'])) {
    return payload['hydra:member'] as T[]
  }

  if ('member' in payload && Array.isArray(payload.member)) {
    return payload.member as T[]
  }

  if ('items' in payload && Array.isArray(payload.items)) {
    return payload.items as T[]
  }

  return []
}
