import type { Address, AddressJsonld } from './address'
import type { HydraContext } from './hydra'
import type {
  ShopUserJsonldSyliusAdminCustomerIndex,
  ShopUserJsonldSyliusAdminCustomerShow,
  ShopUserJsonldSyliusShopCustomerShow,
  ShopUserSyliusAdminCustomerCreate,
  ShopUserSyliusAdminCustomerIndex,
  ShopUserSyliusAdminCustomerShow,
  ShopUserSyliusAdminCustomerUpdate,
  ShopUserSyliusShopCustomerShow,
} from './shopUser'

export type CustomerGender = 'u' | 'm' | 'f'

export interface CustomerBase {
  id?: number
  email: string
  firstName: string | null
  lastName: string | null
  birthday?: string | null
  gender: CustomerGender
  group?: string | null
  phoneNumber?: string | null
  subscribedToNewsletter: boolean
  createdAt?: string
  updatedAt?: string | null
  fullName?: string
  male?: boolean
  female?: boolean
}

export interface Customer extends CustomerBase {
  orders?: string[]
  defaultAddress?: string | null
  addresses?: string[]
  address?: Address[]
  user?: string | null
  emailCanonical: string
}

export interface CustomerJsonld extends Customer {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  address?: AddressJsonld[]
}

export interface CustomerSyliusAdminCustomerCreate {
  user?: ShopUserSyliusAdminCustomerCreate | null
  email: string
  firstName?: string | null
  lastName?: string | null
  birthday?: string | null
  gender?: CustomerGender
  group?: string | null
  phoneNumber?: string | null
  subscribedToNewsletter?: boolean
}

export interface CustomerSyliusAdminCustomerIndex extends CustomerBase {
  defaultAddress?: string | null
  user?: ShopUserSyliusAdminCustomerIndex | null
}

export interface CustomerSyliusAdminCustomerShow extends CustomerSyliusAdminCustomerIndex {
  user?: ShopUserSyliusAdminCustomerShow | null
}

export type CustomerSyliusAdminCustomerStatisticsShow = CustomerStatistics

export interface CustomerSyliusAdminCustomerUpdate {
  user?: ShopUserSyliusAdminCustomerUpdate | null
  email: string
  firstName?: string | null
  lastName?: string | null
  birthday?: string | null
  gender?: CustomerGender
  group?: string | null
  phoneNumber?: string | null
  subscribedToNewsletter?: boolean
}

export interface CustomerSyliusShopCartShow {
  email: string
}

export interface CustomerSyliusShopCustomerShow extends CustomerBase {
  defaultAddress?: string | null
  user?: ShopUserSyliusShopCustomerShow | null
}

export interface CustomerSyliusShopCustomerUpdate {
  defaultAddress?: string | null
  email: string
  firstName?: string | null
  lastName?: string | null
  birthday?: string | null
  gender?: CustomerGender
  phoneNumber?: string | null
  subscribedToNewsletter?: boolean
}

export interface CustomerSyliusShopProductReviewIndex {
  firstName: string | null
}

export type CustomerSyliusShopProductReviewShow = CustomerSyliusShopProductReviewIndex

export interface CustomerSyliusShopResetPasswordUpdateJsonMergePatch {
  newPassword: string
  confirmNewPassword: string
}

export type CustomerSyliusShopShopUserVerificationUpdateJsonMergePatch = Record<string, never>

export interface CustomerChangeShopUserPasswordSyliusShopCustomerPasswordUpdate {
  newPassword: string
  confirmNewPassword: string
  currentPassword: string
}

export interface CustomerRegisterShopUserSyliusShopCustomerCreate {
  firstName: string
  lastName: string
  email: string
  password: string
  subscribedToNewsletter: boolean
}

export interface CustomerRequestResetPasswordTokenSyliusShopResetPasswordCreate {
  localeCode: string
  email: string
}

export type CustomerRequestShopUserVerificationSyliusShopShopUserVerificationCreate = Record<string, never>

export interface CustomerJsonldSyliusAdminCustomerIndex
  extends CustomerSyliusAdminCustomerIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  user?: ShopUserJsonldSyliusAdminCustomerIndex | null
}

export interface CustomerJsonldSyliusAdminCustomerShow
  extends CustomerSyliusAdminCustomerShow {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  user?: ShopUserJsonldSyliusAdminCustomerShow | null
}

export type CustomerJsonldSyliusAdminCustomerStatisticsShow = CustomerStatisticsJsonLd

export interface CustomerJsonldSyliusShopCartShow extends CustomerSyliusShopCartShow {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerJsonldSyliusShopCustomerShow
  extends CustomerSyliusShopCustomerShow {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  user?: ShopUserJsonldSyliusShopCustomerShow | null
}

export interface CustomerJsonldSyliusShopProductReviewIndex
  extends CustomerSyliusShopProductReviewIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type CustomerJsonldSyliusShopProductReviewShow = CustomerJsonldSyliusShopProductReviewIndex

export interface CustomerGroup {
  id?: number
  code: string
  name: string
}

export interface CustomerGroupSyliusAdminCustomerGroupCreate {
  code: string
  name: string
}

export type CustomerGroupSyliusAdminCustomerGroupIndex = CustomerGroup

export type CustomerGroupSyliusAdminCustomerGroupShow = CustomerGroup

export interface CustomerGroupSyliusAdminCustomerGroupUpdate {
  name: string
}

export interface CustomerGroupJsonld extends CustomerGroup {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerGroupJsonldSyliusAdminCustomerGroupIndex
  extends CustomerGroupSyliusAdminCustomerGroupIndex {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerGroupJsonldSyliusAdminCustomerGroupShow
  extends CustomerGroupSyliusAdminCustomerGroupShow {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerInterface extends CustomerBase {
  emailCanonical: string
  createdAt: string
}

export interface CustomerInterfaceJsonld extends CustomerInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShopUserAdminCustomerPayload {
  verified?: boolean
}

export interface ShopUserAdminCustomerJsonLd extends ShopUserAdminCustomerPayload {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerStatistics {
  perChannelsStatistics: string[]
  allOrdersCount: number
}

export interface CustomerStatisticsJsonLd extends CustomerStatistics {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface CustomerTokenRead {
  token: string
  customer: string
}

export interface CustomerTokenUnauthorizedError {
  code: number
  message: string
}

export interface CustomerTokenBadRequestError {
  type: string
  title: string
  status: number
  detail: string
}

export interface CustomerTokenCreatePayload {
  email: string
  password: string
}
