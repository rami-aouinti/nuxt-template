import { readBody } from 'h3'

import { broWorldEcommerceRequest } from '~~/server/utils/broWorldEcommerceApi'

type CustomerTokenPayload = {
  email: string
  password: string
}

type CustomerTokenResponse = {
  token: string
  customer: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<CustomerTokenPayload>(event)

  return await broWorldEcommerceRequest<CustomerTokenResponse>(
    event,
    '/shop/customers/token',
    {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    },
  )
})
