import type { HydraContext } from './hydra'
import type { TranslatableInterface, TranslationInterface } from './tax'

export type IriReference = string

export interface HydraJsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ProductOptionTranslation {
  id?: number
  name: string
  locale: string
  translatable?: IriReference
  currentLocale?: string
  fallbackLocale?: string
}

export type ProductOptionTranslationJsonLd =
  HydraJsonLdResource & ProductOptionTranslation

export interface ProductOptionTranslationSyliusAdminProductOptionCreate {
  name: string
  locale: string
}

export type ProductOptionTranslationSyliusAdminProductOptionIndex = {
  name: string
}

export type ProductOptionTranslationSyliusAdminProductOptionShow =
  ProductOptionTranslationSyliusAdminProductOptionIndex

export interface ProductOptionTranslationSyliusAdminProductOptionUpdate {
  name: string
  locale: string
}

export type ProductOptionTranslationJsonLdSyliusAdminProductOptionIndex =
  HydraJsonLdResource & ProductOptionTranslationSyliusAdminProductOptionIndex

export type ProductOptionTranslationJsonLdSyliusAdminProductOptionShow =
  HydraJsonLdResource & ProductOptionTranslationSyliusAdminProductOptionShow

export interface ProductOptionValueTranslation {
  id?: number
  value: string
  locale: string
  translatable?: IriReference
  currentLocale?: string
  fallbackLocale?: string
}

export type ProductOptionValueTranslationJsonLd =
  HydraJsonLdResource & ProductOptionValueTranslation

export interface ProductOptionValueTranslationSyliusAdminProductOptionCreate {
  value: string
  locale: string
}

export interface ProductOptionValueTranslationSyliusAdminProductOptionUpdate {
  value: string
  locale: string
}

export type ProductOptionValueTranslationSyliusAdminProductOptionValueShow = {
  value: string
}

export type ProductOptionValueTranslationJsonLdSyliusAdminProductOptionValueShow =
  HydraJsonLdResource & ProductOptionValueTranslationSyliusAdminProductOptionValueShow

export type ProductOptionValueTranslationMapEntry =
  | ProductOptionValueTranslationSyliusAdminProductOptionCreate
  | ProductOptionValueTranslationSyliusAdminProductOptionUpdate
  | ProductOptionValueTranslationSyliusAdminProductOptionValueShow
  | ProductOptionValueTranslation
  | ProductOptionValueTranslationJsonLd

export type ProductOptionValueTranslationMap = Record<string, ProductOptionValueTranslationMapEntry>

export interface ProductOptionValue {
  id?: number
  code: string
  option: IriReference
  translations?: ProductOptionValueTranslationMap | null
  currentLocale?: string
  fallbackLocale?: string
  value?: string | null
  optionCode?: string | null
  name?: string | null
  translation?: TranslationInterface[] | null
  translatable?: TranslatableInterface | null
  locale?: string | null
}

export type ProductOptionValueJsonLd = HydraJsonLdResource & ProductOptionValue

export interface ProductOptionValueSyliusAdminProductOptionCreate {
  code: string
  translations?: ProductOptionValueTranslationMap | null
}

export interface ProductOptionValueSyliusAdminProductOptionUpdate {
  code?: string
  translations?: ProductOptionValueTranslationMap | null
}

export interface ProductOptionValueSyliusAdminProductOptionValueShow {
  code: string
  option: IriReference
  translations?: ProductOptionValueTranslationMap | null
  value?: string | null
}

export type ProductOptionValueJsonLdSyliusAdminProductOptionValueShow =
  HydraJsonLdResource & ProductOptionValueSyliusAdminProductOptionValueShow

export interface ProductOptionValueSyliusShopProductOptionValueIndex {
  code: string
  option: IriReference
  value?: string | null
}

export type ProductOptionValueSyliusShopProductOptionValueShow =
  ProductOptionValueSyliusShopProductOptionValueIndex

export type ProductOptionValueJsonLdSyliusShopProductOptionValueIndex =
  HydraJsonLdResource & ProductOptionValueSyliusShopProductOptionValueIndex

export type ProductOptionValueJsonLdSyliusShopProductOptionValueShow =
  HydraJsonLdResource & ProductOptionValueSyliusShopProductOptionValueShow

export type ProductOptionTranslationsMapEntry =
  | ProductOptionTranslation
  | ProductOptionTranslationJsonLd
  | ProductOptionTranslationSyliusAdminProductOptionIndex
  | ProductOptionTranslationSyliusAdminProductOptionShow
  | IriReference

export type ProductOptionTranslationsMap = Record<string, ProductOptionTranslationsMapEntry>

export interface ProductOption {
  id?: number
  code: string
  position?: number
  values?: IriReference[]
  createdAt?: string
  updatedAt?: string | null
  translations?: ProductOptionTranslationsMap | null
  currentLocale?: string
  fallbackLocale?: string
  name?: string | null
  value?: ProductOptionValue[]
  translation?: TranslationInterface[] | null
}

export type ProductOptionJsonLd = HydraJsonLdResource & ProductOption

export type ProductOptionJsonLdSyliusAdminProductOptionIndex =
  HydraJsonLdResource & ProductOption

export type ProductOptionJsonLdSyliusAdminProductOptionShow =
  HydraJsonLdResource & ProductOption

export interface ProductOptionSyliusShopProductOptionIndex {
  code: string
  name?: string | null
}

export type ProductOptionSyliusShopProductOptionShow = ProductOptionSyliusShopProductOptionIndex & {
  values?: IriReference[]
}

export type ProductOptionJsonLdSyliusShopProductOptionIndex =
  HydraJsonLdResource & ProductOptionSyliusShopProductOptionIndex

export type ProductOptionJsonLdSyliusShopProductOptionShow =
  HydraJsonLdResource & ProductOptionSyliusShopProductOptionShow

export interface ProductOptionInterface extends ProductOption {
  values?: ProductOptionValue[]
}

export type ProductOptionInterfaceJsonLd =
  HydraJsonLdResource & ProductOptionInterface

export interface ProductReview {
  id?: number
  title?: string | null
  rating: number
  comment?: string | null
  author?: IriReference
  status?: string
  reviewSubject?: IriReference
  createdAt?: string
  updatedAt?: string | null
}

export type ProductReviewSyliusAdminProductReviewIndex = ProductReview

export type ProductReviewSyliusAdminProductReviewShow = ProductReviewSyliusAdminProductReviewIndex

export interface ProductReviewSyliusAdminProductReviewUpdate {
  title?: string | null
  rating?: number
  comment?: string | null
}

export interface ProductReviewSyliusShopProductReviewIndex extends ProductReview {
  author?: {
    firstName?: string | null
  }
}

export type ProductReviewSyliusShopProductReviewShow = ProductReviewSyliusShopProductReviewIndex

export interface ProductReviewAddProductReviewSyliusShopProductReviewCreate {
  title: string
  rating: number
  comment: string
  product: string
  email?: string | null
}

export type ProductReviewJsonLd = HydraJsonLdResource & ProductReview

export type ProductReviewJsonLdSyliusAdminProductReviewIndex =
  HydraJsonLdResource & ProductReviewSyliusAdminProductReviewIndex

export type ProductReviewJsonLdSyliusAdminProductReviewShow =
  HydraJsonLdResource & ProductReviewSyliusAdminProductReviewShow

export type ProductReviewJsonLdSyliusShopProductReviewIndex =
  HydraJsonLdResource & ProductReviewSyliusShopProductReviewIndex

export type ProductReviewJsonLdSyliusShopProductReviewShow =
  HydraJsonLdResource & ProductReviewSyliusShopProductReviewShow

export interface ProductTaxon {
  id?: number
  product: IriReference
  taxon: IriReference
  position: number
}

export type ProductTaxonSyliusAdminProductTaxonCreate = ProductTaxon

export type ProductTaxonSyliusAdminProductTaxonIndex = ProductTaxon

export type ProductTaxonSyliusAdminProductTaxonShow = ProductTaxon

export interface ProductTaxonSyliusAdminProductTaxonUpdate {
  position: number
}

export type ProductTaxonSyliusShopProductTaxonShow = ProductTaxon

export type ProductTaxonJsonLd = HydraJsonLdResource & ProductTaxon

export type ProductTaxonJsonLdSyliusAdminProductTaxonIndex =
  HydraJsonLdResource & ProductTaxonSyliusAdminProductTaxonIndex

export type ProductTaxonJsonLdSyliusAdminProductTaxonShow =
  HydraJsonLdResource & ProductTaxonSyliusAdminProductTaxonShow

export type ProductTaxonJsonLdSyliusShopProductTaxonShow =
  HydraJsonLdResource & ProductTaxonSyliusShopProductTaxonShow

export type ProductTaxonInterface = ProductTaxon

export type ProductTaxonInterfaceJsonLd =
  HydraJsonLdResource & ProductTaxonInterface

export interface ProductTranslation {
  id?: number
  name: string
  slug: string
  shortDescription?: string | null
  description?: string | null
  metaKeywords?: string | null
  metaDescription?: string | null
  locale: string
  translatable?: IriReference
}

export type ProductTranslationJsonLd =
  HydraJsonLdResource & ProductTranslation

export interface ProductVariantTranslation {
  id?: number
  name?: string | null
  locale: string
  translatable?: IriReference
}

export type ProductVariantTranslationJsonLd =
  HydraJsonLdResource & ProductVariantTranslation

export interface ProductVariantChannelPricing {
  id?: number
  channelCode: string
  productVariant: IriReference
  price?: number | null
  originalPrice?: number | null
  lowestPriceBeforeDiscount?: number | null
  minimumPrice?: number | null
  appliedPromotions?: IriReference[] | ProductVariantAppliedPromotion[]
  priceReduced?: boolean
  exclusiveCatalogPromotionApplied?: boolean
}

export interface ProductVariantAppliedPromotion {
  id?: number
  name?: string | null
  code?: string
  channelCode?: string
  startDate?: string | null
  endDate?: string | null
  priority?: number
  exclusive?: boolean
  state?: string
}

export interface ProductVariantChannel {
  id?: number
  name: string
  description?: string | null
  hostname?: string | null
  color?: string | null
  code: string
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
}

export interface ProductVariantImage {
  id?: number
  type?: string | null
  file?: string | null
  path?: string | null
  owner?: IriReference
  productVariants?: (IriReference | ProductVariant)[]
}

export type ProductVariantOptionValue = ProductOptionValue

export interface ProductVariant {
  id?: number
  code: string
  product: IriReference
  version?: number
  onHold?: number
  onHand?: number
  tracked?: boolean
  weight?: number | null
  width?: number | null
  height?: number | null
  depth?: number | null
  taxCategory?: IriReference | null
  shippingCategory?: IriReference | null
  channelPricings?: Record<string, IriReference | ProductVariantChannelPricing>
  shippingRequired?: boolean
  images?: IriReference[]
  optionValues?: IriReference[]
  position?: number
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: Record<string, ProductVariantTranslation | { name: string } | IriReference>
  currentLocale?: string
  fallbackLocale?: string
  inStock?: boolean
  inventoryName?: string | null
  shippingWeight?: number | null
  shippingWidth?: number | null
  shippingHeight?: number | null
  shippingDepth?: number | null
  shippingVolume?: number | null
  channelPricing?: ProductVariantChannelPricing[]
  appliedPromotions?: ProductVariantAppliedPromotion[]
  channels?: (IriReference | ProductVariantChannel)[]
  translation?: TranslationInterface[] | null
  optionValue?: ProductVariantOptionValue[]
  optionValuesDetailed?: ProductVariantOptionValue[]
  names?: string | null
  image?: ProductVariantImage[]
  descriptor?: string
  onHandProjection?: number
  onHoldProjection?: number
}

export type ProductVariantJsonLd = HydraJsonLdResource & ProductVariant

export interface ProductVariantSyliusAdminProductVariantCreate {
  code: string
  product: IriReference
  onHold?: number
  onHand?: number
  tracked?: boolean
  weight?: number | null
  width?: number | null
  height?: number | null
  depth?: number | null
  taxCategory?: IriReference | null
  shippingCategory?: IriReference | null
  channelPricings?: Record<string, ProductVariantChannelPricing>
  shippingRequired?: boolean
  optionValues?: IriReference[]
  position?: number
  enabled?: boolean
  translations?: Record<string, ProductVariantTranslation | { name: string }>
}

export type ProductVariantSyliusAdminProductVariantIndex = ProductVariant

export type ProductVariantSyliusAdminProductVariantShow = ProductVariantSyliusAdminProductVariantIndex

export interface ProductVariantSyliusAdminProductVariantUpdate {
  onHold?: number
  onHand?: number
  tracked?: boolean
  weight?: number | null
  width?: number | null
  height?: number | null
  depth?: number | null
  taxCategory?: IriReference | null
  shippingCategory?: IriReference | null
  channelPricings?: Record<string, ProductVariantChannelPricing>
  shippingRequired?: boolean
  optionValues?: IriReference[]
  position?: number
  enabled?: boolean
  translations?: Record<string, ProductVariantTranslation | { name: string }>
}

export interface ProductVariantSyliusShopProductVariantIndex {
  code: string
  product: IriReference
  optionValues?: IriReference[]
  name?: string | null
  inStock?: boolean
  price?: number
  originalPrice?: number
  lowestPriceBeforeDiscount?: number | null
  appliedPromotions?: IriReference[]
}

export type ProductVariantSyliusShopProductVariantShow = ProductVariantSyliusShopProductVariantIndex

export type ProductVariantJsonLdSyliusAdminProductVariantIndex =
  HydraJsonLdResource & ProductVariantSyliusAdminProductVariantIndex

export type ProductVariantJsonLdSyliusAdminProductVariantShow =
  HydraJsonLdResource & ProductVariantSyliusAdminProductVariantShow

export type ProductVariantJsonLdSyliusShopProductVariantIndex =
  HydraJsonLdResource & ProductVariantSyliusShopProductVariantIndex

export type ProductVariantJsonLdSyliusShopProductVariantShow =
  HydraJsonLdResource & ProductVariantSyliusShopProductVariantShow

export type ProductVariantInterface = ProductVariant

export type ProductVariantInterfaceJsonLd =
  HydraJsonLdResource & ProductVariantInterface
