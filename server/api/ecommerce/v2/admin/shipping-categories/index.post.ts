import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type ShippingCategoryPayload = Record<string, unknown>

type ShippingCategoryResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ShippingCategoryPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ShippingCategoryResponse>(
    event,
    '/admin/shipping-categories',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
