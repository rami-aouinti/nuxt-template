import { broWorldEcommerceRequest, getEcommerceAcceptLanguage } from '~~/server/utils/broWorldEcommerceApi'

export default defineEventHandler(async (event) => {
  const acceptLanguage = getEcommerceAcceptLanguage(event)
  const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : undefined

  return await broWorldEcommerceRequest(
    event,
    '/shop/locales',
    {
      headers,
    },
  )
})
