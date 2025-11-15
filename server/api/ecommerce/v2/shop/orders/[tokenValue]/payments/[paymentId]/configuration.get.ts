import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const tokenValue = requireRouteParam(
    event,
    'tokenValue',
    'Identifiant de la commande manquant',
  )
  const paymentId = requireRouteParam(
    event,
    'paymentId',
    'Identifiant du paiement manquant',
  )

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/shop/orders/${encodeURIComponent(tokenValue)}/payments/${encodeURIComponent(paymentId)}/configuration`,
    {
      headers,
    },
  )
})
