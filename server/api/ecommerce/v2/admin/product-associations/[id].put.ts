import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ProductAssociationPayload = Record<string, unknown>

type ProductAssociationResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireRouteParam(event, 'id', "de l'association de produits")
  const body = await readBody<ProductAssociationPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductAssociationResponse>(
    event,
    `/admin/product-associations/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
