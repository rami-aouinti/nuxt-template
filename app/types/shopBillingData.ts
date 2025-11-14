import type { HydraContext } from './hydra'

export interface ShopBillingDataAttributes {
  company?: string | null
  taxId?: string | null
  countryCode?: string | null
  street?: string | null
  city?: string | null
  postcode?: string | null
}

export interface ShopBillingData extends ShopBillingDataAttributes {
  id?: number
}

export type ShopBillingDataSyliusAdminChannelCreateNoId = ShopBillingDataAttributes

export type ShopBillingDataSyliusAdminChannelIndexNoId = ShopBillingDataAttributes

export type ShopBillingDataSyliusAdminChannelShowNoId = ShopBillingDataAttributes

export type ShopBillingDataSyliusAdminChannelUpdateNoId = ShopBillingDataAttributes

export interface ShopBillingDataJsonld extends ShopBillingData {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShopBillingDataJsonldSyliusAdminChannelIndexNoId
  extends ShopBillingDataAttributes {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShopBillingDataJsonldSyliusAdminChannelShowNoId
  extends ShopBillingDataAttributes {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShopBillingDataJsonldNoId extends ShopBillingDataAttributes {
  id?: number
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ShopBillingDataNoId = ShopBillingData
