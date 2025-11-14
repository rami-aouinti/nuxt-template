import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type CatalogPromotionPayload = Record<string, unknown>

type CatalogPromotionResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<CatalogPromotionPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CatalogPromotionResponse>(
    event,
    '/admin/catalog-promotions',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
