import type { HydraContext } from './hydra'
import type * as ProductTypes from './product'

export interface ModelPaymentRequest {
  hash?: string | null
  state?: string
  action?: string
  payload?: Record<string, unknown>
  responseData?: Array<string | null>
  payment?: string
  method?: string
  createdAt?: string
  updatedAt?: string | null
}

export interface ModelPaymentInterface {
  order: string
  method?: string | null
  state: string
  currencyCode: string
  amount: number
  details?: Array<string | null>
  paymentRequests?: ModelPaymentRequest[]
  createdAt?: string
  updatedAt?: string | null
  id?: number
}

export interface ModelPaymentInterfaceJsonld extends ModelPaymentInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ModelProductInterface = ProductTypes.ProductInterface
export type ModelProductInterfaceJsonld = ProductTypes.ProductInterfaceJsonLd
export type ModelProductVariantInterface = ProductTypes.ProductVariantInterface
export type ModelProductVariantInterfaceJsonld =
  ProductTypes.ProductVariantInterfaceJsonLd
export type ModelProductImageInterface = ProductTypes.ProductImageInterface
export type ModelProductImageInterfaceJsonld =
  ProductTypes.ProductImageInterfaceJsonLd
export type ModelProductOption = ProductTypes.ProductOption
export type ModelProductOptionValue = ProductTypes.ProductOptionValue
export type ModelProductOptionValueSummary =
  ProductTypes.ProductOptionValueSummary
export type ModelProductOptionValueTranslation =
  ProductTypes.ProductOptionValueTranslation
export type ModelProductVariantTranslationSummary =
  ProductTypes.ProductVariantTranslationSummary
export type ModelProductVariantChannelPricing =
  ProductTypes.ProductVariantChannelPricing
export type ModelProductVariantChannelPricingPromotion =
  ProductTypes.ProductVariantChannelPricingPromotion
export type ModelProductPromotionAction = ProductTypes.ProductPromotionAction
export type ModelProductPromotionScope = ProductTypes.ProductPromotionScope
export type ModelProductChannel = ProductTypes.ProductChannel
export type ModelProductAttributeValue = ProductTypes.ProductAttributeValue
export type ModelProductAssociation = ProductTypes.ProductAssociation
export type ModelProductTaxon = ProductTypes.ProductTaxon
export type ModelProductRelationCollection =
  ProductTypes.ProductRelationCollection
export type ModelProductTranslationRelation =
  ProductTypes.ProductTranslationRelation
export type ModelProductTranslationReference =
  ProductTypes.ProductTranslationReference
export type ModelProductTranslationDetail =
  ProductTypes.ProductTranslationDetail
export type ModelProductTranslations = ProductTypes.ProductTranslations
