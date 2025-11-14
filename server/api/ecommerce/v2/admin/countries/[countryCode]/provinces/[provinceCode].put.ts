import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ProvincePayload = Record<string, unknown>

type ProvinceResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const countryCode = requireRouteParam(event, 'countryCode', 'du pays')
  const provinceCode = requireRouteParam(event, 'provinceCode', 'de la province')
  const body = await readBody<ProvincePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProvinceResponse>(
    event,
    `/admin/countries/${encodeURIComponent(countryCode)}/provinces/${encodeURIComponent(provinceCode)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
