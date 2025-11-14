import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ProductAssociationTypePayload = Record<string, unknown>

type ProductAssociationTypeResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ProductAssociationTypePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductAssociationTypeResponse>(
    event,
    '/admin/product-association-types',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
