import type { RequestInit } from 'undici'

type HeadersInit = RequestInit['headers']

type AxiosRequestConfig = {
  url?: string
  baseURL?: string
  method?: string
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: any
}

type AxiosResponse<T = any> = {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: AxiosRequestConfig
  request: Response
}

type AxiosError = Error & {
  response?: AxiosResponse
  config?: AxiosRequestConfig
  isAxiosError?: boolean
}

function buildUrl(
  url: string,
  baseURL?: string,
  params?: Record<string, unknown>,
) {
  const normalizedUrl = baseURL ? new URL(url ?? '', baseURL).toString() : url
  if (!params || !Object.keys(params).length) return normalizedUrl

  const urlObj = new URL(
    normalizedUrl,
    normalizedUrl.startsWith('http') ? undefined : 'http://localhost',
  )
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    urlObj.searchParams.append(key, String(value))
  })
  return urlObj.toString()
}

async function axiosRequest<T = any>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  const {
    url = '',
    baseURL,
    method = 'get',
    headers = {},
    data,
    params,
  } = config
  const target = buildUrl(url, baseURL, params)

  const requestHeaders: HeadersInit = { ...headers }
  let body: BodyInit | undefined

  if (data instanceof FormData) {
    body = data
  } else if (data !== undefined) {
    body = JSON.stringify(data)
    if (!requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json'
    }
  }

  const response = await fetch(target, {
    method: method.toUpperCase(),
    headers: requestHeaders,
    body,
  })

  const contentType = response.headers.get('content-type') || ''
  const responseData = contentType.includes('application/json')
    ? await response.json().catch(() => undefined)
    : await response.text()

  const axiosResponse: AxiosResponse<T> = {
    data: responseData as T,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    config,
    request: response,
  }

  if (!response.ok) {
    const error: AxiosError = new Error(response.statusText)
    error.response = axiosResponse
    error.config = config
    error.isAxiosError = true
    throw error
  }

  return axiosResponse
}

class AxiosInstance {
  constructor(private defaults: AxiosRequestConfig = {}) {}

  request<T = any>(config: AxiosRequestConfig) {
    const mergedHeaders = {
      ...(this.defaults.headers || {}),
      ...(config.headers || {}),
    }
    return axiosRequest<T>({
      ...this.defaults,
      ...config,
      headers: mergedHeaders,
    })
  }

  get<T = any>(url: string, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: 'get', url })
  }

  delete<T = any>(url: string, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: 'delete', url })
  }

  post<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: 'post', url, data })
  }

  put<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: 'put', url, data })
  }

  patch<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.request<T>({ ...config, method: 'patch', url, data })
  }
}

const defaultInstance = new AxiosInstance()

function create(defaults: AxiosRequestConfig = {}) {
  return new AxiosInstance(defaults)
}

function axios<T = any>(
  configOrUrl: string | AxiosRequestConfig,
  config: AxiosRequestConfig = {},
) {
  if (typeof configOrUrl === 'string') {
    return defaultInstance.request<T>({ ...config, url: configOrUrl })
  }
  return defaultInstance.request<T>(configOrUrl)
}

axios.request = defaultInstance.request.bind(defaultInstance)
axios.get = defaultInstance.get.bind(defaultInstance)
axios.delete = defaultInstance.delete.bind(defaultInstance)
axios.post = defaultInstance.post.bind(defaultInstance)
axios.put = defaultInstance.put.bind(defaultInstance)
axios.patch = defaultInstance.patch.bind(defaultInstance)
axios.create = create
axios.isAxiosError = (error: unknown): error is AxiosError =>
  Boolean((error as AxiosError)?.isAxiosError)

export type { AxiosRequestConfig, AxiosResponse, AxiosError }
export { create }
export default axios as typeof axios & {
  create: typeof create
  isAxiosError: (error: unknown) => error is AxiosError
}
