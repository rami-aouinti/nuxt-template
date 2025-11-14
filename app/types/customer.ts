import type { HydraContext } from './hydra'

export interface ShopUserAdminCustomerPayload {
  verified?: boolean
}

export interface ShopUserAdminCustomerJsonLd extends ShopUserAdminCustomerPayload {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerStatistics {
  perChannelsStatistics: string[]
  allOrdersCount: number
}

export interface CustomerStatisticsJsonLd extends CustomerStatistics {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerTokenRead {
  token: string
  customer: string
}

export interface CustomerTokenUnauthorizedError {
  code: number
  message: string
}

export interface CustomerTokenBadRequestError {
  type: string
  title: string
  status: number
  detail: string
}

export interface CustomerTokenCreatePayload {
  email: string
  password: string
}
