import { getHeader, parseCookies, type H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'
import { useRuntimeConfig } from '#imports'

import { createBroWorldRequest } from './broWorldApi'
import { fetchEcommerceResponse } from './cache/ecommerce'
import { hydrateEcommercePayload } from './ecommerce/hydrator'

const DEFAULT_ECOMMERCE_ORIGIN = 'https://ecommerce.bro-world.org'
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

function resolveEcommerceOrigin(event: H3Event) {
  const runtimeConfig = useRuntimeConfig(event)
  const origin =
    runtimeConfig.ecommerce?.origin ||
    runtimeConfig.public?.ecommerce?.origin ||
    process.env.NUXT_PUBLIC_ECOMMERCE_ORIGIN ||
    DEFAULT_ECOMMERCE_ORIGIN
  return origin.replace(/\/+$/, '')
}

function resolveEcommerceBaseUrl(event: H3Event) {
  const runtimeConfig = useRuntimeConfig(event)
  const baseUrl =
    runtimeConfig.ecommerce?.apiBase ||
    process.env.NUXT_ECOMMERCE_API_BASE_URL ||
    `${resolveEcommerceOrigin(event)}/api/v2`
  return baseUrl.replace(/\/+$/, '')
}

function createEcommerceRequest(event: H3Event, path: string) {
  const baseUrl = resolveEcommerceBaseUrl(event)
  const request = createBroWorldRequest(baseUrl, ECOMMERCE_ERROR_MESSAGE, {
    resolveToken: resolveEcommerceToken,
  })
  return { baseUrl, request }
}

export async function broWorldEcommerceRequest<T>(
  event: H3Event,
  path: string,
  options: FetchOptions<'json'> = {},
): Promise<T> {
  const { baseUrl, request } = createEcommerceRequest(event, path)
  const response = await fetchEcommerceResponse(
    event,
    baseUrl,
    path,
    options,
    () => request<T>(event, path, options),
  )

  return (await hydrateEcommercePayload(event, response, {
    headers: options.headers,
  })) as T
}

export async function broWorldEcommerceRawRequest<T>(
  event: H3Event,
  path: string,
  options: FetchOptions<'json'> = {},
): Promise<T> {
  const { baseUrl, request } = createEcommerceRequest(event, path)
  return await fetchEcommerceResponse(event, baseUrl, path, options, () =>
    request<T>(event, path, options),
  )
}

export function getEcommerceOrigin(event: H3Event): string {
  return resolveEcommerceOrigin(event)
}

export function getEcommerceAcceptLanguage(event: H3Event): string | undefined {
  const header = getHeader(event, 'accept-language')
  if (header && header.trim()) {
    return header
  }

  const localeCookie = parseCookies(event)?.i18n_redirected
  return localeCookie?.trim() || undefined
}
