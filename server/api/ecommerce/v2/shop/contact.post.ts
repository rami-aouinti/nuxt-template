import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type ContactPayload = Record<string, unknown>

type ContactResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ContactResponse>(
    event,
    '/shop/contact',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
