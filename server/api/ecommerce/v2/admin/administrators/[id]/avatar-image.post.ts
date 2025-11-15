import { readMultipartFormData } from 'h3'

import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'
import { ensureUploadFormData } from '~~/server/utils/workspace-upload'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, "de l'administrateur")
  const multipart = await readMultipartFormData(event)
  const formData = ensureUploadFormData(multipart)

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/administrators/${encodeURIComponent(id)}/avatar-image`,
    {
      method: 'POST',
      body: formData,
      headers,
    },
  )
})
