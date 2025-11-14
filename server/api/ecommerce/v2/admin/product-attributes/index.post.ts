import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ProductAttributePayload = Record<string, unknown>

type ProductAttributeResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductAttributePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductAttributeResponse>(
    event,
    '/admin/product-attributes',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
