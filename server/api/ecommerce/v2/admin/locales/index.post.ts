import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type LocalePayload = Record<string, unknown>

type LocaleResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<LocalePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<LocaleResponse>(
    event,
    '/admin/locales',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
