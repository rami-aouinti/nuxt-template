import { getQuery } from 'h3'

import { buildQueryString } from '~~/server/utils/apiClient'
import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const tokenValue = requireRouteParam(event, 'tokenValue', 'de la commande')
  const shipmentId = requireRouteParam(event, 'shipmentId', "de l'expédition")

  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/shop/orders/${encodeURIComponent(tokenValue)}/shipments/${encodeURIComponent(shipmentId)}/methods${queryString}`,
    {
      headers,
    },
  )
})
