import { readBody } from 'h3'

import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'

type AdministratorResetPasswordPatchPayload = Record<string, unknown>

type AdministratorResetPasswordPatchResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const token = requireRouteParam(
    event,
    'token',
    'Jeton de réinitialisation manquant',
  )
  const body = await readBody<AdministratorResetPasswordPatchPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<AdministratorResetPasswordPatchResponse>(
    event,
    `/admin/administrators/reset-password/${encodeURIComponent(token)}`,
    {
      method: 'PATCH',
      body,
      headers,
    },
  )
})
