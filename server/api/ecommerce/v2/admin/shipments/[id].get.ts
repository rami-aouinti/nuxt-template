import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'
import { hydrateShipmentRecordResponse } from '~~/server/utils/ecommerce/shipments'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'expédition")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  const response = await broWorldEcommerceRequest(
    event,
    `/admin/shipments/${encodeURIComponent(id)}`,
    {
      headers,
    },
  )

  return await hydrateShipmentRecordResponse(event, response, { headers })
})
