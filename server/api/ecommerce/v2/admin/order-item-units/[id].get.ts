import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'unité d'article de commande")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/order-item-units/${encodeURIComponent(id)}`,
    {
      headers,
    },
  )
})
