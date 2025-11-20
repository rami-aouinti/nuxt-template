import { computed } from 'vue'

const normalizeBaseUrl = (value: string | undefined) =>
  (value || 'https://crm.bro-world.org').replace(/\/+$/, '')

export function useCrmApi() {
  const config = useRuntimeConfig()
  const { session } = useAppUserSession()
  const requestHeaders = useServerAuthRequestHeaders()

  const baseUrl = computed(() => normalizeBaseUrl(config.public.crmApiBaseUrl))

  const authHeaders = computed(() => {
    const token = session.value?.token

    return token ? { Authorization: `Bearer ${token}` } : {}
  })

  const headers = computed(() => ({
    ...(requestHeaders ?? {}),
    ...authHeaders.value,
  }))

  const withBase = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl.value}${normalizedPath}`
  }

  return { baseUrl, authHeaders, headers, withBase }
}
