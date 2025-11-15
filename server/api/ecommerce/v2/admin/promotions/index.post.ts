import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type PromotionPayload = Record<string, unknown>

type PromotionResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<PromotionPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<PromotionResponse>(
    event,
    '/admin/promotions',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
