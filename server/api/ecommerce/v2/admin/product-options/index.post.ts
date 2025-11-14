import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ProductOptionPayload = Record<string, unknown>

type ProductOptionResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductOptionPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductOptionResponse>(
    event,
    '/admin/product-options',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
