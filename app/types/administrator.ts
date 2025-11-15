import type { HydraContext } from './hydra'

export interface AdministratorOAuthAccount {
  id?: number
  provider: string
  identifier: string
  accessToken?: string | null
  refreshToken?: string | null
  user?: string | null
}

export interface AdministratorImageResource {
  type?: string | null
  file?: string | null
  path?: string | null
  owner?: unknown
  id?: unknown
}

export type AdministratorImage = AdministratorImageResource | null

export interface Administrator {
  firstName: string | null
  lastName: string | null
  localeCode: string
  avatar?: string | null
  id?: number
  username: string | null
  usernameCanonical?: string | null
  password?: string | null
  plainPassword?: string | null
  lastLogin?: string | null
  emailVerificationToken?: string | null
  passwordResetToken?: string | null
  passwordRequestedAt?: string | null
  verifiedAt?: string | null
  roles?: string[]
  oauthAccounts?: AdministratorOAuthAccount[]
  email?: string | null
  emailCanonical?: string | null
  createdAt?: string
  updatedAt?: string | null
  enabled?: boolean
  image?: AdministratorImage
  userIdentifier?: string
  role?: string[]
  verified?: boolean
  oAuthAccounts?: AdministratorOAuthAccount[]
}

export interface AdministratorListItem {
  firstName: string | null
  lastName: string | null
  localeCode: string
  avatar?: string | null
  id?: number
  username: string | null
  lastLogin?: string | null
  verifiedAt?: string | null
  email?: string | null
  createdAt: string
  updatedAt?: string | null
  enabled?: boolean
}

export interface AdministratorCreatePayload {
  firstName?: string | null
  lastName?: string | null
  localeCode: string
  username?: string | null
  plainPassword?: string | null
  email?: string | null
  enabled?: boolean
}

export interface AdministratorUpdatePayload {
  firstName?: string | null
  lastName?: string | null
  localeCode: string
  username?: string | null
  plainPassword?: string | null
  email?: string | null
  enabled?: boolean
}

export interface AdministratorResetPasswordPayload {
  newPassword: string
  confirmNewPassword?: string | null
}

export interface AdministratorRequestResetPasswordEmailPayload {
  email: string
}

export interface AdministratorJsonLd extends Administrator {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface AdministratorListItemJsonLd extends AdministratorListItem {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type AdministratorDetailJsonLd = AdministratorJsonLd

export interface AdministratorTokenRead {
  token: string
  adminUser: string
}

export interface AdministratorTokenUnauthorizedError {
  code: number
  message: string
}

export interface AdministratorTokenBadRequestError {
  type: string
  title: string
  status: number
  detail: string
}

export interface AdministratorTokenCreatePayload {
  email: string
  password: string
}
