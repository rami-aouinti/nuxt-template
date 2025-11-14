import type { HydraContext } from './hydra'
import type { TranslationInterface } from './tax'

export interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PaymentMethodSummaryTranslation {
  name: string
}

export type PaymentMethodSummaryTranslations = Record<
  string,
  PaymentMethodSummaryTranslation
>

export interface PaymentMethodSummary {
  translations?: PaymentMethodSummaryTranslations
  name?: string | null
}

export interface PaymentMethodChannel {
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

export interface PaymentMethodGatewayConfig {
  factoryName?: string
  gatewayName?: string
  config?: Array<string | null>
}

export interface PaymentMethodTranslation {
  name: string
  description?: string | null
  instructions?: string | null
  locale?: string
}

export interface PaymentMethodTranslationPayload
  extends PaymentMethodTranslation {
  locale: string
}

export type PaymentMethodTranslationsPayload = Record<
  string,
  PaymentMethodTranslationPayload
>

export interface PaymentMethodAttributes {
  channels: string[]
  code: string
  position: number
  environment?: string | null
  gatewayConfig?: string | PaymentMethodGatewayConfig | null
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  translations?: Record<string, string>
  currentLocale?: string
  fallbackLocale?: string
  channel?: PaymentMethodChannel[]
  translationClass?: unknown
  name?: string | null
  description?: string | null
  instructions?: string | null
  translation?: TranslationInterface[] | null
  locales?: string | null
}

export interface PaymentMethod extends PaymentMethodAttributes {
  id?: number
}

export interface PaymentMethodSyliusAdminPaymentMethodCreate {
  channels: string[]
  code: string
  position: number
  gatewayConfig?: PaymentMethodGatewayConfig | null
  enabled?: boolean
  translations?: PaymentMethodTranslationsPayload
}

export type PaymentMethodSyliusAdminPaymentMethodIndex = PaymentMethod

export type PaymentMethodSyliusAdminPaymentMethodShow = PaymentMethod

export interface PaymentMethodSyliusAdminPaymentMethodUpdate {
  channels: string[]
  position: number
  gatewayConfig?: PaymentMethodGatewayConfig | null
  enabled?: boolean
  translations?: PaymentMethodTranslationsPayload
  locale?: string
}

export interface PaymentMethodSyliusShopPaymentMethodIndex {
  id?: number
  code: string
  position: number
  name?: string | null
  description?: string | null
  instructions?: string | null
}

export type PaymentMethodSyliusShopPaymentMethodShow = PaymentMethodSyliusShopPaymentMethodIndex

export interface PaymentMethodSyliusShopPaymentShow {
  name?: string | null
}

export interface PaymentMethodJsonld
  extends JsonLdResource,
    PaymentMethod {}

export type PaymentMethodJsonldSyliusAdminPaymentMethodIndex = PaymentMethodJsonld

export type PaymentMethodJsonldSyliusAdminPaymentMethodShow = PaymentMethodJsonldSyliusAdminPaymentMethodIndex

export interface PaymentMethodJsonldSyliusShopPaymentShow
  extends JsonLdResource,
    PaymentMethodSyliusShopPaymentShow {}

export interface PaymentMethodJsonldSyliusShopPaymentMethodIndex
  extends JsonLdResource,
    PaymentMethodSyliusShopPaymentMethodIndex {}

export type PaymentMethodJsonldSyliusShopPaymentMethodShow = PaymentMethodJsonldSyliusShopPaymentMethodIndex

export type PaymentMethodTranslationSyliusAdminPaymentMethodCreate = PaymentMethodTranslationPayload

export type PaymentMethodTranslationSyliusAdminPaymentMethodIndex = PaymentMethodTranslation

export type PaymentMethodTranslationSyliusAdminPaymentMethodShow = PaymentMethodTranslation

export type PaymentMethodTranslationSyliusAdminPaymentMethodUpdate = PaymentMethodTranslationPayload

export interface PaymentMethodTranslationJsonld
  extends JsonLdResource,
    PaymentMethodTranslation {}

export type PaymentMethodTranslationJsonldSyliusAdminPaymentMethodIndex = PaymentMethodTranslationJsonld

export type PaymentMethodTranslationJsonldSyliusAdminPaymentMethodShow = PaymentMethodTranslationJsonldSyliusAdminPaymentMethodIndex

export interface PaymentMethodTranslationSyliusAdminPaymentIndex {
  name: string
}

export type PaymentMethodTranslationSyliusAdminPaymentShow = PaymentMethodTranslationSyliusAdminPaymentIndex

export interface PaymentMethodTranslationJsonldSyliusAdminPaymentIndex
  extends JsonLdResource,
    PaymentMethodTranslationSyliusAdminPaymentIndex {}

export type PaymentMethodTranslationJsonldSyliusAdminPaymentShow = PaymentMethodTranslationJsonldSyliusAdminPaymentIndex

export interface PaymentMethodSyliusAdminPaymentIndex {
  translations?: PaymentMethodSummaryTranslations
}

export type PaymentMethodSyliusAdminPaymentShow = PaymentMethodSyliusAdminPaymentIndex

export interface PaymentMethodJsonldSyliusAdminPaymentIndex
  extends JsonLdResource,
    PaymentMethodSyliusAdminPaymentIndex {}

export type PaymentMethodJsonldSyliusAdminPaymentShow = PaymentMethodJsonldSyliusAdminPaymentIndex

export interface PaymentSyliusAdminOrderIndex {
  id?: number
  method?: string | null
}

export type PaymentSyliusAdminOrderShow = PaymentSyliusAdminOrderIndex

export interface PaymentAttributes {
  order: string
  id?: number
  method?: PaymentMethodSummary | null
  currencyCode: string
  amount: number
  state: string
  details?: Array<string | null>
  createdAt: string
  updatedAt?: string | null
}

export type PaymentSyliusAdminPaymentIndex = PaymentAttributes

export type PaymentSyliusAdminPaymentShow = PaymentAttributes

export interface PaymentSyliusShopCartShow {
  id?: number
  method?: string | null
}

export interface PaymentSyliusShopOrderAccountShow {
  method?: string | null
}

export type PaymentSyliusShopPaymentShow = PaymentAttributes

export interface PaymentJsonld
  extends JsonLdResource,
    PaymentAttributes {}

export interface PaymentJsonldSyliusAdminOrderIndex
  extends JsonLdResource,
    PaymentSyliusAdminOrderIndex {}

export type PaymentJsonldSyliusAdminOrderShow = PaymentJsonldSyliusAdminOrderIndex

export type PaymentJsonldSyliusAdminPaymentIndex = PaymentJsonld

export type PaymentJsonldSyliusAdminPaymentShow = PaymentJsonld

export interface PaymentJsonldSyliusShopCartShow
  extends JsonLdResource,
    PaymentSyliusShopCartShow {}

export interface PaymentJsonldSyliusShopOrderAccountShow
  extends JsonLdResource,
    PaymentSyliusShopOrderAccountShow {}

export interface PaymentJsonldSyliusShopPaymentShow
  extends JsonLdResource,
    PaymentSyliusShopPaymentShow {}

export interface PaymentRequest {
  hash?: string | null
  state: string
  action: string
  payload?: Record<string, unknown>
  responseData?: Array<string | null>
  payment: string
  method: string
  createdAt: string
  updatedAt?: string | null
  id?: number
}

export type PaymentRequestSyliusAdminPaymentRequestIndex = PaymentRequest

export type PaymentRequestSyliusAdminPaymentRequestShow = PaymentRequestSyliusAdminPaymentRequestIndex

export type PaymentRequestSyliusShopPaymentRequestShow = PaymentRequest

export interface PaymentRequestAddPaymentRequestSyliusShopPaymentRequestCreate {
  paymentId?: string | null
  paymentMethodCode: string
  action?: string | null
  payload?: string | null
}

export interface PaymentRequestUpdatePaymentRequestSyliusShopPaymentRequestUpdate {
  payload?: string | null
}

export interface PaymentRequestJsonld
  extends JsonLdResource,
    PaymentRequest {}

export type PaymentRequestJsonldSyliusAdminPaymentRequestIndex = PaymentRequestJsonld

export type PaymentRequestJsonldSyliusAdminPaymentRequestShow = PaymentRequestJsonldSyliusAdminPaymentRequestIndex

export interface PaymentRequestJsonldSyliusShopPaymentRequestShow
  extends JsonLdResource,
    PaymentRequestSyliusShopPaymentRequestShow {}

export interface PaymentInterface {
  method?: string | null
  state: string
  currencyCode: string
  amount: number
  details?: Array<string | null>
  paymentRequests?: PaymentRequest[]
  createdAt: string
  updatedAt?: string | null
  id?: number
}

export interface PaymentInterfaceJsonld
  extends JsonLdResource,
    PaymentInterface {}
