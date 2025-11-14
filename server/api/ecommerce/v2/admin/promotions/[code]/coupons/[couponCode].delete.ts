import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const promotionCode = requireRouteParam(event, 'code', 'de la promotion')
  const couponCode = requireRouteParam(event, 'couponCode', 'du coupon de promotion')

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/promotions/${encodeURIComponent(promotionCode)}/coupons/${encodeURIComponent(couponCode)}`,
    {
      method: 'DELETE',
      headers,
    },
  )
})
