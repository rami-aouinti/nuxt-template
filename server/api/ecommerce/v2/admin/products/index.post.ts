import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type ProductPayload = Record<string, unknown>

type ProductResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductResponse>(
    event,
    '/admin/products',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
