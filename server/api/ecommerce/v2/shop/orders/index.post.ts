import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type OrderPayload = Record<string, unknown>

type OrderResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<OrderPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<OrderResponse>(event, '/shop/orders', {
    method: 'POST',
    body,
    headers,
  })
})
