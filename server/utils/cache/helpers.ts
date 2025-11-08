import type { H3Event } from 'h3'

type SessionRecord = Record<string, unknown> | null | undefined

function extractString(source: SessionRecord, key: string) {
  if (!source || typeof source !== 'object') {
    return null
  }

  const value = source[key]
  return typeof value === 'string' && value.trim().length > 0
    ? value
    : null
}

export async function resolveUserCacheKey(event: H3Event) {
  const session = await getUserSession(event)

  const profileId = extractString(session?.profile as SessionRecord, 'id')
  if (profileId) {
    return profileId
  }

  const profileUsername = extractString(session?.profile as SessionRecord, 'username')
  if (profileUsername) {
    return `username:${profileUsername}`
  }

  const userLogin = extractString(session?.user as SessionRecord, 'login')
  if (userLogin) {
    return `login:${userLogin}`
  }

  return null
}
