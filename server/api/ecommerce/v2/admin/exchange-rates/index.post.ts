import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type ExchangeRatePayload = Record<string, unknown>

type ExchangeRateResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ExchangeRatePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ExchangeRateResponse>(
    event,
    '/admin/exchange-rates',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
