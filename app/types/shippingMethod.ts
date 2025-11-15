import type { HydraContext } from './hydra'
import type { TranslationInterface } from './tax'

export interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShippingMethodChannel {
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

export interface ShippingMethodRuleDetails {
  type: string
  configuration?: Array<string | null>
  shippingMethod?: string | null
  id?: number
}

export interface ShippingMethodAttributes {
  zone: string
  taxCategory?: string | null
  channels: string[]
  code: string
  position: number
  category?: string | null
  categoryRequirement?: number
  shippingChargesCalculator: string
  shippingChargesCalculatorConfiguration?: Array<string | null>
  rules?: string[]
  archivedAt?: string | null
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: Record<string, string>
  currentLocale?: string
  fallbackLocale?: string
  channel?: ShippingMethodChannel[]
  translationClass?: unknown
  name?: string | null
  description?: string | null
  rule?: ShippingMethodRuleDetails[]
  translation?: TranslationInterface[] | null
}

export interface ShippingMethod extends ShippingMethodAttributes {
  id?: number
}

export interface ShippingMethodRulePayload {
  type: string
  configuration?: Array<string | null>
}

export interface ShippingMethodTranslationPayload {
  name: string
  description?: string | null
  locale: string
}

export interface ShippingMethodSyliusAdminShippingMethodCreate {
  zone: string
  channels: string[]
  code: string
  position: number
  shippingChargesCalculator: string
  shippingChargesCalculatorConfiguration?: Array<string | null>
  rules?: ShippingMethodRulePayload[]
  enabled?: boolean
  translations?: Record<string, ShippingMethodTranslationPayload>
}

export type ShippingMethodSyliusAdminShippingMethodIndex = ShippingMethod

export type ShippingMethodSyliusAdminShippingMethodShow =
  ShippingMethodSyliusAdminShippingMethodIndex

export interface ShippingMethodSyliusAdminShippingMethodUpdate {
  zone: string
  channels: string[]
  position: number
  shippingChargesCalculator: string
  shippingChargesCalculatorConfiguration?: Array<string | null>
  rules?: ShippingMethodRulePayload[]
  enabled?: boolean
  translations?: Record<string, ShippingMethodTranslationPayload>
}

export interface ShippingMethodSyliusShopShippingMethodIndex {
  id?: number
  code: string
  position: number
  name?: string | null
  description?: string | null
  price?: number
}

export type ShippingMethodSyliusShopShippingMethodShow =
  ShippingMethodSyliusShopShippingMethodIndex

export interface ShippingMethodJsonld extends JsonLdResource, ShippingMethod {}

export type ShippingMethodJsonldSyliusAdminShippingMethodIndex =
  ShippingMethodJsonld

export type ShippingMethodJsonldSyliusAdminShippingMethodShow =
  ShippingMethodJsonldSyliusAdminShippingMethodIndex

export interface ShippingMethodJsonldSyliusShopShippingMethodIndex
  extends JsonLdResource,
    ShippingMethodSyliusShopShippingMethodIndex {}

export type ShippingMethodJsonldSyliusShopShippingMethodShow =
  ShippingMethodJsonldSyliusShopShippingMethodIndex

export interface ShippingMethodRule {
  id?: number
  type: string
  configuration?: Array<string | null>
}

export type ShippingMethodRuleSyliusAdminShippingMethodCreate =
  ShippingMethodRulePayload

export type ShippingMethodRuleSyliusAdminShippingMethodIndex =
  ShippingMethodRule

export type ShippingMethodRuleSyliusAdminShippingMethodShow = ShippingMethodRule

export type ShippingMethodRuleSyliusAdminShippingMethodUpdate =
  ShippingMethodRulePayload

export interface ShippingMethodRuleJsonld
  extends JsonLdResource,
    ShippingMethodRule {}

export type ShippingMethodRuleJsonldSyliusAdminShippingMethodIndex =
  ShippingMethodRuleJsonld

export type ShippingMethodRuleJsonldSyliusAdminShippingMethodShow =
  ShippingMethodRuleJsonldSyliusAdminShippingMethodIndex

export interface ShippingMethodRuleInterface extends ShippingMethodRule {
  shippingMethod?: string | null
}

export interface ShippingMethodRuleInterfaceJsonld
  extends JsonLdResource,
    ShippingMethodRuleInterface {}

export interface ShippingMethodTranslation {
  id?: number
  name: string
  description?: string | null
  locale?: string
}

export interface ShippingMethodTranslationSyliusAdminShippingMethodCreate {
  name: string
  description?: string | null
  locale: string
}

export type ShippingMethodTranslationSyliusAdminShippingMethodIndex =
  ShippingMethodTranslation

export type ShippingMethodTranslationSyliusAdminShippingMethodShow =
  ShippingMethodTranslation

export interface ShippingMethodTranslationSyliusAdminShippingMethodUpdate {
  name: string
  description?: string | null
  locale: string
}

export interface ShippingMethodTranslationJsonld
  extends JsonLdResource,
    ShippingMethodTranslation {}

export type ShippingMethodTranslationJsonldSyliusAdminShippingMethodIndex =
  ShippingMethodTranslationJsonld

export type ShippingMethodTranslationJsonldSyliusAdminShippingMethodShow =
  ShippingMethodTranslationJsonldSyliusAdminShippingMethodIndex
