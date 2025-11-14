import type { HydraContext } from './hydra'
import type {
  ShopBillingData,
  ShopBillingDataAttributes,
  ShopBillingDataJsonldNoId,
  ShopBillingDataSyliusAdminChannelCreateNoId,
  ShopBillingDataSyliusAdminChannelIndexNoId,
  ShopBillingDataSyliusAdminChannelShowNoId,
  ShopBillingDataSyliusAdminChannelUpdateNoId,
} from './shopBillingData'
import type {
  ProductPromotionAction,
  ProductPromotionScope,
  ProductVariantChannelPricingPromotion,
} from './product'
import type { TaxonJsonLdNoId, TaxonNoId } from './tax'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ChannelCurrency {
  name?: string | null
  code: string
  createdAt: string
  updatedAt?: string | null
  id?: number
}

export interface ChannelLocale {
  name?: string | null
  id?: number
  code: string
  createdAt: string
  updatedAt?: string | null
}

export interface ChannelCountryProvince {
  id?: number
  code: string
  name: string
  abbreviation?: string | null
  country: string
}

export interface ChannelCountry {
  name?: string | null
  provinces?: ChannelCountryProvince[]
}

export interface ChannelProvince {
  name: string
  abbreviation?: string | null
  country: string
  id?: number
  code: string
  enabled: boolean
}

export interface ChannelPriceHistoryConfigAttributes {
  lowestPriceForDiscountedProductsCheckingPeriod?: number
  lowestPriceForDiscountedProductsVisible?: boolean
  taxonsExcludedFromShowingLowestPrice?: TaxonNoId[]
}

export interface ChannelPriceHistoryConfig
  extends ChannelPriceHistoryConfigAttributes {
  id?: number
}

export type ChannelPriceHistoryConfigSyliusAdminChannelCreateNoId = ChannelPriceHistoryConfigAttributes

export type ChannelPriceHistoryConfigSyliusAdminChannelIndexNoId = ChannelPriceHistoryConfigAttributes

export type ChannelPriceHistoryConfigSyliusAdminChannelShowNoId = ChannelPriceHistoryConfigAttributes

export type ChannelPriceHistoryConfigSyliusAdminChannelUpdateNoId = ChannelPriceHistoryConfigAttributes

export interface ChannelPriceHistoryConfigJsonLd
  extends ChannelPriceHistoryConfig,
    JsonLdResource {}

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelIndexNoId = ChannelPriceHistoryConfigJsonLdNoId

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelShowNoId = ChannelPriceHistoryConfigJsonLdSyliusAdminChannelIndexNoId

export interface ChannelPriceHistoryConfigJsonLdNoId
  extends ChannelPriceHistoryConfigAttributes,
    JsonLdResource {
  id?: number
  taxonsExcludedFromShowingLowestPrice?: TaxonJsonLdNoId[]
}

export type ChannelPriceHistoryConfigNoId = ChannelPriceHistoryConfig

export type ChannelPriceHistoryConfigJsonLdNoIdSyliusAdminChannelIndex = ChannelPriceHistoryConfigJsonLdNoId

export type ChannelPriceHistoryConfigJsonLdNoIdSyliusAdminChannelShow = ChannelPriceHistoryConfigJsonLdNoIdSyliusAdminChannelIndex

export interface ChannelCore<TShopBillingData, TPriceHistoryConfig> {
  baseCurrency: string
  defaultLocale: string
  defaultTaxZone?: string | null
  taxCalculationStrategy: string
  currencies: string[]
  locales: string[]
  countries: string[]
  themeName?: string | null
  contactEmail?: string | null
  contactPhoneNumber?: string | null
  skippingShippingStepAllowed?: boolean
  skippingPaymentStepAllowed?: boolean
  accountVerificationRequired?: boolean
  shippingAddressInCheckoutRequired?: boolean
  shopBillingData?: TShopBillingData | null
  menuTaxon?: string | null
  channelPriceHistoryConfig?: TPriceHistoryConfig | null
}

export interface ChannelAttributes<TShopBillingData, TPriceHistoryConfig>
  extends ChannelCore<TShopBillingData, TPriceHistoryConfig> {
  code: string
  name: string
  description?: string | null
  hostname?: string | null
  color?: string | null
  enabled?: boolean
}

export interface Channel
  extends ChannelAttributes<ShopBillingData, ChannelPriceHistoryConfig> {
  id?: number
  createdAt?: string
  updatedAt?: string | null
  currency?: ChannelCurrency[]
  locale?: ChannelLocale[]
  country?: ChannelCountry[]
  province?: ChannelProvince[]
}

export type ChannelSyliusAdminChannelIndex = Channel

export type ChannelSyliusAdminChannelShow = ChannelSyliusAdminChannelIndex

export type ChannelSyliusAdminChannelCreate = ChannelAttributes<
  ShopBillingDataSyliusAdminChannelCreateNoId,
  ChannelPriceHistoryConfigSyliusAdminChannelCreateNoId
>

export type ChannelSyliusAdminChannelUpdate = ChannelCore<
  ShopBillingDataSyliusAdminChannelUpdateNoId,
  ChannelPriceHistoryConfigSyliusAdminChannelUpdateNoId
> &
  Pick<
    ChannelAttributes<ShopBillingDataAttributes, ChannelPriceHistoryConfigAttributes>,
    'name' | 'description' | 'hostname' | 'color' | 'enabled'
  >

export interface ChannelSyliusShopChannelIndex {
  baseCurrency: string
  defaultLocale: string
  currencies: string[]
  locales: string[]
  code: string
  name: string
}

export type ChannelSyliusShopChannelShow = ChannelSyliusShopChannelIndex

export interface ChannelJsonLd
  extends ChannelAttributes<
      ShopBillingDataJsonldNoId,
      ChannelPriceHistoryConfigJsonLdNoId
    >,
    JsonLdResource {
  id?: number
  createdAt?: string
  updatedAt?: string | null
  currency?: ChannelCurrency[]
  locale?: ChannelLocale[]
  country?: ChannelCountry[]
  province?: ChannelProvince[]
}

export type ChannelJsonLdSyliusAdminChannelIndex = ChannelJsonLd

export type ChannelJsonLdSyliusAdminChannelShow = ChannelJsonLdSyliusAdminChannelIndex

export interface ChannelJsonLdSyliusShopChannelIndex
  extends ChannelSyliusShopChannelIndex,
    JsonLdResource {}

export type ChannelJsonLdSyliusShopChannelShow = ChannelJsonLdSyliusShopChannelIndex

export interface ChannelInterface {
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

export interface ChannelInterfaceJsonLd extends ChannelInterface, JsonLdResource {}

export type ChannelPriceHistoryConfigSyliusAdminChannelCreate = ChannelPriceHistoryConfigSyliusAdminChannelCreateNoId

export type ChannelPriceHistoryConfigSyliusAdminChannelIndex = ChannelPriceHistoryConfigSyliusAdminChannelIndexNoId

export type ChannelPriceHistoryConfigSyliusAdminChannelShow = ChannelPriceHistoryConfigSyliusAdminChannelShowNoId

export type ChannelPriceHistoryConfigSyliusAdminChannelUpdate = ChannelPriceHistoryConfigSyliusAdminChannelUpdateNoId

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelIndex = ChannelPriceHistoryConfigJsonLd

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelShow = ChannelPriceHistoryConfigJsonLdSyliusAdminChannelIndex

export interface ChannelPricing {
  id?: number
  channelCode: string
  productVariant?: string
  price?: number | null
  originalPrice?: number | null
  minimumPrice?: number | null
  lowestPriceBeforeDiscount?: number | null
  appliedPromotions?: string[]
  exclusiveCatalogPromotionApplied?: boolean
  priceReduced?: boolean
}

export interface ChannelPricingSyliusAdminProductVariantCreate {
  channelCode: string
  price?: number | null
  originalPrice?: number | null
  minimumPrice?: number | null
}

export interface ChannelPricingSyliusAdminProductVariantIndex {
  price?: number | null
  originalPrice?: number | null
  minimumPrice?: number | null
  lowestPriceBeforeDiscount?: number | null
  appliedPromotions?: ChannelPricingPromotionSummary[]
}

export type ChannelPricingSyliusAdminProductVariantShow = ChannelPricingSyliusAdminProductVariantIndex

export interface ChannelPricingSyliusAdminProductVariantUpdate {
  channelCode: string
  price?: number | null
  originalPrice?: number | null
  minimumPrice?: number | null
}

export interface ChannelPricingJsonLd extends ChannelPricing, JsonLdResource {}

export type ChannelPricingJsonLdSyliusAdminProductVariantIndex = ChannelPricingJsonLd

export type ChannelPricingJsonLdSyliusAdminProductVariantShow = ChannelPricingJsonLdSyliusAdminProductVariantIndex

export interface ChannelPricingPromotionSummary {
  id?: number
  code: string
}

export interface ChannelPricingInterface
  extends Omit<ChannelPricing, 'appliedPromotions'> {
  productVariant: string
  appliedPromotions?: ProductVariantChannelPricingPromotion[]
  channels?: string[]
}

export interface ChannelPricingInterfaceJsonLd
  extends ChannelPricingInterface,
    JsonLdResource {}

export interface ChannelPricingLogEntry {
  channelPricing: string
  loggedAt: string
  price: number
  originalPrice?: number | null
}

export interface ChannelPricingLogEntryJsonLd
  extends ChannelPricingLogEntry,
    JsonLdResource {}

export type ChannelPricingPromotionScope = ProductPromotionScope

export type ChannelPricingPromotionAction = ProductPromotionAction

export type ChannelPricingPromotion = ProductVariantChannelPricingPromotion

export type ChannelSyliusAdminChannelCreateShopBillingData = ShopBillingDataSyliusAdminChannelCreateNoId

export type ChannelSyliusAdminChannelIndexShopBillingData = ShopBillingDataSyliusAdminChannelIndexNoId

export type ChannelSyliusAdminChannelShowShopBillingData = ShopBillingDataSyliusAdminChannelShowNoId

export type ChannelSyliusAdminChannelUpdateShopBillingData = ShopBillingDataSyliusAdminChannelUpdateNoId

export type ChannelSyliusAdminChannelCreatePriceHistoryConfig = ChannelPriceHistoryConfigSyliusAdminChannelCreateNoId

export type ChannelSyliusAdminChannelIndexPriceHistoryConfig = ChannelPriceHistoryConfigSyliusAdminChannelIndexNoId

export type ChannelSyliusAdminChannelShowPriceHistoryConfig = ChannelPriceHistoryConfigSyliusAdminChannelShowNoId

export type ChannelSyliusAdminChannelUpdatePriceHistoryConfig = ChannelPriceHistoryConfigSyliusAdminChannelUpdateNoId

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelCreateNoId = ChannelPriceHistoryConfigJsonLdNoId

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelUpdateNoId = ChannelPriceHistoryConfigJsonLdNoId

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelCreate = ChannelPriceHistoryConfigJsonLd

export type ChannelPriceHistoryConfigJsonLdSyliusAdminChannelUpdate = ChannelPriceHistoryConfigJsonLd

export type ChannelPriceHistoryConfigSyliusAdminChannelCreateJsonLd = ChannelPriceHistoryConfigJsonLd

export type ChannelPriceHistoryConfigSyliusAdminChannelUpdateJsonLd = ChannelPriceHistoryConfigJsonLd
