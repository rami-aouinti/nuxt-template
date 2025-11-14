import { getHeader, type H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'

import { createBroWorldRequest } from './broWorldApi'
import { fetchEcommerceResponse } from './cache/ecommerce'

const ECOMMERCE_BASE_URL = 'https://ecommerce.bro-world.org/api/v2'
const ECOMMERCE_ERROR_MESSAGE = "Requête à l'API Ecommerce Bro World échouée"

type SessionInput = Record<string, unknown> | null | undefined

const getSessionToken = (session: SessionInput, key: string) => {
  if (!session || typeof session !== 'object') {
    return null
  }

  const value = session[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

const resolveEcommerceToken = (session: SessionInput, path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedPath.startsWith('/admin/')) {
    return (
      getSessionToken(session, 'ecommerceAdminToken') ||
      getSessionToken(session, 'token')
    )
  }

  if (normalizedPath.startsWith('/shop/')) {
    return (
      getSessionToken(session, 'ecommerceShopToken') ||
      getSessionToken(session, 'token')
    )
  }

  return getSessionToken(session, 'token')
}

const baseBroWorldEcommerceRequest = createBroWorldRequest(
  ECOMMERCE_BASE_URL,
  ECOMMERCE_ERROR_MESSAGE,
  { resolveToken: resolveEcommerceToken },
)

export async function broWorldEcommerceRequest<T>(
  event: H3Event,
  path: string,
  options: FetchOptions<'json'> = {},
): Promise<T> {
  return await fetchEcommerceResponse(
    event,
    ECOMMERCE_BASE_URL,
    path,
    options,
    () => baseBroWorldEcommerceRequest<T>(event, path, options),
  )
}

export function getEcommerceAcceptLanguage(event: H3Event): string | undefined {
  return getHeader(event, 'accept-language') || undefined
}
