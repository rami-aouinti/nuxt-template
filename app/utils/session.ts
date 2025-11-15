function toNormalizedIdentifier(value: unknown) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : ''
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return ''
}

function toRecord(value: unknown) {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null
}

export function resolveSessionUserId(sessionValue: unknown) {
  const record = toRecord(sessionValue)
  if (!record) {
    return ''
  }

  const profile = toRecord(record.profile)
  const user = toRecord(record.user)

  const candidates = [
    profile?.id,
    user?.id,
    user?.userId,
    user?.user_id,
    record.userId,
    record.user_id,
    record.id,
  ]

  for (const candidate of candidates) {
    const normalized = toNormalizedIdentifier(candidate)
    if (normalized) {
      return normalized
    }
  }

  return ''
}
