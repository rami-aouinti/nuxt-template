import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type AdministratorPayload = Record<string, unknown>

type AdministratorResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<AdministratorPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<AdministratorResponse>(
    event,
    '/admin/administrators',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
