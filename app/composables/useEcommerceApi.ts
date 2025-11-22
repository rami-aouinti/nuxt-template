import { computed } from 'vue'

const normalizeBaseUrl = (value: string | undefined, fallback: string) =>
  (value || fallback).replace(/\/+$/, '')

export function useEcommerceApi() {
  const config = useRuntimeConfig()
  const { session } = useAppUserSession()
  const requestHeaders = useServerAuthRequestHeaders()
  const { locale } = useI18n()

  const baseUrl = computed(() =>
    normalizeBaseUrl(config.public.ecommerceApiBaseUrl, 'https://ecommerce.bro-world.org'),
  )
  const proxyBaseUrl = computed(() =>
    normalizeBaseUrl(config.public.ecommerceApiProxyBaseUrl, '/api/v2'),
  )

  const authHeaders = computed(() => {
    const token = session.value?.token

    return token ? { Authorization: `Bearer ${token}` } : {}
  })

  const headers = computed(() => ({
    ...(requestHeaders ?? {}),
    ...authHeaders.value,
    Accept: 'application/ld+json',
    'Accept-Language': locale.value,
  }))

  const jsonLdHeaders = computed(() => ({
    ...headers.value,
    Accept: 'application/ld+json',
    'Content-Type': 'application/ld+json',
  }))

  const withBase = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl.value}${normalizedPath}`
  }

  const withResourceBase = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl.value}${normalizedPath}`
  }

  return {
    baseUrl,
    proxyBaseUrl,
    authHeaders,
    headers,
    jsonLdHeaders,
    withBase,
    withResourceBase,
  }
}
