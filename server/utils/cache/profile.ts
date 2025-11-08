import { deleteCookie, setCookie } from 'h3'
import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'
import type { AuthProfile } from '~/types/auth'
import { cacheDelete, cacheSet } from './index'

const PROFILE_CACHE_PREFIX = 'profile:'

function buildCacheKey(id: string) {
  return `${PROFILE_CACHE_PREFIX}${id}`
}

const MAX_COOKIE_SIZE = 4096
const MAX_STRING_LENGTH = 512
const MAX_PHOTO_LENGTH = 1024
const MAX_ROLES = 20
const MAX_ROLE_LENGTH = 128

type CookiePayload = ReturnType<typeof buildCookiePayload>

function sanitizeString(value: unknown, maxLength = MAX_STRING_LENGTH) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed
}

function sanitizeRequiredString(value: unknown, maxLength = MAX_STRING_LENGTH) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed
}

function buildCookiePayload(profile: AuthProfile) {
  const roles = Array.isArray(profile.roles)
    ? profile.roles
        .filter(
          (role): role is string => typeof role === 'string' && role.length > 0,
        )
        .slice(0, MAX_ROLES)
        .map((role) =>
          role.length > MAX_ROLE_LENGTH ? role.slice(0, MAX_ROLE_LENGTH) : role,
        )
    : []

  return {
    id: sanitizeRequiredString(profile.id, MAX_STRING_LENGTH),
    username: sanitizeRequiredString(profile.username, MAX_STRING_LENGTH),
    email: sanitizeString(profile.email, MAX_STRING_LENGTH),
    firstName: sanitizeString(profile.firstName, MAX_STRING_LENGTH),
    lastName: sanitizeString(profile.lastName, MAX_STRING_LENGTH),
    photo: sanitizeString(profile.photo, MAX_PHOTO_LENGTH),
    roles,
  }
}

function shrinkCookiePayload(payload: CookiePayload, availableLength: number) {
  const steps: ((payload: CookiePayload) => void)[] = [
    (current) => {
      if (
        typeof current.photo === 'string' &&
        current.photo.length > MAX_STRING_LENGTH
      ) {
        current.photo = current.photo.slice(0, MAX_STRING_LENGTH)
      }
    },
    (current) => {
      if (Array.isArray(current.roles) && current.roles.length > 5) {
        current.roles = current.roles.slice(0, 5)
      }
    },
    (current) => {
      if (Array.isArray(current.roles)) {
        current.roles = current.roles.map((role) =>
          role.length > 64 ? role.slice(0, 64) : role,
        )
      }
    },
    (current) => {
      if (Array.isArray(current.roles) && current.roles.length > 0) {
        current.roles = current.roles.slice(0, 1)
      }
    },
    (current) => {
      current.photo = null
    },
    (current) => {
      current.email = null
    },
    (current) => {
      current.lastName = null
    },
    (current) => {
      current.firstName = null
    },
    (current) => {
      current.roles = []
    },
  ]

  for (const step of steps) {
    step(payload)
    const serialized = JSON.stringify(payload)
    if (serialized.length <= availableLength) {
      return serialized
    }
  }

  return ''
}

function createCookieValue(name: string, profile: AuthProfile) {
  const availableLength = Math.max(0, MAX_COOKIE_SIZE - name.length)
  const payload = buildCookiePayload(profile)
  let serialized = JSON.stringify(payload)

  if (serialized.length <= availableLength) {
    return serialized
  }

  const minimizedPayload: CookiePayload = { ...payload }
  serialized = shrinkCookiePayload(minimizedPayload, availableLength)
  if (serialized && serialized.length <= availableLength) {
    return serialized
  }

  const minimalPayload: CookiePayload = {
    id: payload.id,
    username: payload.username,
    email: null,
    firstName: null,
    lastName: null,
    photo: null,
    roles: [],
  }

  serialized = JSON.stringify(minimalPayload)
  if (serialized.length <= availableLength) {
    return serialized
  }

  const minimalSkeleton = {
    id: minimalPayload.id,
    username: minimalPayload.username,
  }
  const minimalEmptyValue = JSON.stringify({ id: '', username: '' })
  if (minimalEmptyValue.length > availableLength) {
    return ''
  }

  let skeletonValue = JSON.stringify(minimalSkeleton)
  if (skeletonValue.length <= availableLength) {
    return skeletonValue
  }

  const adjustValue = () =>
    JSON.stringify({
      id: minimalSkeleton.id,
      username: minimalSkeleton.username,
    })

  while (
    skeletonValue.length > availableLength &&
    minimalSkeleton.username.length > 0
  ) {
    const excess = skeletonValue.length - availableLength
    const trimAmount = Math.max(1, Math.ceil(excess / 2))
    minimalSkeleton.username = minimalSkeleton.username.slice(
      0,
      Math.max(0, minimalSkeleton.username.length - trimAmount),
    )
    skeletonValue = adjustValue()
  }

  while (
    skeletonValue.length > availableLength &&
    minimalSkeleton.id.length > 0
  ) {
    const excess = skeletonValue.length - availableLength
    const trimAmount = Math.max(1, Math.ceil(excess / 2))
    minimalSkeleton.id = minimalSkeleton.id.slice(
      0,
      Math.max(0, minimalSkeleton.id.length - trimAmount),
    )
    skeletonValue = adjustValue()
  }

  if (skeletonValue.length <= availableLength) {
    return skeletonValue
  }

  return minimalEmptyValue
}

function resolveCookieOptions(event: H3Event) {
  const config = useRuntimeConfig(event)
  const secure = process.env.NODE_ENV === 'production'
  return {
    name: config.profileCookie?.name || 'bro_profile',
    maxAge: config.profileCookie?.maxAge || 60 * 60 * 24 * 30,
    secure,
  }
}

export async function persistProfileState(
  event: H3Event,
  profile: AuthProfile,
) {
  const { name, maxAge, secure } = resolveCookieOptions(event)
  const ttl = useRuntimeConfig(event).redis?.profileTtl || 60 * 60

  const cookieValue = createCookieValue(name, profile)

  setCookie(event, name, cookieValue, {
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
    secure,
    maxAge,
  })

  if (typeof profile.id === 'string' && profile.id.length > 0) {
    await cacheSet(buildCacheKey(profile.id), profile, { ttl })
  }
}

export async function clearProfileState(event: H3Event, profileId?: string) {
  const { name, secure } = resolveCookieOptions(event)
  deleteCookie(event, name, { path: '/', secure, sameSite: 'lax' })

  if (profileId) {
    await cacheDelete(buildCacheKey(profileId))
  }
}
