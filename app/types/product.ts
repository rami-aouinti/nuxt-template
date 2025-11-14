import type { HydraContext } from './hydra'
import type { TranslationInterface } from './tax'

export interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductTranslationPayload {
  name?: string
  slug?: string
  description?: string
  shortDescription?: string
  metaKeywords?: string
  metaDescription?: string
}

export type ProductTranslations = Record<string, ProductTranslationPayload | string>

export interface ProductTaxon {
  product: string
  taxon: string
  id?: number
  position?: number
}

export interface ProductTaxonJsonLd extends ProductTaxon, JsonLdResource {}

export interface ProductChannel {
  name: string
  description?: string | null
  hostname?: string | null
  color?: string | null
  code: string
  createdAt: string
  updatedAt?: string | null
  enabled: boolean
  id?: number
}

export interface ProductImage {
  type?: string | null
  file?: string | null
  path?: string | null
  owner?: unknown
  id?: unknown
}

export interface ProductTranslationEntry {
  translatable?: unknown
  locale?: string | null
  name?: string | null
  description?: string | null
  slug?: string | null
  descriptor?: string
  metaKeywords?: string | null
  metaDescription?: string | null
  attribute?: unknown
}

export interface ProductOptionValueTranslation {
  id?: number
  value: string
  locale: string
  translatable: string
  currentLocale?: string
  fallbackLocale?: string
}

export type ProductOptionValueTranslations = Record<
  string,
  ProductOptionValueTranslation | string
>

export interface ProductConfiguredOptionValue {
  option: string
  value?: string | null
  optionCode?: string | null
  name?: string | null
  translation?: TranslationInterface[] | null
  locale?: string | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface ProductVariantOptionValue extends ProductConfiguredOptionValue {
  id?: number
  code: string
  translations?: ProductOptionValueTranslations
}

export interface ProductVariantOptionValueJsonLd
  extends ProductVariantOptionValue,
    JsonLdResource {}

export interface CatalogPromotionTranslation {
  label?: string | null
  description?: string | null
  locale?: string
}

export type CatalogPromotionTranslations = Record<
  string,
  CatalogPromotionTranslation | string
>

export interface CatalogPromotionScope {
  type: string
  configuration?: Array<string | null>
  catalogPromotion?: string | null
  id?: number
}

export interface CatalogPromotionAction {
  type: string
  configuration?: Array<string | null>
  catalogPromotion?: string | null
  id?: number
}

export interface CatalogPromotion {
  channels?: string[]
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
  translations?: CatalogPromotionTranslations
  currentLocale?: string
  fallbackLocale?: string
  channel?: ProductChannel[]
  translationClass?: unknown
  label?: string | null
  description?: string | null
  translation?: TranslationInterface[] | null
  scope?: CatalogPromotionScope[]
  action?: CatalogPromotionAction[]
  exclusiveCatalogPromotionApplied?: boolean
}

export interface CatalogPromotionJsonLd
  extends CatalogPromotion,
    JsonLdResource {}

export interface ProductVariantChannelPricing {
  productVariant: string
  price?: number | null
  channelCode: string
  originalPrice?: number | null
  lowestPriceBeforeDiscount?: number | null
  minimumPrice?: number | null
  priceReduced?: boolean
  appliedPromotions?: CatalogPromotion[]
}

export interface ProductVariantTranslation {
  name?: string | null
}

export type ProductVariantTranslations = Record<
  string,
  ProductVariantTranslation | string
>

export interface ProductVariant {
  id?: number
  code: string
  product: string
  name?: string | null
  descriptor?: string
  position?: number
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  shippingRequired?: boolean
  currentLocale?: string
  fallbackLocale?: string
  optionValues?: Array<string | ProductVariantOptionValue>
  optionValue?: ProductConfiguredOptionValue[]
  translations?: ProductVariantTranslations
  translation?: TranslationInterface[] | null
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
  channelPricings?: Record<string, string | ProductVariantChannelPricing>
  images?: string[]
  inStock?: boolean
  inventoryName?: string | null
  shippingWeight?: number | null
  shippingWidth?: number | null
  shippingHeight?: number | null
  shippingDepth?: number | null
  shippingVolume?: number | null
  channelPricing?: ProductVariantChannelPricing[]
  appliedPromotions?: CatalogPromotion[]
  channel?: ProductChannel[]
}

export interface ProductVariantJsonLd extends ProductVariant, JsonLdResource {}

export interface ProductOption {
  name?: string | null
  position?: number
  values?: ProductVariantOptionValue[]
}

export interface ProductOptionJsonLd extends ProductOption, JsonLdResource {}

export interface ProductOptionValueSummary extends ProductConfiguredOptionValue {}

export interface ProductBase {
  variantSelectionMethod?: string
  productTaxons?: string[]
  channels?: string[]
  mainTaxon?: string | null
  reviews?: Record<string, unknown>
  averageRating?: number
  images?: string[]
  id?: number
  code: string
  attributes?: string[]
  variants?: string[]
  options?: string[]
  associations?: string[]
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: ProductTranslations
  currentLocale?: string
  fallbackLocale?: string
  variantSelectionMethodChoice?: boolean
  variantSelectionMethodLabel?: string
  productTaxon?: ProductTaxon[]
  taxons?: Record<string, unknown>
  channel?: ProductChannel[]
  shortDescription?: string | null
  image?: ProductImage[]
  variantSelectionMethodLabels?: unknown
  translation?: ProductTranslationEntry[] | null
  variant?: ProductVariant[]
  optionValue?: ProductOptionValueSummary[]
  enabledVariants?: Record<string, unknown>
  option?: ProductOption[]
  value?: ProductOptionValueSummary[]
  productVariants?: Array<string | ProductVariant>
  position?: number
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
  channelPricings?: Record<string, string | ProductVariantChannelPricing>
  shippingRequired?: boolean
  inStock?: boolean
  inventoryName?: string | null
  shippingWeight?: number | null
  shippingWidth?: number | null
  shippingHeight?: number | null
  shippingDepth?: number | null
  shippingVolume?: number | null
  channelPricing?: ProductVariantChannelPricing[]
  exclusiveCatalogPromotionApplied?: boolean
}

export interface ProductAssociationProduct extends Partial<ProductBase> {
  descriptor?: string
  description?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
  variants?: Array<string | ProductVariant>
}

export interface ProductAssociation {
  type: string
  owner: string
  associatedProducts?: Array<string | ProductAssociationProduct>
  associatedProduct?: ProductAssociationProduct[]
}

export interface ProductAssociationJsonLd
  extends ProductAssociation,
    JsonLdResource {}

export interface Product extends ProductBase {
  association?: ProductAssociation[]
}

export interface ProductJsonLd extends Product, JsonLdResource {}
