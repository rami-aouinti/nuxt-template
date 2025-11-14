import type { HydraContext } from './hydra'

export interface PromotionChannel {
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

export interface PromotionRuleReference {
  type: string
  configuration: (string | null)[]
}

export interface PromotionRule extends PromotionRuleReference {
  promotion: string | null
  id: number
}

export interface PromotionRuleJsonLd extends PromotionRule {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type PromotionRuleAdminListItem = PromotionRule

export type PromotionRuleAdminCreatePayload = PromotionRuleReference

export type PromotionRuleAdminUpdatePayload = PromotionRuleReference

export type PromotionRuleInterface = PromotionRule

export type PromotionRuleInterfaceJsonLd = PromotionRuleJsonLd

export interface PromotionActionReference {
  type: string
  configuration: (string | null)[]
}

export interface PromotionAction extends PromotionActionReference {
  promotion: string | null
  id: number
  label?: string | null
}

export interface PromotionActionJsonLd extends PromotionAction {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type PromotionActionAdminListItem = PromotionAction

export type PromotionActionAdminCreatePayload = PromotionActionReference

export type PromotionActionAdminUpdatePayload = PromotionActionReference

export type PromotionActionInterface = PromotionAction

export type PromotionActionInterfaceJsonLd = PromotionActionJsonLd

export interface PromotionCoupon {
  perCustomerUsageLimit: number | null
  reusableFromCancelledOrders: boolean
  id: number
  code: string
  usageLimit: number | null
  used: number
  promotion: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string | null
  valid: boolean
}

export interface PromotionCouponJsonLd extends PromotionCoupon {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type PromotionCouponAdminListItem = PromotionCoupon

export interface PromotionCouponAdminCreatePayload {
  perCustomerUsageLimit?: number | null
  reusableFromCancelledOrders?: boolean
  code: string
  usageLimit?: number | null
  expiresAt?: string | null
}

export interface PromotionCouponAdminUpdatePayload {
  perCustomerUsageLimit?: number | null
  reusableFromCancelledOrders?: boolean
  usageLimit?: number | null
  expiresAt?: string | null
}

export interface PromotionCouponShopPayload {
  code: string
}

export interface PromotionCouponGeneratePayload {
  promotionCode: string
  prefix?: string | null
  codeLength: number
  suffix?: string | null
  amount: number
  expiresAt?: string | null
  usageLimit?: number | null
}

export interface PromotionCouponInterface {
  usageLimit: number | null
  used: number
  promotion: string | null
  expiresAt: string | null
  valid: boolean
  code: string
  createdAt: string
  updatedAt: string | null
  id: number
}

export interface PromotionCouponInterfaceJsonLd
  extends PromotionCouponInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PromotionTranslationSummary {
  label?: string | null
}

export interface PromotionTranslationDetail extends PromotionTranslationSummary {
  locale: string
}

export type PromotionTranslationsSummary = Record<string, PromotionTranslationSummary>

export type PromotionTranslationsPayload = Record<string, PromotionTranslationDetail>

export interface PromotionTranslation {
  id: number
  label: string | null
  locale: string
  translatable?: string
  translation?: unknown[]
  translations?: unknown[]
  currentLocale?: string
  fallbackLocale?: string
}

export interface PromotionTranslationJsonLd extends PromotionTranslation {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface Promotion {
  channels: string[]
  id: number
  code: string
  name: string
  description: string | null
  priority: number
  exclusive: boolean
  usageLimit: number | null
  used: number
  startsAt: string | null
  endsAt: string | null
  couponBased: boolean
  coupons: string[]
  rules: string[]
  actions: string[]
  appliesToDiscounted: boolean
  archivedAt: string | null
  createdAt: string
  updatedAt: string | null
  translations?: Record<string, string>
  currentLocale?: string
  fallbackLocale?: string
  channel?: PromotionChannel[]
  coupon?: PromotionCoupon[]
  rule?: PromotionRule[]
  action?: PromotionAction[]
  label?: string | null
  translation?: PromotionTranslation[]
}

export interface PromotionJsonLd extends Promotion {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PromotionAdminListItem extends Promotion {
  translations?: PromotionTranslationsSummary
}

export interface PromotionAdminCreatePayload {
  channels?: string[]
  code: string
  name: string
  description?: string | null
  priority?: number
  exclusive?: boolean
  usageLimit?: number | null
  startsAt?: string | null
  endsAt?: string | null
  couponBased?: boolean
  rules?: PromotionRuleReference[]
  actions?: PromotionActionReference[]
  appliesToDiscounted?: boolean
  translations?: PromotionTranslationsPayload
}

export interface PromotionAdminUpdatePayload {
  channels?: string[]
  name?: string
  description?: string | null
  priority?: number
  exclusive?: boolean
  usageLimit?: number | null
  startsAt?: string | null
  endsAt?: string | null
  couponBased?: boolean
  rules?: PromotionRuleReference[]
  actions?: PromotionActionReference[]
  appliesToDiscounted?: boolean
  translations?: PromotionTranslationsPayload
}

export interface PromotionAdminListItemJsonLd extends PromotionAdminListItem {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type PromotionInterface = Promotion

export type PromotionInterfaceJsonLd = PromotionJsonLd

export type PromotionAdminCreateJsonLd = PromotionAdminListItemJsonLd

export type PromotionAdminShowJsonLd = PromotionAdminListItemJsonLd


export interface PromotionActionAdminListItemJsonLd extends PromotionActionAdminListItem {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PromotionRuleAdminListItemJsonLd extends PromotionRuleAdminListItem {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PromotionCouponAdminListItemJsonLd extends PromotionCouponAdminListItem {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PromotionCouponShopJsonLd extends PromotionCouponShopPayload {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

