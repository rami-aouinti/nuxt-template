import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { configurationRequest } from '~~/server/utils/configurationApi'
import type { Count } from '~/types/count'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)
  return await configurationRequest<Count>(event, `/configuration/count${queryString}`)
})
