import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

type ShipShipmentPayload = Record<string, unknown>

type ShipShipmentResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'expédition")
  const body = await readBody<ShipShipmentPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = {
    'Content-Type': 'application/merge-patch+json',
  }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ShipShipmentResponse>(
    event,
    `/admin/shipments/${encodeURIComponent(id)}/ship`,
    {
      method: 'PATCH',
      body,
      headers,
    },
  )
})
