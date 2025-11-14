import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ResetPasswordPayload = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ResetPasswordPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest(
    event,
    '/shop/customers/reset-password',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
