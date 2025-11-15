import type { HydraContext } from './hydra'

export interface CurrencySyliusAdminCurrencyCreate {
  code: string
}

export interface CurrencySyliusAdminCurrencyIndex {
  code: string
  readonly name?: string | null
}

export type CurrencySyliusAdminCurrencyShow = CurrencySyliusAdminCurrencyIndex

export interface CurrencySyliusShopCurrencyIndex {
  code: string
  readonly name?: string | null
}

export type CurrencySyliusShopCurrencyShow = CurrencySyliusShopCurrencyIndex

export interface CurrencyJsonldSyliusAdminCurrencyIndex
  extends CurrencySyliusAdminCurrencyIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type CurrencyJsonldSyliusAdminCurrencyShow =
  CurrencyJsonldSyliusAdminCurrencyIndex

export interface CurrencyJsonldSyliusShopCurrencyIndex
  extends CurrencySyliusShopCurrencyIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type CurrencyJsonldSyliusShopCurrencyShow =
  CurrencyJsonldSyliusShopCurrencyIndex

export interface CurrencyInterface {
  readonly id?: number
  code: string
  readonly name?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface CurrencyInterfaceJsonld extends CurrencyInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}
