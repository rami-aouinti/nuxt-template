import type { HydraContext } from './hydra'
import type { PromotionChannel } from './promotion'
import type { TranslationInterface } from './tax'

export interface CatalogPromotionTranslationSummary {
  label: string | null
  description: string | null
  locale: string
  currentLocale?: string
  fallbackLocale?: string
}

export type CatalogPromotionTranslations = Record<string, CatalogPromotionTranslationSummary>

export interface CatalogPromotionTranslation
  extends CatalogPromotionTranslationSummary {
  translatable?: string | null
  translation?: TranslationInterface[] | null
  translations?: TranslationInterface[] | null
}

export interface CatalogPromotionScopeReference {
  type: string
  configuration: (string | null)[]
  catalogPromotion: string | null
}

export interface CatalogPromotionScope extends CatalogPromotionScopeReference {
  id: number
}

export interface CatalogPromotionActionReference {
  type: string
  configuration: (string | null)[]
  catalogPromotion: string | null
}

export interface CatalogPromotionAction extends CatalogPromotionActionReference {
  id: number
}

export interface CatalogPromotion {
  channels: string[]
  id: number
  name: string | null
  code: string
  startDate: string | null
  endDate: string | null
  priority: number
  exclusive: boolean
  state: string
  scopes: string[]
  actions: string[]
  enabled: boolean
  translations?: CatalogPromotionTranslations
  channel?: PromotionChannel[]
  translation?: CatalogPromotionTranslation[]
  scope?: CatalogPromotionScope[]
  action?: CatalogPromotionAction[]
  exclusiveCatalogPromotionApplied?: boolean
}

export interface CatalogPromotionJsonLd extends CatalogPromotion {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductVariantChannelPricingBase {
  productVariant: string
  price: number | null
  channelCode: string
  originalPrice: number | null
  lowestPriceBeforeDiscount: number | null
  minimumPrice: number | null
  priceReduced?: boolean
  appliedPromotions: (string | CatalogPromotionJsonLd)[]
}

export interface ProductVariantChannelPricing extends ProductVariantChannelPricingBase {
  id: number
  exclusiveCatalogPromotionApplied?: boolean
}

export interface ProductVariantChannelPricingJsonLd extends ProductVariantChannelPricing {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ProductVariantChannelPricingsMap = Record<string, ProductVariantChannelPricingJsonLd>

export interface ProductOptionValueTranslation extends TranslationInterface {
  locale: string | null
  values?: unknown[]
  value?: string | null
  name?: string | null
  optionCode?: string | null
}

export interface ProductOptionValue {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  id: number
  code: string
  option: string
  translations?: Record<string, string>
  currentLocale?: string
  fallbackLocale?: string
  value?: string | null
  optionCode?: string | null
  name?: string | null
  translation?: ProductOptionValueTranslation[]
}

export interface ProductVariantOptionValue extends ProductOptionValue {
  productVariant?: string
}

export interface ProductVariantImageReference {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  productVariants?: string[]
  position?: number
  id: number
  type: string | null
  file: string | null
  path: string
  owner: string
  image?: string[]
}

export interface ProductVariant {
  weight: number | null
  width: number | null
  height: number | null
  depth: number | null
  taxCategory: string | null
  shippingCategory: string | null
  channelPricings?: ProductVariantChannelPricingsMap
  channelPricing?: ProductVariantChannelPricing[]
  channels?: string[]
  id: number
  name: string | null
  code: string
  shippingRequired: boolean
  descriptor?: string
  optionValues?: ProductVariantOptionValue[]
  optionValue?: ProductVariantOptionValue[]
  translation?: ProductOptionValueTranslation[]
  locale?: string | null
  product?: string
  position?: number
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  inStock?: boolean
  onHold?: number
  onHand?: number
  tracked?: boolean
  version?: number
  images?: ProductVariantImageReference[]
  productVariants?: string[]
  simplified?: boolean
  configurable?: boolean
}

export interface ProductVariantJsonLd extends ProductVariant {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductAttributeValue {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  id: number
  subject: string
  attribute: string
  localeCode: string | null
  product?: ProductVariantJsonLd | null
  value: unknown
  name?: string | null
  type?: string | null
  code?: string | null
}

export interface ProductImage extends ProductVariantImageReference {
  productVariant?: string[]
  product?: string
}

export interface ProductTranslation {
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  metaKeywords: string | null
  metaDescription: string | null
  locale: string
  currentLocale?: string
  fallbackLocale?: string
}

export type ProductTranslations = Record<string, ProductTranslation>

export interface Product {
  productTaxons: string[]
  channels: string[]
  mainTaxon: string | null
  reviews: string[]
  averageRating: number
  images?: ProductImage[]
  productVariants: string[]
  id: number
  type: string | null
  path: string
  code: string
  variants?: string[]
  options?: string[]
  associations?: string[]
  createdAt: string
  updatedAt: string | null
  enabled: boolean
  translations?: ProductTranslations
  shortDescription?: string | null
  description?: string | null
  name?: string | null
  slug?: string | null
  translation?: ProductOptionValueTranslation[]
}

export interface ProductJsonLd extends Product {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductAssociation {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  id: number
  type: string
  owner: string
  associatedProducts: string[]
  createdAt: string
  updatedAt: string | null
  associatedProduct?: ProductJsonLd[]
}

export type ProductVariantCollection = ProductVariantJsonLd[]

export type ProductCollection = ProductJsonLd[]

export type ProductJsonLdSyliusAdminProductIndex = ProductJsonLd

export type ProductJsonLdSyliusAdminProductShow = ProductJsonLd

export type ProductJsonLdSyliusShopProductIndex = ProductJsonLd

export type ProductJsonLdSyliusShopProductShow = ProductJsonLd

export type ProductJsonLdSyliusAdminProductImageShow = ProductJsonLd

export type ProductVariantJsonLdSyliusAdminProductIndex = ProductVariantJsonLd

export type ProductVariantJsonLdSyliusAdminProductShow = ProductVariantJsonLd

export type ProductVariantJsonLdSyliusShopProductIndex = ProductVariantJsonLd

export type ProductVariantJsonLdSyliusShopProductShow = ProductVariantJsonLd
