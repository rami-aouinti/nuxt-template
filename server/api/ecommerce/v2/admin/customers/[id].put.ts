import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

type CustomerPayload = Record<string, unknown>

type CustomerResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du client')
  const body = await readBody<CustomerPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CustomerResponse>(
    event,
    `/admin/customers/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
