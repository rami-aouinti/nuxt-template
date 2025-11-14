import type { HydraContext } from './hydra'
import type { Adjustment, AdjustmentInterface } from './adjustment'

export interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ShipmentAttributes {
  order: string
  state: string
  method: string
  units: string[]
  tracking?: string | null
  shippedAt?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface Shipment extends ShipmentAttributes {
  id?: number
}

export type ShipmentSyliusAdminOrderIndex = Shipment

export type ShipmentSyliusAdminOrderShow = ShipmentSyliusAdminOrderIndex

export type ShipmentSyliusAdminShipmentIndex = Shipment

export type ShipmentSyliusAdminShipmentShow = ShipmentSyliusAdminShipmentIndex

export interface ShipmentSyliusShopCartShow {
  id?: number
  method: string
}

export interface ShipmentSyliusShopOrderAccountShow {
  method: string
}

export type ShipmentSyliusShopShipmentShow = Shipment

export interface ShipmentResendShipmentConfirmationEmail {
  shipmentId?: string | null
}

export interface ShipmentShipShipmentSyliusAdminShipmentUpdateJsonMergePatch {
  trackingCode?: string | null
}

export interface ShipmentJsonld extends JsonLdResource, Shipment {}

export interface ShipmentJsonldSyliusAdminOrderIndex
  extends ShipmentJsonld,
    ShipmentSyliusAdminOrderIndex {}

export type ShipmentJsonldSyliusAdminOrderShow = ShipmentJsonldSyliusAdminOrderIndex

export interface ShipmentJsonldSyliusAdminShipmentIndex
  extends ShipmentJsonld,
    ShipmentSyliusAdminShipmentIndex {}

export type ShipmentJsonldSyliusAdminShipmentShow = ShipmentJsonldSyliusAdminShipmentIndex

export interface ShipmentJsonldSyliusShopCartShow
  extends JsonLdResource,
    ShipmentSyliusShopCartShow {}

export interface ShipmentJsonldSyliusShopOrderAccountShow
  extends JsonLdResource,
    ShipmentSyliusShopOrderAccountShow {}

export interface ShipmentJsonldSyliusShopShipmentShow
  extends ShipmentJsonld,
    ShipmentSyliusShopShipmentShow {}

export interface StockableInterface {
  inventoryName?: string | null
  inStock?: boolean
  onHold: number
  onHand: number
  tracked: boolean
}

export interface StockableInterfaceJsonld
  extends JsonLdResource,
    StockableInterface {}

export interface ShippableInterface {
  shippingWeight?: number | null
  shippingVolume?: number | null
  shippingWidth?: number | null
  shippingHeight?: number | null
  shippingDepth?: number | null
  shippingCategory?: string | null
}

export type ShippableInterfaceSyliusAdminOrderItemUnitShow = ShippableInterface

export interface ShippableInterfaceJsonld
  extends JsonLdResource,
    ShippableInterface {}

export interface ShippableInterfaceJsonldSyliusAdminOrderItemUnitShow
  extends ShippableInterfaceJsonld,
    ShippableInterfaceSyliusAdminOrderItemUnitShow {}

export interface ShipmentUnitInterface {
  shipment?: string | null
  shippable?: ShippableInterface | null
  createdAt: string
  updatedAt?: string | null
  id?: number
}

export interface ShipmentUnitInterfaceJsonld
  extends JsonLdResource,
    ShipmentUnitInterface {}

export interface ShipmentInterface {
  order: string
  state: string
  method: string
  units: ShipmentUnitInterface[]
  shipment?: string | null
  id?: number
  adjustments?: string[]
  adjustmentsTotal?: number
  orderItem: string
  createdAt: string
  updatedAt?: string | null
  stockable?: StockableInterface | null
  shippable?: ShippableInterface | null
  taxTotal?: number
  total?: number
  adjustment?: Adjustment[]
  details?: Array<string | null>
  orderItemUnit?: string | null
  tracking?: string | null
  tracked?: boolean
  shippedAt?: string | null
  shippingWeight?: number
  shippingVolume?: number
  shippingUnitCount?: number
  shippingUnitTotal?: number
  shippables?: unknown
}

export interface ShipmentInterfaceJsonld
  extends JsonLdResource,
    ShipmentInterface {}

export interface ShipmentInterfaceAdjustment extends AdjustmentInterface {
  shipment?: string | null
  order?: string | null
  orderItem?: string | null
  orderItemUnit?: string | null
}

export type ShipmentInterfaceJsonldSyliusAdminShipmentIndex = ShipmentInterfaceJsonld

export type ShipmentInterfaceJsonldSyliusAdminShipmentShow = ShipmentInterfaceJsonld
