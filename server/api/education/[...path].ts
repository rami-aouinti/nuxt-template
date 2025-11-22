import type { H3Event } from 'h3'
import {
  defineEventHandler,
  getHeader,
  getRequestURL,
  parseCookies,
  proxyRequest,
} from 'h3'
import { useRuntimeConfig } from '#imports'
import { cacheGet, cacheSet } from '../../utils/cache'

const EDUCATION_API_BASE_URL = 'https://education.bro-world.org'
const EDUCATION_CACHE_PREFIX = 'education-api'

function createCacheKey(
  path: string,
  search: string,
  authorization: string | null,
  acceptLanguage: string | undefined,
) {
  const authKey = authorization ? `auth:${authorization}` : 'auth:none'
  const langKey = acceptLanguage ? `lang:${acceptLanguage}` : 'lang:none'
  return `${EDUCATION_CACHE_PREFIX}:${authKey}:${langKey}:${path}${search}`
}

function joinPath(segments?: string | string[]) {
  if (!segments) {
    return ''
  }

  return Array.isArray(segments) ? segments.filter(Boolean).join('/') : segments
}

function resolveToken(session: unknown) {
  if (!session || typeof session !== 'object' || !('token' in session)) {
    return null
  }

  const value = (session as { token?: unknown }).token
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function resolveAuthorization(event: H3Event, session: unknown) {
  const token = resolveToken(session)
  if (token) {
    return `Bearer ${token}`
  }

  const headerAuth = getHeader(event, 'authorization')
  if (headerAuth && headerAuth.trim().length > 0) {
    return headerAuth
  }

  return null
}

function shouldIncludeAuthorization(path: string) {
  const normalized = path.replace(/^\/+/, '')
  return !normalized.startsWith('authentication_token')
}

export default defineEventHandler(async (event) => {
  const rawPath = event.context.params?.path
  const path = joinPath(rawPath)

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid education API path',
      data: { message: 'A path segment is required.' },
    })
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const session = await getUserSession(event)
  const runtimeConfig = useRuntimeConfig(event)
  const educationBaseUrl =
    runtimeConfig.public?.educationApiBaseUrl ||
    runtimeConfig.educationApiBaseUrl ||
    EDUCATION_API_BASE_URL
  const authorization = resolveAuthorization(event, session)
  const acceptLanguage =
    getHeader(event, 'accept-language') ||
    parseCookies(event)?.i18n_redirected ||
    undefined
  const url = getRequestURL(event)
  const search = url.search ?? ''
  const targetUrl = `${educationBaseUrl.replace(/\/+$/, '')}/api/${normalizedPath}${search}`
  const cacheTtl = Number(runtimeConfig.redis?.educationTtl || 0)
  const method = (event.method || 'GET').toUpperCase()
  const isCacheable = method === 'GET'
  const cacheKey = isCacheable
    ? createCacheKey(normalizedPath, search, authorization, acceptLanguage)
    : null

  const headers: Record<string, string> = {}

  if (authorization && shouldIncludeAuthorization(normalizedPath)) {
    headers.Authorization = authorization
  }

  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  if (cacheKey) {
    const cached = await cacheGet<unknown>(cacheKey)
    if (cached) {
      return cached
    }
  }

  if (!isCacheable) {
    return await proxyRequest(event, targetUrl, {
      headers: Object.keys(headers).length ? headers : undefined,
    })
  }

  const response = await $fetch<unknown>(targetUrl, {
    headers: Object.keys(headers).length ? headers : undefined,
    method,
  })

  if (cacheKey && cacheTtl > 0) {
    await cacheSet(cacheKey, response, { ttl: cacheTtl })
  }

  return response
})
