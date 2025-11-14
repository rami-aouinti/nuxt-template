import type { HydraContext } from './hydra'
import type { TranslationInterface } from './tax'

export interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ProductAttributeType =
  | 'text'
  | 'textarea'
  | 'checkbox'
  | 'integer'
  | 'float'
  | 'percent'
  | 'datetime'
  | 'date'
  | 'select'

export interface ProductAttributeTranslation {
  id?: number
  name: string
  locale?: string
  translatable?: string
}

export type ProductAttributeTranslationSyliusAdminProductAttributeIndex = ProductAttributeTranslation

export type ProductAttributeTranslationSyliusAdminProductAttributeShow = ProductAttributeTranslation

export interface ProductAttributeTranslationJsonLd
  extends JsonLdResource,
    ProductAttributeTranslation {}

export type ProductAttributeTranslationJsonLdSyliusAdminProductAttributeIndex = ProductAttributeTranslationJsonLd

export type ProductAttributeTranslationJsonLdSyliusAdminProductAttributeShow = ProductAttributeTranslationJsonLd

export interface ProductAttributeBase {
  code: string
  type: ProductAttributeType
  position: number
  name?: string | null
  configuration?: Array<string | null>
  storageType?: string
  translatable?: boolean
  createdAt?: string
  updatedAt?: string | null
  translations?: Record<string, ProductAttributeTranslation>
  currentLocale?: string
  fallbackLocale?: string
  translation?: TranslationInterface[] | null
}

export interface ProductAttribute extends ProductAttributeBase {
  id?: number
}

export type ProductAttributeSyliusAdminProductAttributeIndex = ProductAttribute

export type ProductAttributeSyliusAdminProductAttributeShow = ProductAttribute

export type ProductAttributeSyliusShopProductAttributeShow = ProductAttribute

export interface ProductAttributeJsonLd extends JsonLdResource, ProductAttribute {}

export type ProductAttributeJsonLdSyliusAdminProductAttributeIndex = ProductAttributeJsonLd

export type ProductAttributeJsonLdSyliusAdminProductAttributeShow = ProductAttributeJsonLd

export type ProductAttributeJsonLdSyliusShopProductAttributeShow = ProductAttributeJsonLd

export interface ProductAttributeTranslationPayload {
  name: string
  locale: string
}

export type ProductAttributeTranslationSyliusAdminProductAttributeCreate = ProductAttributeTranslationPayload

export type ProductAttributeTranslationSyliusAdminProductAttributeUpdate = ProductAttributeTranslationPayload

export interface ProductAttributeValuePayload {
  attribute: string
  localeCode?: string | null
  value: unknown
}

export type ProductAttributeValueSyliusAdminProductCreate = ProductAttributeValuePayload

export type ProductAttributeValueSyliusAdminProductUpdate = ProductAttributeValuePayload

export interface ProductSummary {
  id?: number
  code: string
  name?: string | null
  slug?: string | null
  description?: string | null
  enabled?: boolean
  createdAt?: string
  updatedAt?: string | null
  [key: string]: unknown
}

export interface ProductAttributeValue {
  id?: number
  subject?: string
  attribute: string
  localeCode?: string | null
  product?: ProductSummary | null
  value?: unknown
  name?: string | null
  type?: ProductAttributeType | string | null
  code?: string | null
  text?: string | null
  boolean?: boolean | null
  integer?: number | null
  float?: number | null
  datetime?: string | null
  date?: string | null
  json?: Array<string | null> | null
  createdAt?: string
  updatedAt?: string | null
  translation?: TranslationInterface[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export type ProductAttributeValueSyliusAdminProductIndex = ProductAttributeValue

export type ProductAttributeValueSyliusAdminProductShow = ProductAttributeValue

export type ProductAttributeValueSyliusAdminProductAttributeValueShow = ProductAttributeValue

export type ProductAttributeValueSyliusShopProductAttributeValueShow = ProductAttributeValue

export interface ProductAttributeValueJsonLd
  extends JsonLdResource,
    ProductAttributeValue {}

export type ProductAttributeValueJsonLdSyliusAdminProductIndex = ProductAttributeValueJsonLd

export type ProductAttributeValueJsonLdSyliusAdminProductShow = ProductAttributeValueJsonLd

export type ProductAttributeValueJsonLdSyliusAdminProductAttributeValueShow = ProductAttributeValueJsonLd

export type ProductAttributeValueJsonLdSyliusShopProductAttributeValueShow = ProductAttributeValueJsonLd

export interface ProductImage {
  productVariants?: string[]
  position?: number
  id?: number
  type?: string | null
  file?: string | null
  path: string
  owner?: string
}

export type ProductImageSyliusAdminProductIndex = ProductImage

export type ProductImageSyliusAdminProductShow = ProductImage

export type ProductImageSyliusAdminProductImageIndex = ProductImage

export type ProductImageSyliusAdminProductImageShow = ProductImage

export interface ProductImageSyliusAdminProductImageUpdate {
  productVariants?: string[]
  position?: number
  type?: string | null
}

export type ProductImageSyliusShopProductIndex = ProductImage

export type ProductImageSyliusShopProductShow = ProductImage

export type ProductImageSyliusShopProductImageShow = ProductImage

export interface ProductImageJsonLd extends JsonLdResource, ProductImage {}

export type ProductImageJsonLdSyliusAdminProductIndex = ProductImageJsonLd

export type ProductImageJsonLdSyliusAdminProductShow = ProductImageJsonLd

export type ProductImageJsonLdSyliusAdminProductImageIndex = ProductImageJsonLd

export type ProductImageJsonLdSyliusAdminProductImageShow = ProductImageJsonLd

export type ProductImageJsonLdSyliusShopProductIndex = ProductImageJsonLd

export type ProductImageJsonLdSyliusShopProductShow = ProductImageJsonLd

export type ProductImageJsonLdSyliusShopProductImageShow = ProductImageJsonLd

export interface ProductImageInterface extends ProductImage {
  productVariant?: Record<string, unknown>[]
  image?: ProductImageInterface[]
  [key: string]: unknown
}

export interface ProductImageInterfaceJsonLd
  extends JsonLdResource,
    ProductImageInterface {}
