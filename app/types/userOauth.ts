import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface UserOauth {
  provider: string
  identifier: string
  accessToken?: string | null
  refreshToken?: string | null
  id?: number
  user?: string | null
}

export type UserOauthSyliusAdminUserOauthIndex = UserOauth

export type UserOauthSyliusAdminUserOauthShow = UserOauth

export type UserOauthSyliusAdminUserOauthCreate = Omit<
  UserOauth,
  'id' | 'user'
> & { user?: string | null }

export type UserOauthSyliusAdminUserOauthUpdate =
  Partial<UserOauthSyliusAdminUserOauthCreate>

export interface UserOauthJsonld extends UserOauth, JsonLdResource {}

export type UserOauthJsonldSyliusAdminUserOauthIndex = UserOauthJsonld

export type UserOauthJsonldSyliusAdminUserOauthShow =
  UserOauthJsonldSyliusAdminUserOauthIndex
