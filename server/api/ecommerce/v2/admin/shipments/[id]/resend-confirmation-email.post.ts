import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

type ResendConfirmationEmailPayload = Record<string, unknown>

type ResendConfirmationEmailResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'expédition")
  const body = await readBody<ResendConfirmationEmailPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ResendConfirmationEmailResponse>(
    event,
    `/admin/shipments/${encodeURIComponent(id)}/resend-confirmation-email`,
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
