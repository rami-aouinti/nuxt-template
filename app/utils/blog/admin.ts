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

export const toNonEmptyString = (value: unknown): string | null => {
  if (value == null) {
    return null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return null
}

export const pickString = (...values: unknown[]): string | null => {
  for (const value of values) {
    const candidate = toNonEmptyString(value)
    if (candidate) {
      return candidate
    }
  }

  return null
}

export const resolveUserName = (value: unknown): string | null => {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return toNonEmptyString(value)
  }

  if (typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>

  const firstName = pickString(
    record.firstName,
    record.firstname,
    record.first_name,
    record.givenName,
    record.given_name,
  )
  const lastName = pickString(
    record.lastName,
    record.lastname,
    record.last_name,
    record.familyName,
    record.family_name,
  )

  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim()
  }

  const fullName = pickString(
    record.fullName,
    record.full_name,
    record.displayName,
    record.display_name,
    record.name,
  )

  if (fullName) {
    return fullName
  }

  const username = pickString(record.username, record.handle, record.email)
  if (username) {
    return username
  }

  return null
}

export const resolveStringList = (
  value: unknown,
  keys: string[] = ['name', 'title', 'label'],
): string[] => {
  if (!value) {
    return []
  }

  const result: string[] = []

  const pushValue = (entry: unknown) => {
    if (entry == null) {
      return
    }

    if (
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'bigint'
    ) {
      const normalized = toNonEmptyString(entry)
      if (normalized) {
        result.push(normalized)
      }
      return
    }

    if (typeof entry === 'object') {
      const record = entry as Record<string, unknown>
      for (const key of keys) {
        const candidate = toNonEmptyString(record[key])
        if (candidate) {
          result.push(candidate)
          return
        }
      }

      if (Array.isArray(record.data)) {
        record.data.forEach(pushValue)
      }
    }
  }

  if (Array.isArray(value)) {
    value.forEach(pushValue)
    return result
  }

  pushValue(value)

  return result
}

const POSITIVE_STATUS_VALUES = new Set([
  'visible',
  'public',
  'published',
  'active',
  'enabled',
  'approved',
  'open',
])

const NEGATIVE_STATUS_VALUES = new Set([
  'hidden',
  'private',
  'draft',
  'inactive',
  'disabled',
  'archived',
  'pending',
  'closed',
])

export const resolveVisibilityFlag = (
  entity: Record<string, unknown> | null | undefined,
): boolean => {
  if (!entity) {
    return false
  }

  const booleanKeys = [
    'visible',
    'isVisible',
    'isPublished',
    'published',
    'enabled',
    'active',
  ]
  for (const key of booleanKeys) {
    const value = entity[key]
    if (typeof value === 'boolean') {
      return value
    }
  }

  if (typeof entity.hidden === 'boolean') {
    return !entity.hidden
  }

  const stringKeys = ['visibility', 'status', 'state']
  for (const key of stringKeys) {
    const raw = entity[key]
    if (typeof raw === 'string') {
      const normalized = raw.toLowerCase()
      if (POSITIVE_STATUS_VALUES.has(normalized)) {
        return true
      }
      if (NEGATIVE_STATUS_VALUES.has(normalized)) {
        return false
      }
    }
  }

  const publishedValue = pickString(
    entity['publishedAt'],
    entity['published_at'],
    entity['publicationDate'],
    entity['publishedOn'],
  )

  if (publishedValue) {
    return true
  }

  return false
}

export const toNumeric = (value: unknown): number | null => {
  if (Array.isArray(value)) {
    return value.length
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>

    const numericKeys = ['count', 'total', 'value', 'length']
    for (const key of numericKeys) {
      const candidate = record[key]
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return candidate
      }
      if (typeof candidate === 'string') {
        const parsed = Number(candidate)
        if (Number.isFinite(parsed)) {
          return parsed
        }
      }
    }
  }

  return null
}

export const resolveNumericValue = (value: unknown, fallback = 0): number => {
  const numeric = toNumeric(value)
  return numeric ?? fallback
}

export const resolveFirstAvailableNumber = (
  values: unknown[],
  fallback = 0,
): number => {
  for (const value of values) {
    const numeric = toNumeric(value)
    if (numeric != null) {
      return numeric
    }
  }

  return fallback
}

export const resolvePostTitle = (value: unknown): string | null => {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return toNonEmptyString(value)
  }

  if (typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>
  return pickString(record.title, record.name, record.slug)
}

const DEFAULT_POST_BASE_URL = 'https://blog.bro-world.org/post/'

const buildUrl = (path: string, base: string) => {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  try {
    return new URL(path, normalizedBase).toString()
  } catch {
    return `${normalizedBase}${path}`
  }
}

export const resolvePostUrl = (
  value: Record<string, unknown> | null | undefined,
  baseUrl = DEFAULT_POST_BASE_URL,
): string | null => {
  if (!value) {
    return null
  }

  const direct = pickString(value.url, value.permalink, value.link, value.href)
  if (direct) {
    if (/^https?:\/\//i.test(direct)) {
      return direct
    }

    const sanitized = direct.replace(/^\/+/, '')
    return buildUrl(sanitized, baseUrl)
  }

  const slug = pickString(value.slug, value.path, value.identifier)
  if (slug) {
    if (/^https?:\/\//i.test(slug)) {
      return slug
    }

    const sanitized = slug.replace(/^\/+/, '')
    return buildUrl(sanitized, baseUrl)
  }

  return null
}
