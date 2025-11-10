export const normalizeCollection = <T>(input: unknown): T[] => {
  if (Array.isArray(input)) {
    return input as T[]
  }

  if (input && typeof input === 'object') {
    const record = input as Record<string, unknown>
    const possibleKeys = [
      'data',
      'items',
      'results',
      'rows',
      'entries',
      'hydra:member',
      'hydra:members',
    ]

    for (const key of possibleKeys) {
      const value = record[key]
      if (Array.isArray(value)) {
        return value as T[]
      }
    }
  }

  return []
}
