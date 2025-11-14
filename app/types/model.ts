import type { HydraContext } from './hydra'
import type * as ProductTypes from './product'

export namespace Model {
  export interface PaymentRequest {
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

  export interface PaymentInterface {
    order: string
    method?: string | null
    state: string
    currencyCode: string
    amount: number
    details?: Array<string | null>
    paymentRequests?: PaymentRequest[]
    createdAt?: string
    updatedAt?: string | null
    id?: number
  }

  export interface PaymentInterfaceJsonld extends PaymentInterface {
    '@context'?: HydraContext
    '@id'?: string
    '@type'?: string
  }

  export type ProductInterface = ProductTypes.ProductInterface
  export type ProductInterfaceJsonld = ProductTypes.ProductInterfaceJsonLd
  export type ProductVariantInterface = ProductTypes.ProductVariantInterface
  export type ProductVariantInterfaceJsonld = ProductTypes.ProductVariantInterfaceJsonLd
  export type ProductImageInterface = ProductTypes.ProductImageInterface
  export type ProductImageInterfaceJsonld = ProductTypes.ProductImageInterfaceJsonLd
  export type ProductOption = ProductTypes.ProductOption
  export type ProductOptionValue = ProductTypes.ProductOptionValue
  export type ProductOptionValueSummary = ProductTypes.ProductOptionValueSummary
  export type ProductOptionValueTranslation = ProductTypes.ProductOptionValueTranslation
  export type ProductVariantTranslationSummary = ProductTypes.ProductVariantTranslationSummary
  export type ProductVariantChannelPricing = ProductTypes.ProductVariantChannelPricing
  export type ProductVariantChannelPricingPromotion = ProductTypes.ProductVariantChannelPricingPromotion
  export type ProductPromotionAction = ProductTypes.ProductPromotionAction
  export type ProductPromotionScope = ProductTypes.ProductPromotionScope
  export type ProductChannel = ProductTypes.ProductChannel
  export type ProductAttributeValue = ProductTypes.ProductAttributeValue
  export type ProductAssociation = ProductTypes.ProductAssociation
  export type ProductTaxon = ProductTypes.ProductTaxon
  export type ProductRelationCollection = ProductTypes.ProductRelationCollection
  export type ProductTranslationRelation = ProductTypes.ProductTranslationRelation
  export type ProductTranslationReference = ProductTypes.ProductTranslationReference
  export type ProductTranslationDetail = ProductTypes.ProductTranslationDetail
  export type ProductTranslations = ProductTypes.ProductTranslations
}
