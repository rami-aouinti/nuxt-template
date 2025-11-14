import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type TaxonPayload = Record<string, unknown>

type TaxonResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<TaxonPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<TaxonResponse>(event, '/admin/taxons', {
    method: 'POST',
    body,
    headers,
  })
})
