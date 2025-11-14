import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ResendConfirmationEmailPayload = Record<string, unknown>

type ResendConfirmationEmailResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const tokenValue = requireRouteParam(
    event,
    'tokenValue',
    'Identifiant de la commande manquant',
  )
  const body = await readBody<ResendConfirmationEmailPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ResendConfirmationEmailResponse>(
    event,
    `/admin/orders/${encodeURIComponent(tokenValue)}/resend-confirmation-email`,
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
