import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type VerifyPayload = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const token = requireRouteParam(event, 'token', 'Jeton de vérification manquant')
  const body = await readBody<VerifyPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/merge-patch+json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest(
    event,
    `/shop/customers/verify/${encodeURIComponent(token)}`,
    {
      method: 'PATCH',
      body,
      headers,
    },
  )
})
