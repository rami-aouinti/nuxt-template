import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const optionCode = requireRouteParam(event, 'optionCode', "de l'option de produit")
  const code = requireRouteParam(event, 'code', "de la valeur d'option de produit")

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/product-options/${encodeURIComponent(optionCode)}/values/${encodeURIComponent(code)}`,
    {
      headers,
    },
  )
})
