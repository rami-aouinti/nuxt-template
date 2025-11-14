import { getQuery } from 'h3'

import { buildQueryString } from '~~/server/utils/apiClient'
import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'adresse")
  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/addresses/${encodeURIComponent(id)}/log-entries${queryString}`,
    {
      headers,
    },
  )
})
