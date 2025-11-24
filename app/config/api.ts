import axios from 'axios'

/**
 * @type {axios.AxiosInstance}
 */
const fallbackHost =
  process.env.NUXT_PUBLIC_SITE_URL ||
  process.env.NUXT_SITE_URL ||
  'http://localhost:3000'

const resolveBaseUrl = () => {
  const rawBaseUrl =
    process.env.NUXT_PUBLIC_EDUCATION_API_BASE_URL ||
    process.env.NUXT_EDUCATION_API_BASE_URL ||
    '/api/education'

  if (/^https?:\/\//i.test(rawBaseUrl)) {
    return rawBaseUrl
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${rawBaseUrl}`
  }

  return `${fallbackHost.replace(/\/+$/, '')}${rawBaseUrl}`
}

const instance = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    Accept: 'application/ld+json',
  },
})

export default instance
