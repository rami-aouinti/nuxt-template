import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type VerifyPayload = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<VerifyPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest(event, '/shop/customers/verify', {
    method: 'POST',
    body,
    headers,
  })
})
