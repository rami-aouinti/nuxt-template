import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type CustomerPayload = Record<string, unknown>

type CustomerResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CustomerResponse>(
    event,
    '/admin/customers',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
