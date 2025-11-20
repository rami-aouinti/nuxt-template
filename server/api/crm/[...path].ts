import type { H3Event } from 'h3'
import {
  defineEventHandler,
  getHeader,
  getRequestURL,
  parseCookies,
  proxyRequest,
} from 'h3'
import { useRuntimeConfig } from '#imports'

const CRM_API_BASE_URL = 'https://crm.bro-world.org'

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

export default defineEventHandler(async (event) => {
  const rawPath = event.context.params?.path
  const path = joinPath(rawPath)

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid CRM API path',
      data: { message: 'A path segment is required.' },
    })
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const session = await getUserSession(event)
  const authorization = resolveAuthorization(event, session)
  const runtimeConfig = useRuntimeConfig(event)
  const crmBaseUrl =
    runtimeConfig.public?.crmApiBaseUrl ||
    runtimeConfig.crmApiBaseUrl ||
    CRM_API_BASE_URL
  const acceptLanguage =
    getHeader(event, 'accept-language') ||
    parseCookies(event)?.i18n_redirected ||
    undefined
  const url = getRequestURL(event)
  const search = url.search ?? ''
  const targetUrl = `${crmBaseUrl.replace(/\/+$/, '')}/api/${normalizedPath}${search}`

  const headers: Record<string, string> = {}

  if (authorization) {
    headers.Authorization = authorization
  }

  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await proxyRequest(event, targetUrl, {
    headers: Object.keys(headers).length ? headers : undefined,
  })
})
