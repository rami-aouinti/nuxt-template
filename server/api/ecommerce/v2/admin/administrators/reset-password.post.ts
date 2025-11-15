import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type AdministratorResetPasswordPayload = Record<string, unknown>

type AdministratorResetPasswordResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<AdministratorResetPasswordPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<AdministratorResetPasswordResponse>(
    event,
    '/admin/administrators/reset-password',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
