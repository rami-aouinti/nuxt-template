import { readBody } from 'h3'

import { broWorldEcommerceRequest } from '~~/server/utils/broWorldEcommerceApi'

type AdministratorTokenPayload = {
  email: string
  password: string
}

type AdministratorTokenResponse = {
  token: string
  adminUser: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<AdministratorTokenPayload>(event)

  return await broWorldEcommerceRequest<AdministratorTokenResponse>(
    event,
    '/admin/administrators/token',
    {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    },
  )
})
