import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type ZonePayload = Record<string, unknown>

type ZoneResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ZonePayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ZoneResponse>(event, '/admin/zones', {
    method: 'POST',
    body,
    headers,
  })
})
