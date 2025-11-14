import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'du produit')
  const id = requireRouteParam(event, 'id', "de l'image de produit")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/products/${encodeURIComponent(code)}/images/${encodeURIComponent(id)}`,
    {
      headers,
    },
  )
})
