import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type PromotionCouponPayload = Record<string, unknown>

type PromotionCouponResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'de la promotion')
  const body = await readBody<PromotionCouponPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<PromotionCouponResponse>(
    event,
    `/admin/promotions/${encodeURIComponent(code)}/coupons`,
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
