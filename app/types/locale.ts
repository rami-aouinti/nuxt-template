import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface LocaleAttributes {
  code: string
}

export interface Locale extends LocaleAttributes {
  id?: number
  createdAt?: string
  updatedAt?: string | null
  name?: string | null
}

export interface LocaleSyliusAdminLocaleCreate {
  code: string
}

export type LocaleSyliusAdminLocaleIndex = Locale

export type LocaleSyliusAdminLocaleShow = Locale

export interface LocaleSyliusShopLocaleIndex {
  code: string
  name?: string | null
}

export type LocaleSyliusShopLocaleShow = LocaleSyliusShopLocaleIndex

export interface LocaleJsonld extends Locale, JsonLdResource {}

export type LocaleJsonldSyliusAdminLocaleIndex = LocaleJsonld

export type LocaleJsonldSyliusAdminLocaleShow = LocaleJsonld

export interface LocaleJsonldSyliusShopLocaleIndex
  extends LocaleSyliusShopLocaleIndex,
    JsonLdResource {}

export type LocaleJsonldSyliusShopLocaleShow = LocaleJsonldSyliusShopLocaleIndex

export interface LocaleInterface extends Locale {}

export interface LocaleInterfaceJsonld
  extends LocaleInterface,
    JsonLdResource {}
