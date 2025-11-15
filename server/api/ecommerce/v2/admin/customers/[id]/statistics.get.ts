import {
  broWorldEcommerceRequest,
  getEcommerceAcceptLanguage,
} from '~~/server/utils/broWorldEcommerceApi'
import { requireEntityId } from '~~/server/utils/crud'

export default defineEventHandler(async (event) => {
  const id = requireEntityId(event, 'du client')

  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage
    ? { 'Accept-Language': acceptLanguage }
    : undefined

  return await broWorldEcommerceRequest(
    event,
    `/admin/customers/${encodeURIComponent(id)}/statistics`,
    {
      headers,
    },
  )
})
