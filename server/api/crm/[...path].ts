import type { H3Event } from 'h3'
import { defineEventHandler, getHeader, getRequestURL, proxyRequest } from 'h3'

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
  const url = getRequestURL(event)
  const search = url.search ?? ''
  const targetUrl = `${CRM_API_BASE_URL}/api/${normalizedPath}${search}`

  return await proxyRequest(event, targetUrl, {
    headers: authorization ? { Authorization: authorization } : undefined,
  })
})
