import { createHash } from 'node:crypto'

import { getQuery } from 'h3'
import { buildQueryString } from '~~/server/utils/apiClient'
import { configurationRequest } from '~~/server/utils/configurationApi'
import { fetchAdminList } from '~~/server/utils/cache/admin'
import type { Configuration } from '~/types/configuration'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)
  const identifier = queryString
    ? createHash('sha1').update(queryString).digest('hex')
    : undefined

  return await fetchAdminList(
    event,
    'configuration',
    () => configurationRequest<Configuration[]>(event, `/configuration${queryString}`),
    { identifier },
  )
})
