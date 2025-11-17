import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'
import { getMethod, getQuery, readBody } from 'h3'
import type { FetchOptions } from 'ofetch'

function normalizePath(segments?: string | string[]) {
  if (!segments) {
    return ''
  }

  const value = Array.isArray(segments) ? segments : [segments]
  const cleaned = value.map((segment) => segment).filter(Boolean)
  if (!cleaned.length) {
    return ''
  }

  return `/${cleaned.join('/')}`
}

export default defineEventHandler(async (event) => {
  const segments = event.context.params?.segments
  const method = getMethod(event).toUpperCase()
  const query = getQuery(event)
  const options: FetchOptions<'json'> = {
    method: method as FetchOptions<'json'>['method'],
    query,
  }

  if (method !== 'GET' && method !== 'HEAD') {
    options.body = await readBody(event)
  }

  const targetPath = `/api/v1/resume${normalizePath(segments)}`
  return await broWorldJobRequest(event, targetPath, options)
})
