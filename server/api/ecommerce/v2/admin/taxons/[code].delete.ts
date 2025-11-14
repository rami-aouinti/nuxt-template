import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'du taxon')

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(event, `/admin/taxons/${encodeURIComponent(code)}`, {
    method: 'DELETE',
    headers,
  })
})
