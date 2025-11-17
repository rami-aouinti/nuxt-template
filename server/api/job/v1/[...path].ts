import { defineEventHandler, getRequestURL, proxyRequest } from 'h3'

const JOB_API_BASE_URL = 'https://job.bro-world.org'

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

export default defineEventHandler(async (event) => {
  const rawPath = event.context.params?.path
  const path = joinPath(rawPath)

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid job API path',
      data: { message: 'A path segment is required.' },
    })
  }

  const session = await getUserSession(event)
  const token = resolveToken(session)
  const url = getRequestURL(event)
  const search = url.search ?? ''
  const targetUrl = `${JOB_API_BASE_URL}/api/v1/${path}${search}`

  return await proxyRequest(event, targetUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
})
