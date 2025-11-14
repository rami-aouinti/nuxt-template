import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type UpdateShipmentPayload = Record<string, unknown>

type OrderResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const tokenValue = requireRouteParam(
    event,
    'tokenValue',
    'Identifiant de la commande manquant',
  )
  const shipmentId = requireRouteParam(
    event,
    'shipmentId',
    "Identifiant de l'expédition manquant",
  )
  const body = await readBody<UpdateShipmentPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<OrderResponse>(
    event,
    `/shop/orders/${encodeURIComponent(tokenValue)}/shipments/${encodeURIComponent(shipmentId)}`,
    {
      method: 'PATCH',
      body,
      headers,
    },
  )
})
