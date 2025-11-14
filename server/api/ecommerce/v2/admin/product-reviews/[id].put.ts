import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ProductReviewPayload = Record<string, unknown>

type ProductReviewResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireRouteParam(event, 'id', "de l'avis produit")
  const body = await readBody<ProductReviewPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductReviewResponse>(
    event,
    `/admin/product-reviews/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
