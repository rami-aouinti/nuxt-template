import type { RequestInit } from 'node-fetch'

type AxiosConfig = RequestInit & { baseURL?: string }

export type AxiosResponse<T = any> = {
  data: T
  status: number
  statusText: string
  headers: Headers
  config: AxiosConfig
  request: any
}

class AxiosStub {
  constructor(private defaults: AxiosConfig = {}) {}

  private buildUrl(url: string) {
    if (this.defaults.baseURL) {
      try {
        return new URL(url, this.defaults.baseURL).toString()
      } catch (e) {
        console.warn('Unable to resolve URL with baseURL', e)
      }
    }
    return url
  }

  private async request<T = any>(
    method: string,
    url: string,
    data?: any,
    config: AxiosConfig = {},
  ) {
    const finalUrl = this.buildUrl(url)
    const headers = {
      ...(this.defaults.headers || {}),
      ...(config.headers || {}),
    }
    const body =
      data !== undefined && method !== 'GET' && method !== 'HEAD'
        ? JSON.stringify(data)
        : undefined

    const response = await fetch(finalUrl, {
      ...this.defaults,
      ...config,
      method,
      headers,
      body,
    })

    let payload: any = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      payload = await response.json()
    } else {
      payload = await response.text()
    }

    const wrapped: AxiosResponse<T> = {
      data: payload,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: { ...this.defaults, ...config },
      request: null,
    }

    return wrapped
  }

  get<T = any>(url: string, config?: AxiosConfig) {
    return this.request<T>('GET', url, undefined, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosConfig) {
    return this.request<T>('POST', url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: AxiosConfig) {
    return this.request<T>('PUT', url, data, config)
  }

  delete<T = any>(url: string, config?: AxiosConfig) {
    return this.request<T>('DELETE', url, undefined, config)
  }

  create(config: AxiosConfig = {}) {
    return new AxiosStub({ ...this.defaults, ...config })
  }
}

const axiosInstance = new AxiosStub()

export default axiosInstance
export const axios = axiosInstance
