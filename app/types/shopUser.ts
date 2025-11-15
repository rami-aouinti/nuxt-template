import type { HydraContext } from './hydra'

export interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShopUser {
  enabled?: boolean
  verified?: boolean
}

export interface ShopUserSyliusAdminCustomerCreate {
  plainPassword?: string | null
  verified?: boolean
  enabled?: boolean
}

export type ShopUserSyliusAdminCustomerIndex = ShopUser

export type ShopUserSyliusAdminCustomerShow = ShopUserSyliusAdminCustomerIndex

export interface ShopUserSyliusAdminCustomerUpdate {
  plainPassword?: string | null
  verified?: boolean
  enabled?: boolean
}

export interface ShopUserSyliusShopCustomerShow {
  verified?: boolean
}

export interface ShopUserJsonld extends JsonLdResource, ShopUser {}

export type ShopUserJsonldSyliusAdminCustomerIndex = ShopUserJsonld

export type ShopUserJsonldSyliusAdminCustomerShow =
  ShopUserJsonldSyliusAdminCustomerIndex

export interface ShopUserJsonldSyliusShopCustomerShow
  extends JsonLdResource,
    ShopUserSyliusShopCustomerShow {}
