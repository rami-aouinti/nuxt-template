import type { HydraContext } from './hydra'

export interface ProductAssociationChannelPricing {
  id?: number
  channelCode: string
  productVariant: string
  price: number | null
  originalPrice: number | null
  minimumPrice?: number | null
  lowestPriceBeforeDiscount?: number | null
  appliedPromotions?: (string | ProductAssociationAppliedPromotion)[]
  priceReduced?: boolean
  exclusiveCatalogPromotionApplied?: boolean
  [key: string]: unknown
}

export interface ProductAssociationAppliedPromotion {
  id?: number
  name?: string
  code?: string
  startDate?: string | null
  endDate?: string | null
  priority?: number
  exclusive?: boolean
  state?: string
  scopes?: string[]
  actions?: string[]
  enabled?: boolean
  translations?: Record<string, ProductAssociationPromotionTranslation>
  channel?: ProductAssociationChannel[]
  action?: ProductAssociationPromotionAction[]
  scope?: ProductAssociationPromotionScope[]
  catalogPromotion?: string | null
  exclusiveCatalogPromotionApplied?: boolean
  [key: string]: unknown
}

export interface ProductAssociationPromotionTranslation {
  label?: string | null
  description?: string | null
  locale?: string
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationChannel {
  name: string
  description: string | null
  hostname: string | null
  color: string | null
  code: string
  createdAt: string
  updatedAt: string | null
  enabled: boolean
  id: number
  [key: string]: unknown
}

export interface ProductAssociationPromotionAction {
  type: string
  configuration: (string | null)[]
  catalogPromotion?: string | null
  id?: number
  [key: string]: unknown
}

export interface ProductAssociationPromotionScope {
  type: string
  configuration: (string | null)[]
  catalogPromotion?: string | null
  id?: number
  [key: string]: unknown
}

export interface ProductAssociationProductTranslation {
  id?: number
  name?: string | null
  slug?: string | null
  description?: string | null
  shortDescription?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
  locale?: string
  translatable?: string
  translation?: unknown[]
  translations?: unknown[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationOptionValueTranslation {
  id?: number
  value: string
  locale: string
  translatable?: string
  translation?: unknown[]
  translations?: unknown[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationOptionValue {
  id?: number
  code?: string
  option?: string
  value?: string | null
  optionCode?: string | null
  name?: string | null
  translations?: Record<string, string | ProductAssociationOptionValueTranslation>
  translation?: ProductAssociationOptionValueTranslation[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationOption {
  id?: number
  code?: string
  name?: string | null
  position?: number
  values?: (string | ProductAssociationOptionValue)[]
  translations?: Record<string, string | ProductAssociationOptionValueTranslation>
  translation?: ProductAssociationOptionValueTranslation[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationAttributeValue {
  id?: number
  subject?: string
  attribute?: string
  value?: unknown
  code?: string | null
  name?: string | null
  type?: string | null
  localeCode?: string | null
  product?: string | ProductAssociationProduct
  [key: string]: unknown
}

export interface ProductAssociationImage {
  id?: number
  type?: string | null
  file?: string | null
  path?: string
  owner?: string
  productVariants?: (string | ProductAssociationProductVariant)[]
  position?: number
  name?: string | null
  descriptor?: string
  optionValue?: ProductAssociationOptionValue[]
  variant?: ProductAssociationProductVariant[]
  translation?: ProductAssociationOptionValueTranslation[]
  [key: string]: unknown
}

export interface ProductAssociationProductVariantTranslation {
  id?: number
  name?: string | null
  locale?: string
  translatable?: string
  translation?: unknown[]
  translations?: unknown[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationProductVariant {
  version?: number
  onHold?: number
  onHand?: number
  tracked?: boolean
  weight?: number | null
  width?: number | null
  height?: number | null
  depth?: number | null
  taxCategory?: string | null
  shippingCategory?: string | null
  channelPricings?: Record<string, string | ProductAssociationChannelPricing>
  shippingRequired?: boolean
  images?: (string | ProductAssociationImage)[]
  id?: number
  code?: string
  product?: string
  optionValues?: (string | ProductAssociationOptionValue)[]
  position?: number
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: Record<string, ProductAssociationProductVariantTranslation | string>
  translation?: ProductAssociationProductVariantTranslation[]
  channelPricing?: ProductAssociationChannelPricing[]
  appliedPromotions?: ProductAssociationAppliedPromotion[]
  channels?: (string | ProductAssociationChannel)[]
  optionValue?: ProductAssociationOptionValue[]
  variant?: ProductAssociationProductVariant[]
  currentLocale?: string
  fallbackLocale?: string
  inStock?: boolean
  inventoryName?: string | null
  shippingWeight?: number | null
  shippingWidth?: number | null
  shippingHeight?: number | null
  shippingDepth?: number | null
  shippingVolume?: number | null
  option?: ProductAssociationOption[]
  value?: ProductAssociationOptionValue[]
  options?: ProductAssociationOption[]
  enabledVariants?: Record<string, unknown>
  [key: string]: unknown
}

export interface ProductAssociationAssociation {
  id?: number
  type: string
  owner: string
  associatedProducts: string[]
  associatedProduct?: ProductAssociationProduct[]
  createdAt?: string
  updatedAt?: string | null
  [key: string]: unknown
}

export interface ProductAssociationProduct {
  id?: number
  code?: string
  slug?: string | null
  enabled?: boolean
  name?: string | null
  description?: string | null
  shortDescription?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
  descriptor?: string
  variants?: ProductAssociationProductVariant[]
  channelPricing?: ProductAssociationChannelPricing[]
  channelPricings?: Record<string, string | ProductAssociationChannelPricing>
  translations?: Record<string, ProductAssociationProductTranslation | string>
  translation?: ProductAssociationProductTranslation[]
  currentLocale?: string
  fallbackLocale?: string
  createdAt?: string
  updatedAt?: string | null
  images?: (string | ProductAssociationImage)[]
  associations?: ProductAssociationAssociation[]
  attributes?: ProductAssociationAttributeValue[]
  options?: ProductAssociationOption[]
  value?: ProductAssociationOptionValue[]
  optionValue?: ProductAssociationOptionValue[]
  productVariants?: (string | ProductAssociationProductVariant)[]
  associatedProduct?: ProductAssociationProduct[]
  simple?: boolean
  configurable?: boolean
  translationClass?: unknown
  enabledVariants?: Record<string, unknown>
  [key: string]: unknown
}

export interface ProductAssociation {
  id?: number
  type: string
  owner: string
  associatedProducts: string[]
  associatedProduct?: ProductAssociationProduct[]
  createdAt?: string
  updatedAt?: string | null
  [key: string]: unknown
}

export interface ProductAssociationJsonld extends ProductAssociation {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ProductAssociationSyliusShopProductAssociationShow = ProductAssociation

export type ProductAssociationJsonldSyliusShopProductAssociationShow = ProductAssociationJsonld

export interface ProductAssociationInterface
  extends Omit<ProductAssociation, 'associatedProducts'> {
  associatedProducts: ProductAssociationProduct[]
}

export interface ProductAssociationInterfaceJsonld
  extends ProductAssociationInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductAssociationTypeTranslation {
  id?: number
  name: string | null
  locale: string
  translatable?: string
  translation?: unknown[]
  translations?: unknown[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationType {
  id?: number
  code: string
  name: string | null
  createdAt?: string
  updatedAt?: string | null
  translations?: Record<string, ProductAssociationTypeTranslation | string>
  translation?: ProductAssociationTypeTranslation[]
  currentLocale?: string
  fallbackLocale?: string
  [key: string]: unknown
}

export interface ProductAssociationTypeJsonld extends ProductAssociationType {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductAssociationTypeSyliusAdminProductAssociationTypeCreate {
  code: string
  translations: Record<string, { name: string }>
}

export type ProductAssociationTypeSyliusAdminProductAssociationTypeIndex = ProductAssociationType

export type ProductAssociationTypeSyliusAdminProductAssociationTypeShow = ProductAssociationType

export interface ProductAssociationTypeSyliusAdminProductAssociationTypeUpdate {
  translations: Record<string, { name: string }>
}

export interface ProductAssociationTypeSyliusShopProductAssociationTypeIndex {
  code: string
  name: string | null
}

export interface ProductAssociationTypeSyliusShopProductAssociationTypeShow {
  code: string
  name: string | null
}

export type ProductAssociationTypeJsonldSyliusAdminProductAssociationTypeIndex = ProductAssociationTypeJsonld

export type ProductAssociationTypeJsonldSyliusAdminProductAssociationTypeShow = ProductAssociationTypeJsonld

export interface ProductAssociationTypeJsonldSyliusShopProductAssociationTypeIndex
  extends ProductAssociationTypeSyliusShopProductAssociationTypeIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductAssociationTypeJsonldSyliusShopProductAssociationTypeShow
  extends ProductAssociationTypeSyliusShopProductAssociationTypeShow {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}
