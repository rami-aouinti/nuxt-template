import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId, requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const tokenValue = requireRouteParam(
    event,
    'tokenValue',
    'Identifiant de la commande manquant',
  )
  const id = requireEntityId(event, "de l'article de commande")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    `/shop/orders/${encodeURIComponent(tokenValue)}/items/${encodeURIComponent(id)}`,
    {
      headers,
    },
  )
})
