import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ShippingMethodPayload = Record<string, unknown>

type ShippingMethodResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ShippingMethodPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ShippingMethodResponse>(
    event,
    '/admin/shipping-methods',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
