import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ExchangeRateAttributes {
  ratio: string
  sourceCurrency: string
  targetCurrency: string
}

export interface ExchangeRate extends ExchangeRateAttributes {
  id?: number
  createdAt?: string
  updatedAt?: string | null
}

export type ExchangeRateSyliusAdminExchangeRateIndex = ExchangeRate

export type ExchangeRateSyliusAdminExchangeRateShow = ExchangeRate

export type ExchangeRateSyliusAdminExchangeRateCreate = ExchangeRateAttributes

export interface ExchangeRateSyliusAdminExchangeRateUpdate {
  ratio: string
}

export type ExchangeRateSyliusShopExchangeRateIndex = ExchangeRate

export type ExchangeRateSyliusShopExchangeRateShow = ExchangeRate

export type ExchangeRateJsonld = ExchangeRate & JsonLdResource

export type ExchangeRateJsonldSyliusAdminExchangeRateIndex = ExchangeRateJsonld

export type ExchangeRateJsonldSyliusAdminExchangeRateShow = ExchangeRateJsonld

export type ExchangeRateJsonldSyliusShopExchangeRateIndex = ExchangeRateJsonld

export type ExchangeRateJsonldSyliusShopExchangeRateShow = ExchangeRateJsonld
