import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ProductReviewPayload = Record<string, unknown>

type ProductReviewResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductReviewPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductReviewResponse>(
    event,
    '/shop/product-reviews',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
