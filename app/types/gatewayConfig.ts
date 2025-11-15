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

export interface GatewayConfig extends GatewayConfigAttributes {}

export type GatewayConfigSyliusAdminPaymentMethodIndex = GatewayConfig

export type GatewayConfigSyliusAdminPaymentMethodShow = GatewayConfig

export interface GatewayConfigSyliusAdminPaymentMethodCreate
  extends GatewayConfigAttributes {}

export interface GatewayConfigSyliusAdminPaymentMethodUpdate {
  config?: Array<string | null>
}

export interface GatewayConfigJsonld extends GatewayConfig, JsonLdResource {}

export type GatewayConfigJsonldSyliusAdminPaymentMethodIndex =
  GatewayConfigJsonld

export type GatewayConfigJsonldSyliusAdminPaymentMethodShow =
  GatewayConfigJsonld
