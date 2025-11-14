import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type TaxRatePayload = Record<string, unknown>

type TaxRateResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<TaxRatePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<TaxRateResponse>(event, '/admin/tax-rates', {
    method: 'POST',
    body,
    headers,
  })
})
