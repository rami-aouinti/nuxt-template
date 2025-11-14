import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

type PasswordPayload = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du client')
  const body = await readBody<PasswordPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest(
    event,
    `/shop/customers/${encodeURIComponent(id)}/password`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
