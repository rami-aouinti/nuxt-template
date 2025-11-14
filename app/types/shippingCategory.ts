import type { HydraContext } from './hydra'

export interface ShippingCategory {
  id?: number
  code: string
  name: string
  description?: string | null
  createdAt?: string
  updatedAt?: string | null
}

export interface ShippingCategorySyliusAdminShippingCategoryCreate {
  code: string
  name: string
  description?: string | null
}

export type ShippingCategorySyliusAdminShippingCategoryIndex = ShippingCategory

export type ShippingCategorySyliusAdminShippingCategoryShow = ShippingCategory

export interface ShippingCategorySyliusAdminShippingCategoryUpdate {
  name: string
  description?: string | null
}

export interface ShippingCategoryJsonld extends ShippingCategory {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ShippingCategoryJsonldSyliusAdminShippingCategoryIndex = ShippingCategoryJsonld

export type ShippingCategoryJsonldSyliusAdminShippingCategoryShow = ShippingCategoryJsonld
