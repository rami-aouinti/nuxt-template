import type { HydraContext } from './hydra'

export interface CountryProvincePayload {
  code: string
  name: string
  abbreviation?: string | null
  enabled?: boolean
}

export interface CountrySyliusAdminCountryCreate {
  code: string
  provinces?: CountryProvincePayload[]
}

export interface CountrySyliusAdminCountryUpdate {
  provinces?: CountryProvincePayload[]
}

export interface CountrySyliusAdminCountryIndex {
  readonly id: number
  code: string
  provinces: string[]
  enabled?: boolean
  readonly name?: string | null
}

export type CountrySyliusAdminCountryShow = CountrySyliusAdminCountryIndex

export interface CountryProvinceSummary {
  code: string
  name: string
}

export interface CountrySyliusShopCountryShow {
  code: string
  provinces: CountryProvinceSummary[]
  readonly name?: string | null
}

export interface CountryJsonldSyliusAdminCountryIndex
  extends CountrySyliusAdminCountryIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type CountryJsonldSyliusAdminCountryShow =
  CountryJsonldSyliusAdminCountryIndex

export interface CountryProvinceJsonld extends CountryProvinceSummary {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CountryJsonldSyliusShopCountryShow
  extends CountrySyliusShopCountryShow {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  provinces: CountryProvinceJsonld[]
}

export interface CountryProvinceInterface {
  readonly id?: number
  code: string
  name: string
  abbreviation?: string | null
  country?: string
  province?: CountryProvinceInterface[]
  enabled?: boolean
}

export interface CountryInterface {
  readonly id?: number
  code: string
  readonly name?: string | null
  provinces?: CountryProvinceInterface[]
  province?: CountryProvinceInterface[]
  enabled?: boolean
}

export interface CountryInterfaceJsonld extends CountryInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}
