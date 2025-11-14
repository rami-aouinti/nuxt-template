import { getQuery } from 'h3'

import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldEcommerceRequest } from '~~/server/utils/broWorldEcommerceApi'

type StatisticsResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  return await broWorldEcommerceRequest<StatisticsResponse>(
    event,
    `/admin/statistics${queryString}`,
  )
})
