import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ProductAssociationTypePayload = Record<string, unknown>

type ProductAssociationTypeResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', "du type d'association de produits")
  const body = await readBody<ProductAssociationTypePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductAssociationTypeResponse>(
    event,
    `/admin/product-association-types/${encodeURIComponent(code)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
