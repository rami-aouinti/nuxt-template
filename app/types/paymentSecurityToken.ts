import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface PaymentSecurityToken {
  details?: string | null
  afterUrl?: string | null
  targetUrl: string
  gatewayName: string
  hash: string
}

export type PaymentSecurityTokenSyliusAdminPaymentSecurityTokenIndex =
  PaymentSecurityToken

export type PaymentSecurityTokenSyliusAdminPaymentSecurityTokenShow =
  PaymentSecurityToken

export interface PaymentSecurityTokenJsonld
  extends PaymentSecurityToken,
    JsonLdResource {}

export type PaymentSecurityTokenJsonldSyliusAdminPaymentSecurityTokenIndex =
  PaymentSecurityTokenJsonld

export type PaymentSecurityTokenJsonldSyliusAdminPaymentSecurityTokenShow =
  PaymentSecurityTokenJsonldSyliusAdminPaymentSecurityTokenIndex
