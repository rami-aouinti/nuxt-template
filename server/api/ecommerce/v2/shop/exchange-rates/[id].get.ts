import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du taux de change')

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/shop/exchange-rates/${encodeURIComponent(id)}`,
    {
      headers,
    },
  )
})
