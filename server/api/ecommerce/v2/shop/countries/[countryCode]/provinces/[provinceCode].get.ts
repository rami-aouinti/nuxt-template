import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const countryCode = requireRouteParam(event, 'countryCode', 'du pays')
  const provinceCode = requireRouteParam(
    event,
    'provinceCode',
    'de la province',
  )

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/shop/countries/${encodeURIComponent(countryCode)}/provinces/${encodeURIComponent(provinceCode)}`,
    {
      headers,
    },
  )
})
