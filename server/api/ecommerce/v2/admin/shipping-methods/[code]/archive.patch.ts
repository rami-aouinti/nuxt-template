import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ShippingMethodResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', "de la méthode d'expédition")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest<ShippingMethodResponse>(
    event,
    `/admin/shipping-methods/${encodeURIComponent(code)}/archive`,
    {
      method: 'PATCH',
      headers,
    },
  )
})
