import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

type ChannelPayload = Record<string, unknown>

type ChannelResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<ChannelPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ChannelResponse>(
    event,
    '/admin/channels',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
