import { readBody, readMultipartFormData } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireRouteParam } from '~~/server/utils/crud'
import { buildFormDataFromMultipart } from '~~/server/utils/multipart'

type ProductImagePayload = Record<string, unknown>

type ProductImageResponse = Record<string, unknown>

export default defineEventHandler(async (event) => {
  const code = requireRouteParam(event, 'code', 'du produit')
  const multipart = await readMultipartFormData(event)
  const formData = buildFormDataFromMultipart(multipart)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const acceptLanguageHeaders = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  if (formData) {
    return await broWorldEcommerceRequest<ProductImageResponse>(
      event,
      `/admin/products/${encodeURIComponent(code)}/images`,
      {
        method: 'POST',
        body: formData,
        headers: acceptLanguageHeaders,
      },
    )
  }

  const body = await readBody<ProductImagePayload>(event)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage
  }

  return await broWorldEcommerceRequest<ProductImageResponse>(
    event,
    `/admin/products/${encodeURIComponent(code)}/images`,
    {
      method: 'POST',
      body,
      headers,
    },
  )
})
