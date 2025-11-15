import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type CustomerGroupPayload = Record<string, unknown>

type CustomerGroupResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(
    event,
    'code',
    'Code du groupe client manquant',
  )
  const body = await readBody<CustomerGroupPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<CustomerGroupResponse>(
    event,
    `/admin/customer-groups/${encodeURIComponent(code)}`,
    {
      method: 'PUT',
      body,
      headers,
    },
  )
})
