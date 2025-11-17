import { broWorldJobRequest } from '~~/server/utils/broWorldJobApi'
import { getMethod, getQuery, readBody } from 'h3'
import type { FetchOptions } from 'ofetch'

export default defineEventHandler(async (event) => {
  const method = getMethod(event).toUpperCase()
  const query = getQuery(event)
  const options: FetchOptions<'json'> = {
    method: method as FetchOptions<'json'>['method'],
    query,
  }

  if (method !== 'GET' && method !== 'HEAD') {
    options.body = await readBody(event)
  }

  return await broWorldJobRequest(event, '/api/v1/resume', options)
})
