import axios from 'axios'

/**
 * @type {axios.AxiosInstance}
 */
const instance = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
  headers: {
    Accept: 'application/ld+json',
  },
})

export default instance
