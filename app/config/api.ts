import axios from 'axios'

/**
 * @type {axios.AxiosInstance}
 */
const instance = axios.create({
  baseURL:
    process.env.NUXT_PUBLIC_EDUCATION_API_BASE_URL ||
    process.env.NUXT_EDUCATION_API_BASE_URL ||
    'https://education.bro-world.org',
  headers: {
    Accept: 'application/ld+json',
  },
})

export default instance
