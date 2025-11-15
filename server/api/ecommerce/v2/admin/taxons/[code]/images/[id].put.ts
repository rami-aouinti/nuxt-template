import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId, requireRouteParam } from '~~/server/utils/crud'

type TaxonImagePayload = Record<string, unknown>

type TaxonImageResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'du taxon')
  const id = requireEntityId(event, "de l'image de taxon")
  const body = await readBody<TaxonImagePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<TaxonImageResponse>(
    event,
    `/admin/taxons/${encodeURIComponent(code)}/images/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
