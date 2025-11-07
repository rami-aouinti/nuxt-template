import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { configurationRequest } from '~~/server/utils/configurationApi'
import type { Configuration } from '~/types/configuration'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)
  return await configurationRequest<Configuration[]>(event, `/configuration${queryString}`)
})
