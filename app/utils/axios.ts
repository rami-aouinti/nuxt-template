import { FetchError, ofetch } from 'ofetch'
import type { FetchOptions, FetchResponse } from 'ofetch'

export interface AxiosResponse<T = unknown> {
  data: T
  status: number
  statusText: string
}

export class AxiosError<T = unknown> extends Error {
  response?: {
    status: number
    statusText: string
    data: T | null
  }

  constructor(message: string, response?: AxiosError<T>['response']) {
    super(message)
    this.name = 'AxiosError'
    this.response = response
  }
}

export const isAxiosError = (error: unknown): error is AxiosError =>
  error instanceof AxiosError

const client = ofetch.create({})

async function request<T>(
  url: string,
  options: FetchOptions<'json'>,
): Promise<AxiosResponse<T>> {
  try {
    const response = (await client.raw(url, options)) as FetchResponse<T>
    return {
      data: response._data as T,
      status: response.status,
      statusText: response.statusText ?? '',
    }
  } catch (error) {
    if (error instanceof FetchError && error.response) {
      const response = error.response as FetchResponse<T>
      throw new AxiosError<T>(error.message, {
        status: response.status,
        statusText: response.statusText ?? '',
        data: (response._data as T | undefined) ?? null,
      })
    }
    throw new AxiosError<T>(
      error instanceof Error ? error.message : 'Request failed',
    )
  }
}

type AxiosBody = BodyInit | Record<string, any> | null | undefined

export const axios = {
  post<T>(url: string, data?: AxiosBody, options: FetchOptions<'json'> = {}) {
    const isFormData =
      typeof FormData !== 'undefined' && data instanceof FormData

    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ?? undefined,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
    })
  },
}
