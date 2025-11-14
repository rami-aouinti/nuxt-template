import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ProductAttributePayload = Record<string, unknown>

type ProductAttributeResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', "de l'attribut de produit")
  const body = await readBody<ProductAttributePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductAttributeResponse>(
    event,
    `/admin/product-attributes/${encodeURIComponent(code)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
