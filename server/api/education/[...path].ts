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
const TOKEN_EXPIRY_BUFFER_MS = 30_000

type EducationAuthConfig = {
  token?: string
  username?: string
  password?: string
}

type TokenCache = {
  token: string | null
  expiresAt: number | null
}

const serviceTokenCache: TokenCache = {
  token: null,
  expiresAt: null,
}

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

function parseJwtExpiry(token: string) {
  try {
    const [, payload] = token.split('.')
    if (!payload) {
      return null
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
    const exp = decoded?.exp

    return typeof exp === 'number' ? exp * 1000 : null
  } catch (error) {
    console.error('Failed to parse education token expiry', error)
    return null
  }
}

function isCachedTokenValid(cache: TokenCache) {
  if (!cache.token) {
    return false
  }

  if (!cache.expiresAt) {
    return true
  }

  return cache.expiresAt - TOKEN_EXPIRY_BUFFER_MS > Date.now()
}

function resolveToken(session: unknown) {
  if (!session || typeof session !== 'object') {
    return null
  }

  const { educationToken, token } = session as {
    educationToken?: unknown
    token?: unknown
  }

  if (typeof educationToken === 'string' && educationToken.trim().length > 0) {
    return educationToken
  }

  if (typeof token === 'string' && token.trim().length > 0) {
    return token
  }

  return null
}

async function resolveServiceAuthorization(
  runtimeConfig: { educationApiAuth?: EducationAuthConfig },
  educationBaseUrl: string,
) {
  const authConfig = runtimeConfig.educationApiAuth || {}
  const envToken = authConfig.token?.trim()

  if (envToken) {
    return `Bearer ${envToken}`
  }

  if (isCachedTokenValid(serviceTokenCache)) {
    return `Bearer ${serviceTokenCache.token}`
  }

  const username = authConfig.username?.trim()
  const password = authConfig.password?.trim()

  if (!username || !password) {
    return null
  }

  const { token } = await $fetch<{ token: string }>(
    `${educationBaseUrl.replace(/\/+$/, '')}/api/authentication_token`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: { username, password },
    },
  )

  serviceTokenCache.token = token
  serviceTokenCache.expiresAt = parseJwtExpiry(token)

  return token ? `Bearer ${token}` : null
}

async function resolveAuthorization(
  event: H3Event,
  session: unknown,
  runtimeConfig: { educationApiAuth?: EducationAuthConfig },
  educationBaseUrl: string,
) {
  const serviceAuthorization = await resolveServiceAuthorization(
    runtimeConfig,
    educationBaseUrl,
  )
  if (serviceAuthorization) {
    return serviceAuthorization
  }

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
  const authorization = await resolveAuthorization(
    event,
    session,
    runtimeConfig,
    educationBaseUrl,
  )
  const acceptLanguage =
    getHeader(event, 'accept-language') ||
    parseCookies(event)?.i18n_redirected ||
    undefined
  const url = getRequestURL(event)
  const search = url.search ?? ''
  const targetPath = normalizedPath.startsWith('api/')
    ? normalizedPath
    : `api/${normalizedPath}`
  const targetUrl = `${educationBaseUrl.replace(/\/+$/, '')}/${targetPath}${search}`
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
