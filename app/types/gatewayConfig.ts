import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface GatewayConfigAttributes {
  factoryName: string
  gatewayName: string
  config?: Array<string | null>
}

export type GatewayConfig = GatewayConfigAttributes

export type GatewayConfigSyliusAdminPaymentMethodIndex = GatewayConfig

export type GatewayConfigSyliusAdminPaymentMethodShow = GatewayConfig

export type GatewayConfigSyliusAdminPaymentMethodCreate =
  GatewayConfigAttributes

export interface GatewayConfigSyliusAdminPaymentMethodUpdate {
  config?: Array<string | null>
}

export type GatewayConfigJsonld = GatewayConfig & JsonLdResource

export type GatewayConfigJsonldSyliusAdminPaymentMethodIndex =
  GatewayConfigJsonld

export type GatewayConfigJsonldSyliusAdminPaymentMethodShow =
  GatewayConfigJsonld
