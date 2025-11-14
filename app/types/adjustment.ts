export interface Adjustment {
  shipment?: string | null
  id?: number
  order?: string | null
  orderItem?: string | null
  orderItemUnit?: string | null
  type: string
  label?: string | null
  amount: number
  neutral: boolean
  locked: boolean
  originCode?: string | null
  details?: Array<string | null>
  createdAt?: string
  updatedAt?: string | null
  adjustmentTypeChoices?: unknown
  adjustable?: AdjustableInterface | null
  charge?: boolean
  credit?: boolean
}

export interface AdjustmentSyliusAdminAdjustmentShow extends Adjustment {}

export interface AdjustmentSyliusAdminOrderItemIndex extends Adjustment {}

export interface AdjustmentSyliusAdminOrderItemUnitIndex extends Adjustment {}

export interface AdjustmentSyliusAdminShipmentIndex extends Adjustment {}

export interface AdjustmentSyliusShopCartShow extends Adjustment {
  id: number
}

export interface AdjustmentJsonld extends Adjustment {
  '@context'?: string | Record<string, unknown>
  '@id'?: string
  '@type'?: string
}

export interface AdjustmentJsonldSyliusAdminAdjustmentShow extends AdjustmentJsonld {}

export interface AdjustmentJsonldSyliusAdminOrderItemIndex extends AdjustmentJsonld {}

export interface AdjustmentJsonldSyliusAdminOrderItemUnitIndex extends AdjustmentJsonld {}

export interface AdjustmentJsonldSyliusAdminShipmentIndex extends AdjustmentJsonld {}

export interface AdjustmentJsonldSyliusShopCartShow extends AdjustmentJsonld {
  id: number
}

export interface AdjustableInterface {
  adjustments?: Adjustment[]
  type: string
  label?: string | null
  amount: number
  neutral: boolean
  locked: boolean
  charge?: boolean
  credit?: boolean
  originCode?: string | null
  order?: string | null
  orderItem?: string | null
  orderItemUnit?: string | null
  details?: Array<string | null>
  id?: number
  createdAt?: string
  updatedAt?: string | null
  adjustmentsTotal?: number
}

export interface AdjustableInterfaceJsonld extends AdjustableInterface {}

export interface AdjustmentInterface {
  adjustable?: AdjustableInterface | null
  type: string
  label?: string | null
  amount: number
  neutral: boolean
  locked: boolean
  charge?: boolean
  credit?: boolean
  originCode?: string | null
  order?: string | null
  orderItem?: string | null
  orderItemUnit?: string | null
  details?: Array<string | null>
  id?: number
  createdAt?: string
  updatedAt?: string | null
}

export interface AdjustmentInterfaceJsonld extends AdjustmentInterface {}
