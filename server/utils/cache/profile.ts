import { deleteCookie, setCookie } from 'h3'
import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'
import type { AuthProfile } from '~/types/auth'
import { cacheDelete, cacheSet } from './index'

const PROFILE_CACHE_PREFIX = 'profile:'

function buildCacheKey(id: string) {
  return `${PROFILE_CACHE_PREFIX}${id}`
}

function buildCookiePayload(profile: AuthProfile) {
  const roles = Array.isArray(profile.roles)
    ? profile.roles.filter((role): role is string => typeof role === 'string')
    : []

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    firstName: profile.firstName ?? null,
    lastName: profile.lastName ?? null,
    photo: profile.photo ?? null,
    roles,
  }
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

  const cookieValue = JSON.stringify(buildCookiePayload(profile))

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
