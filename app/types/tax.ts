import type { HydraContext } from './hydra'

export interface TaxCategory {
  id?: number
  code: string
  name: string
  description?: string | null
  rates?: string[]
  rate?: TaxRate[]
  createdAt?: string
  updatedAt?: string | null
}

export interface TaxCategorySyliusAdminTaxCategoryCreate {
  code: string
  name: string
  description?: string | null
}

export type TaxCategorySyliusAdminTaxCategoryUpdate = TaxCategoryUpdatePayload

export interface TaxCategoryUpdatePayload {
  name: string
  description?: string | null
}

export type TaxCategorySyliusAdminTaxCategoryIndex = TaxCategory
export type TaxCategorySyliusAdminTaxCategoryShow = TaxCategory

export interface TaxCategoryJsonLd extends TaxCategory {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TaxCategoryJsonLdSyliusAdminTaxCategoryIndex = TaxCategoryJsonLd
export type TaxCategoryJsonLdSyliusAdminTaxCategoryShow = TaxCategoryJsonLd

export interface TaxRate {
  zone: string
  id?: number
  code: string
  category: string
  name: string
  amount: string
  includedInPrice: boolean
  calculator: string
  startDate?: string | null
  endDate?: string | null
  createdAt?: string
  updatedAt?: string | null
  amountAsPercentage?: number
  label?: string | null
}

export interface TaxRateSyliusAdminTaxRateCreate {
  zone: string
  code: string
  category: string
  name: string
  amount: string
  includedInPrice: boolean
  calculator: string
  startDate?: string | null
  endDate?: string | null
}

export type TaxRateSyliusAdminTaxRateIndex = TaxRate
export type TaxRateSyliusAdminTaxRateShow = TaxRate

export interface TaxRateSyliusAdminTaxRateUpdate {
  zone: string
  category: string
  name: string
  amount: string
  includedInPrice: boolean
  calculator: string
  startDate?: string | null
  endDate?: string | null
}

export interface TaxRateJsonLd extends TaxRate {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TaxRateJsonLdSyliusAdminTaxRateIndex = TaxRateJsonLd
export type TaxRateJsonLdSyliusAdminTaxRateShow = TaxRateJsonLd

export interface TaxRateInterface {
  category: string
  name: string
  amount: string
  amountAsPercentage?: number
  includedInPrice: boolean
  calculator: string
  label?: string | null
  startDate?: string | null
  endDate?: string | null
  code: string
  createdAt?: string
  updatedAt?: string | null
  id?: number
}

export interface TaxRateInterfaceJsonLd extends TaxRateInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface TaxonTranslationPayload {
  name?: string | null
  slug?: string | null
  description?: string | null
}

export type TaxonTranslations = Record<string, TaxonTranslationPayload>

export interface TaxonRelationCollection {
  empty?: unknown
  keys?: unknown
  values?: unknown
  iterator?: unknown
}

export interface TaxonImageReference {
  type?: string | null
  file?: string | null
  path?: string | null
  owner?: unknown
  id?: unknown
  translationClass?: unknown
  name?: string | null
  slug?: string | null
  description?: string | null
}

export interface TranslatableInterface {
  translations?: TranslationInterface[] | null
  translation?: TranslationInterface[] | null
  currentLocale?: string
  fallbackLocale?: string
}

export interface TranslationInterface {
  translatable?: TranslatableInterface | null
  locale?: string | null
}

export interface TranslatableInterfaceJsonLd extends TranslatableInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface TranslationInterfaceJsonLd extends TranslationInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TranslatableInterfaceNoId = TranslatableInterface

export interface TranslatableInterfaceNoIdJsonLd extends TranslatableInterfaceNoId {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TranslationInterfaceNoId = TranslationInterface

export interface TranslationInterfaceNoIdJsonLd extends TranslationInterfaceNoId {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface TaxonBase {
  images?: string[]
  code: string
  root?: string | null
  parent?: string | null
  children?: string[]
  left?: number
  right?: number
  level?: number
  position?: number
  translations?: TaxonTranslations
  currentLocale?: string
  fallbackLocale?: string
  enabled?: boolean
  createdAt?: string
  updatedAt?: string | null
  image?: TaxonImageReference[]
  ancestors?: TaxonRelationCollection
  child?: unknown[]
  enabledChildren?: TaxonRelationCollection
  fullname?: string | null
  translation?: TranslationInterface[] | null
}

export interface Taxon extends TaxonBase {
  id?: number
}

export type TaxonSyliusAdminTaxonCreate = TaxonCreatePayload

export interface TaxonCreatePayload {
  code: string
  parent?: string | null
  translations?: TaxonTranslations
  enabled?: boolean
}

export interface TaxonSyliusAdminTaxonUpdate {
  parent?: string | null
  position?: number
  translations?: TaxonTranslations
  enabled?: boolean
}

export type TaxonSyliusAdminTaxonIndex = Taxon
export type TaxonSyliusAdminTaxonShow = Taxon
export type TaxonSyliusShopTaxonIndex = Taxon
export type TaxonSyliusShopTaxonShow = Taxon
export type TaxonSyliusAdminTaxonImageShow = Taxon
export type TaxonSyliusAdminChannelCreateNoId = TaxonNoId
export type TaxonSyliusAdminChannelIndexNoId = TaxonNoId
export type TaxonSyliusAdminChannelShowNoId = TaxonNoId
export type TaxonSyliusAdminChannelUpdateNoId = TaxonNoId

export interface TaxonJsonLd extends Taxon {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TaxonJsonLdSyliusAdminTaxonIndex = TaxonJsonLd
export type TaxonJsonLdSyliusAdminTaxonShow = TaxonJsonLd
export type TaxonJsonLdSyliusShopTaxonIndex = TaxonJsonLd
export type TaxonJsonLdSyliusShopTaxonShow = TaxonJsonLd

export interface TaxonNoId extends TaxonBase {
  id?: number
}

export interface TaxonJsonLdNoId extends TaxonNoId {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TaxonJsonLdSyliusAdminChannelIndexNoId = TaxonJsonLdNoId
export type TaxonJsonLdSyliusAdminChannelShowNoId = TaxonJsonLdNoId
export type TaxonJsonLdSyliusAdminTaxonImageShow = TaxonJsonLd
export type TaxonJsonLdSyliusAdminTaxonIndexNoId = TaxonJsonLdNoId
export type TaxonJsonLdSyliusAdminTaxonShowNoId = TaxonJsonLdNoId
export type TaxonJsonLdSyliusShopTaxonImageShow = TaxonJsonLd

export interface TaxonInterface extends TaxonBase {
  id?: number
}

export interface TaxonInterfaceJsonLd extends TaxonInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface TaxonInterfaceNoId extends TaxonBase {
  id?: number
}

export interface TaxonInterfaceJsonLdNoId extends TaxonInterfaceNoId {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface TaxonTranslation {
  id?: number
  name: string
  slug?: string | null
  description?: string | null
  locale: string
  translatable?: string
}

export interface TaxonTranslationJsonLd extends TaxonTranslation {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TaxonTranslationNoId = TaxonTranslation

export interface TaxonTranslationJsonLdNoId extends TaxonTranslationNoId {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface TaxonImage {
  id?: number
  type?: string | null
  file?: string | null
  path: string
  owner?: string
}

export type TaxonImageSyliusAdminTaxonIndex = TaxonImage
export type TaxonImageSyliusAdminTaxonShow = TaxonImage
export type TaxonImageSyliusAdminTaxonImageIndex = TaxonImage
export type TaxonImageSyliusAdminTaxonImageShow = TaxonImage
export type TaxonImageSyliusShopTaxonIndex = TaxonImage
export type TaxonImageSyliusShopTaxonShow = TaxonImage
export type TaxonImageSyliusShopTaxonImageShow = TaxonImage

export interface TaxonImageSyliusAdminTaxonImageUpdate {
  type?: string | null
}

export interface TaxonImageJsonLd extends TaxonImage {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type TaxonImageJsonLdSyliusAdminTaxonIndex = TaxonImageJsonLd
export type TaxonImageJsonLdSyliusAdminTaxonShow = TaxonImageJsonLd
export type TaxonImageJsonLdSyliusAdminTaxonImageIndex = TaxonImageJsonLd
export type TaxonImageJsonLdSyliusAdminTaxonImageShow = TaxonImageJsonLd
export type TaxonImageJsonLdSyliusShopTaxonIndex = TaxonImageJsonLd
export type TaxonImageJsonLdSyliusShopTaxonShow = TaxonImageJsonLd
export type TaxonImageJsonLdSyliusShopTaxonImageShow = TaxonImageJsonLd

export interface UserInterface {
  email?: string | null
  emailCanonical?: string | null
  username?: string | null
  usernameCanonical?: string | null
  emailVerificationToken?: string | null
  passwordResetToken?: string | null
  passwordRequestedAt?: string | null
  verified?: boolean
  verifiedAt?: string | null
  lastLogin?: string | null
  role?: string[]
  oAuthAccounts?: UserOAuth[]
  id?: number
  plainPassword?: string | null
  password?: string | null
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  roles?: string[]
  userIdentifier?: string
}

export interface UserInterfaceJsonLd extends UserInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface UserOAuth {
  id?: number
  provider: string
  identifier: string
  accessToken?: string | null
  refreshToken?: string | null
  user?: string | null
}

export interface UserOAuthJsonLd extends UserOAuth {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type UserOAuthInterface = UserOAuth

export interface UserOAuthInterfaceJsonLd extends UserOAuthInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

