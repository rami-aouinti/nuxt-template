import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type ProductAssociationPayload = Record<string, unknown>

type ProductAssociationResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductAssociationPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductAssociationResponse>(
    event,
    '/admin/product-associations',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
