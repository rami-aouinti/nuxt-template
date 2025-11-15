import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId, requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'du taxon')
  const id = requireEntityId(event, "de l'image de taxon")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/taxons/${encodeURIComponent(code)}/images/${encodeURIComponent(id)}`,
    {
      headers,
    },
  )
})
