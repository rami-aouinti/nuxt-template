import { getHeader, type H3Event } from 'h3'

import { createBroWorldRequest } from './broWorldApi'

const ECOMMERCE_BASE_URL = 'https://ecommerce.bro-world.org/api/v2'
const ECOMMERCE_ERROR_MESSAGE = "Requête à l'API Ecommerce Bro World échouée"

export const broWorldEcommerceRequest = createBroWorldRequest(
  ECOMMERCE_BASE_URL,
  ECOMMERCE_ERROR_MESSAGE,
)

export function getEcommerceAcceptLanguage(event: H3Event): string | undefined {
  return getHeader(event, 'accept-language') || undefined
}
