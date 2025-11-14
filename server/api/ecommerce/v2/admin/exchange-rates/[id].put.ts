import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

type ExchangeRatePayload = Record<string, unknown>

type ExchangeRateResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "du taux de change")
  const body = await readBody<ExchangeRatePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ExchangeRateResponse>(
    event,
    `/admin/exchange-rates/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
