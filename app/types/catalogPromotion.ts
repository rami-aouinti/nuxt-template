import type { HydraContext } from './hydra'
import type { TranslationInterface } from './tax'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CatalogPromotionChannel {
  name: string
  description: string | null
  hostname: string | null
  color: string | null
  code: string
  createdAt: string
  updatedAt: string | null
  enabled: boolean
  id: number
  translationClass?: unknown
  label?: string | null
  translation?: TranslationInterface[] | null
  translations?: TranslationInterface[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface CatalogPromotionScopeReference {
  type: string
  configuration: (string | null)[]
}

export interface CatalogPromotionScope extends CatalogPromotionScopeReference {
  catalogPromotion: string | null
  id: number
}

export interface CatalogPromotionScopeJsonLd
  extends CatalogPromotionScope,
    JsonLdResource {}

export type CatalogPromotionScopeAdminListItem = CatalogPromotionScope

export type CatalogPromotionScopeAdminCreatePayload =
  CatalogPromotionScopeReference

export type CatalogPromotionScopeAdminUpdatePayload =
  CatalogPromotionScopeReference

export interface CatalogPromotionActionReference {
  type: string
  configuration: (string | null)[]
}

export interface CatalogPromotionAction
  extends CatalogPromotionActionReference {
  catalogPromotion: string | null
  id: number
}

export interface CatalogPromotionActionJsonLd
  extends CatalogPromotionAction,
    JsonLdResource {}

export type CatalogPromotionActionAdminListItem = CatalogPromotionAction

export type CatalogPromotionActionAdminCreatePayload =
  CatalogPromotionActionReference

export type CatalogPromotionActionAdminUpdatePayload =
  CatalogPromotionActionReference

export interface CatalogPromotionTranslationSummary {
  label?: string | null
  description?: string | null
}

export interface CatalogPromotionTranslationDetail
  extends CatalogPromotionTranslationSummary {
  locale: string
}

export type CatalogPromotionTranslationsSummary = Record<
  string,
  CatalogPromotionTranslationSummary
>

export type CatalogPromotionTranslationsPayload = Record<
  string,
  CatalogPromotionTranslationDetail
>

export interface CatalogPromotion {
  channels: string[]
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
  translations?: CatalogPromotionTranslationsSummary
  currentLocale?: string
  fallbackLocale?: string
  channel?: CatalogPromotionChannel[]
  scope?: CatalogPromotionScope[]
  action?: CatalogPromotionAction[]
  translation?: TranslationInterface[] | null
  label?: string | null
  description?: string | null
}

export interface CatalogPromotionJsonLd
  extends CatalogPromotion,
    JsonLdResource {}

export type CatalogPromotionAdminListItem = CatalogPromotion

export interface CatalogPromotionAdminListItemJsonLd
  extends CatalogPromotionAdminListItem,
    JsonLdResource {}

export interface CatalogPromotionAdminCreatePayload {
  channels?: string[]
  name: string
  code: string
  startDate?: string | null
  endDate?: string | null
  priority?: number
  exclusive?: boolean
  scopes?: CatalogPromotionScopeReference[]
  actions?: CatalogPromotionActionReference[]
  enabled?: boolean
  translations?: CatalogPromotionTranslationsPayload
}

export interface CatalogPromotionAdminUpdatePayload {
  channels?: string[]
  name?: string
  startDate?: string | null
  endDate?: string | null
  priority?: number
  exclusive?: boolean
  scopes?: CatalogPromotionScopeReference[]
  actions?: CatalogPromotionActionReference[]
  enabled?: boolean
  translations?: CatalogPromotionTranslationsPayload
}

export interface CatalogPromotionShopShow {
  id: number
  label: string | null
}

export interface CatalogPromotionShopShowJsonLd
  extends CatalogPromotionShopShow,
    JsonLdResource {}

export interface CatalogPromotionProductVariant {
  id: number
  code: string
}

export type CatalogPromotionProductVariantAdminListItem =
  CatalogPromotionProductVariant

export interface CatalogPromotionProductVariantJsonLd
  extends CatalogPromotionProductVariant,
    JsonLdResource {}

export type CatalogPromotionInterface = CatalogPromotion

export type CatalogPromotionInterfaceJsonLd = CatalogPromotionJsonLd

export type CatalogPromotionActionInterface = CatalogPromotionAction

export type CatalogPromotionActionInterfaceJsonLd = CatalogPromotionActionJsonLd

export type CatalogPromotionScopeInterface = CatalogPromotionScope

export type CatalogPromotionScopeInterfaceJsonLd = CatalogPromotionScopeJsonLd
