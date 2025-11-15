import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type ChannelPayload = Record<string, unknown>

type ChannelResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'Code du canal manquant')
  const body = await readBody<ChannelPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ChannelResponse>(
    event,
    `/admin/channels/${encodeURIComponent(code)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
