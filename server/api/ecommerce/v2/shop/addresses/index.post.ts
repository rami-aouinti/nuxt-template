import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type AddressPayload = Record<string, unknown>

type AddressResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<AddressPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<AddressResponse>(event, '/shop/addresses', {
    method: 'POST',
    body,
    headers,
  })
})
