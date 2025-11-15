import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type TaxCategoryPayload = Record<string, unknown>

type TaxCategoryResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'de la catégorie de taxe')
  const body = await readBody<TaxCategoryPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<TaxCategoryResponse>(
    event,
    `/admin/tax-categories/${encodeURIComponent(code)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
