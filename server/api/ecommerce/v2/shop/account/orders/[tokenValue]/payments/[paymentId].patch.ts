import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type UpdatePaymentPayload = Record<string, unknown>

type OrderResponse = Record<string, unknown>

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
  const body = await readBody<UpdatePaymentPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<OrderResponse>(
    event,
    `/shop/account/orders/${encodeURIComponent(tokenValue)}/payments/${encodeURIComponent(paymentId)}`,
    {
      method: 'PATCH',
      body,
      headers,
    },
  )
})
