import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type CurrencyPayload = Record<string, unknown>

type CurrencyResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<CurrencyPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CurrencyResponse>(
    event,
    '/admin/currencies',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
