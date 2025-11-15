import type { HydraContext } from './hydra'
import type { TranslationInterface } from './tax'

export interface ProductTranslationRelation {
  translations?: TranslationInterface[] | null
  translation?: TranslationInterface[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface ProductTranslationReference {
  translatable?: ProductTranslationRelation | null
  locale?: string | null
}

export interface ProductOptionValueTranslation {
  id?: number
  value: string
  locale: string
  translatable?: string
  translation?: ProductTranslationReference[] | null
  translations?: ProductTranslationReference[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface ProductOptionValueSummary {
  option: string
  value: string | null
  optionCode?: string | null
  name?: string | null
  translation?: ProductTranslationReference[] | null
}

export interface ProductOptionValue extends ProductOptionValueSummary {
  id?: number
  code: string
  translations?: Record<string, ProductOptionValueTranslation>
  translatable?: string
  currentLocale?: string
  fallbackLocale?: string
}

export interface ProductImageVariantReference {
  name?: string | null
  descriptor?: string
  optionValues?: ProductOptionValue[]
  optionValue?: ProductOptionValueSummary[]
  translation?: ProductTranslationReference[] | null
}

export interface ProductImageInterface {
  type?: string | null
  file?: string | null
  path?: string | null
  owner?: string
  id?: number
  position?: number
  name?: string | null
  descriptor?: string
  optionValue?: ProductOptionValueSummary[]
  variant?: ProductImageVariantReference[]
  productVariants?: string[]
  productVariant?: ProductVariantInterface[]
  translation?: ProductTranslationReference[] | null
}

export interface ProductImageInterfaceJsonLd extends ProductImageInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductVariantTranslationSummary {
  id?: number
  name: string | null
  locale: string
  translatable?: string
  translation?: ProductTranslationReference[] | null
  translations?: ProductTranslationReference[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface ProductPromotionScope {
  type: string
  configuration: (string | null)[]
  catalogPromotion?: string | null
  id?: number
}

export interface ProductPromotionAction {
  type: string
  configuration: (string | null)[]
  catalogPromotion?: string | null
  id?: number
}

export interface ProductChannel {
  name: string
  description: string | null
  hostname: string | null
  color: string | null
  code: string
  createdAt: string
  updatedAt: string | null
  enabled: boolean
  id: number
}

export interface ProductVariantChannelPricingPromotion {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  channels?: string[]
  id: number
  name: string
  code: string
  startDate: string | null
  endDate: string | null
  priority: number
  exclusive: boolean
  state: string
  scopes: string[]
  actions: string[]
  enabled: boolean
  translations?: Record<
    string,
    { label: string; description: string; locale: string }
  >
  currentLocale?: string
  fallbackLocale?: string
  channel?: ProductChannel[]
  translationClass?: unknown
  label?: string | null
  description?: string | null
  translation?: ProductTranslationReference[] | null
  scope?: ProductPromotionScope[]
  catalogPromotion?: string | null
  action?: ProductPromotionAction[]
  exclusiveCatalogPromotionApplied?: boolean
  image?: unknown[]
}

export interface ProductVariantChannelPricing {
  productVariant: string
  price: number | null
  channelCode: string
  originalPrice: number | null
  lowestPriceBeforeDiscount: number | null
  minimumPrice: number | null
  priceReduced?: boolean
  appliedPromotions?: ProductVariantChannelPricingPromotion[]
}

export interface ProductVariantInterface {
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
  channelPricings?: Record<string, string>
  shippingRequired?: boolean
  images?: string[]
  id?: number
  code: string
  product?: string
  optionValues?: string[]
  position?: number
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: Record<string, ProductVariantTranslationSummary>
  currentLocale?: string
  fallbackLocale?: string
  name?: string | null
  descriptor?: string
  optionValuesCollection?: ProductOptionValue[]
  optionValue?: ProductOptionValueSummary[]
  translation?: ProductTranslationReference[] | null
  inStock?: boolean
  inventoryName?: string | null
  shippingWeight?: number | null
  shippingWidth?: number | null
  shippingHeight?: number | null
  shippingDepth?: number | null
  shippingVolume?: number | null
  channelPricing?: ProductVariantChannelPricing[]
}

export interface ProductVariantInterfaceJsonLd extends ProductVariantInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductAttributeValue {
  id?: number
  subject?: string
  attribute: string
  localeCode?: string | null
  product?: string | null
  value: unknown
  name?: string | null
  type?: string | null
  code?: string | null
  text?: string | null
  boolean?: boolean | null
  integer?: number | null
  float?: number | null
  datetime?: string | null
  date?: string | null
  json?: (string | null)[] | null
  translation?: ProductTranslationReference[] | null
}

export interface ProductAssociation {
  id?: number
  type: string
  owner?: string
  associatedProducts?: string[]
  createdAt?: string
  updatedAt?: string | null
  associatedProduct?: unknown[]
  translation?: ProductTranslationReference[] | null
}

export interface ProductTaxon {
  product: string
  taxon: string
  id?: number
  position?: number
  translation?: ProductTranslationReference[] | null
}

export interface ProductRelationCollection {
  empty?: unknown
  keys?: unknown
  values?: unknown
  iterator?: unknown
}

export interface ProductOptionTranslation {
  id?: number
  name: string | null
  locale: string
  translatable?: string
  translation?: ProductTranslationReference[] | null
  translations?: ProductTranslationReference[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface ProductOption {
  id?: number
  code: string
  position?: number
  values?: string[]
  createdAt?: string
  updatedAt?: string | null
  translations?: Record<string, ProductOptionTranslation>
  currentLocale?: string
  fallbackLocale?: string
  name?: string | null
  value?: ProductOptionValue[]
  translation?: ProductTranslationReference[] | null
}

export interface ProductTranslationDetail {
  shortDescription?: string | null
  id?: number
  name: string
  slug: string
  description?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
  locale: string
  translatable?: string
  translation?: ProductTranslationReference[] | null
  translations?: ProductTranslationReference[] | null
  currentLocale?: string
  fallbackLocale?: string
  createdAt?: string
  updatedAt?: string | null
}

export type ProductTranslations = Record<string, ProductTranslationDetail>

export interface ProductInterface {
  variantSelectionMethod?: string
  productTaxons?: string[]
  channels?: string[]
  mainTaxon?: string | null
  reviews?: string[]
  averageRating?: number
  images?: ProductImageInterface[]
  productVariants?: string[]
  id?: number
  type?: string | null
  path?: string
  code: string
  attributes?: ProductAttributeValue[]
  attribute?: ProductAttributeValue[]
  variants?: string[]
  variant?: ProductVariantInterface[]
  options?: string[]
  option?: ProductOption[]
  value?: ProductOptionValue[]
  associations?: string[]
  association?: ProductAssociation[]
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: ProductTranslations
  currentLocale?: string
  fallbackLocale?: string
  translation?: ProductTranslationReference[] | null
  shortDescription?: string | null
  description?: string | null
  slug?: string | null
  name?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
  descriptor?: string
  attributeValues?: ProductAttributeValue[]
  variantSelectionMethodChoice?: boolean
  variantSelectionMethodLabel?: string
  productTaxon?: ProductTaxon[]
  taxons?: ProductRelationCollection
  enabledVariants?: ProductRelationCollection
  channel?: ProductChannel[]
  image?: ProductImageInterface[]
  simple?: boolean
  configurable?: boolean
}

export interface ProductInterfaceJsonLd extends ProductInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductTranslationPayload {
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
}

export type ProductTranslationsPayload = Record<
  string,
  ProductTranslationPayload
>

export interface ProductAttributeAssignmentPayload {
  attribute: string
  localeCode?: string | null
  value: unknown
}

export interface ProductSyliusAdminProductCreate {
  variantSelectionMethod?: string
  channels?: string[]
  mainTaxon?: string | null
  images?: string[]
  code: string
  attributes?: ProductAttributeAssignmentPayload[]
  options?: string[]
  enabled?: boolean
  translations?: ProductTranslationsPayload
}

export type ProductSyliusAdminProductIndex = ProductInterface

export type ProductSyliusAdminProductShow = ProductInterface

export interface ProductSyliusAdminProductUpdate {
  channels?: string[]
  mainTaxon?: string | null
  images?: string[]
  attributes?: ProductAttributeAssignmentPayload[]
  options?: string[]
  enabled?: boolean
  translations?: ProductTranslationsPayload
}

export type ProductSyliusAdminProductImageShow = ProductImageInterface

export interface ProductImageSyliusAdminProductImageUpdate {
  productVariants?: string[]
  position?: number
  type?: string | null
}

export interface ProductImageSummary extends ProductImageInterface {
  id: number
  path: string
  type?: string | null
}

export type ProductImageSyliusShopProductIndex = ProductImageSummary

export type ProductImageSyliusShopProductShow = ProductImageSummary

export type ProductImageSyliusShopProductImageShow = ProductImageSummary

export interface ProductSyliusShopProductIndex extends ProductInterface {
  reviews?: string[]
}

export interface ProductSyliusShopProductShow extends ProductInterface {
  reviews?: string[]
}

export type ProductJsonld = ProductInterfaceJsonLd

export type ProductJsonldSyliusAdminProductIndex = ProductInterfaceJsonLd

export type ProductJsonldSyliusAdminProductShow = ProductInterfaceJsonLd

export type ProductJsonldSyliusShopProductIndex = ProductInterfaceJsonLd

export type ProductJsonldSyliusShopProductShow = ProductInterfaceJsonLd

export type ProductImageJsonld = ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusAdminProductIndex =
  ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusAdminProductShow =
  ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusAdminProductImageIndex =
  ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusAdminProductImageShow =
  ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusShopProductIndex =
  ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusShopProductShow =
  ProductImageInterfaceJsonLd

export type ProductImageJsonldSyliusShopProductImageShow =
  ProductImageInterfaceJsonLd

export interface ProductVariantCollection {
  productVariant?: ProductVariantInterface[]
}

export interface ProductImageCollection {
  image?: ProductImageInterface[]
}
