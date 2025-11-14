import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type CountryPayload = Record<string, unknown>

type CountryResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'Code du pays manquant')
  const body = await readBody<CountryPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CountryResponse>(
    event,
    `/admin/countries/${encodeURIComponent(code)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
