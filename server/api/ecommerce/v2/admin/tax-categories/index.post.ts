import { readBody } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'

type TaxCategoryPayload = Record<string, unknown>

type TaxCategoryResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const body = await readBody<TaxCategoryPayload>(event)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<TaxCategoryResponse>(
    event,
    '/admin/tax-categories',
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
