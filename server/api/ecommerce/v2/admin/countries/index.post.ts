import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type CountryPayload = Record<string, unknown>

type CountryResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<CountryPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CountryResponse>(event, '/admin/countries', {
    method: 'POST',
    body,
    headers,
  })
})
