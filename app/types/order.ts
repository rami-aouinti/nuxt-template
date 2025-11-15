import type {
  AdjustableInterface,
  Adjustment,
  AdjustmentInterface,
} from './adjustment'
import type { HydraContext } from './hydra'
import type {
  ShipmentInterface,
  StockableInterface,
  ShippableInterface,
} from './shipment'

export interface OrderJsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface OrderPromotionTranslation {
  id?: number
  label?: string | null
  locale: string
  translatable?: string
  translation?: string
  currentLocale?: string
  fallbackLocale?: string
}

export interface OrderPromotion {
  name: string
  description?: string | null
  priority: number
  exclusive: boolean
  usageLimit?: number | null
  used: number
  startsAt?: string | null
  endsAt?: string | null
  couponBased: boolean
  appliesToDiscounted?: boolean
  label?: string | null
  archivedAt?: string | null
  code: string
  createdAt: string
  updatedAt?: string | null
  translations?: Record<string, OrderPromotionTranslation>
  coupons?: OrderCoupon[]
  rules?: OrderPromotionRule[]
  actions?: OrderPromotionAction[]
  id?: number
}

export interface OrderCoupon {
  code: string
  usageLimit?: number | null
  used: number
  promotion?: string | null
  perCustomerUsageLimit?: number | null
  reusableFromCancelledOrders?: boolean
  expiresAt?: string | null
  createdAt: string
  updatedAt?: string | null
  valid?: boolean
  id?: number
}

export interface OrderPromotionRule {
  id?: number
  type: string
  configuration?: Array<string | null>
  promotion?: string | null
}

export interface OrderPromotionAction {
  id?: number
  type: string
  configuration?: Array<string | null>
  promotion?: string | null
}

export interface OrderPaymentRequest {
  hash?: string | null
  state: string
  action: string
  payload?: Record<string, unknown>
  responseData?: Array<string | null>
  payment?: string
  method?: string
  createdAt: string
  updatedAt?: string | null
}

export interface OrderPayment {
  order?: string
  method?: string | null
  state: string
  currencyCode: string
  amount: number
  details?: Array<string | null>
  paymentRequests?: OrderPaymentRequest[]
  createdAt: string
  updatedAt?: string | null
  id?: number
}

export type OrderPaymentJsonLd = OrderPayment & OrderJsonLdResource

export interface OrderCustomerWithAuthorization {
  email: string
  emailCanonical: string
  fullName?: string
  firstName?: string | null
  lastName?: string | null
  birthday?: string | null
  gender: string
  male?: boolean
  female?: boolean
  group?: string | null
  phoneNumber?: string | null
  subscribedToNewsletter: boolean
  createdAt: string
  updatedAt?: string | null
  id?: number
}

export interface OrderOAuthAccount {
  provider: string
  identifier: string
  accessToken?: string | null
  refreshToken?: string | null
  user?: string | null
}

export interface OrderUser {
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
  oAuthAccounts?: OrderOAuthAccount[]
  plainPassword?: string | null
  password?: string | null
  createdAt: string
  updatedAt?: string | null
  enabled: boolean
  roles?: string[]
  userIdentifier?: string
  id?: number
}

export interface OrderItemUnitAdjustment extends AdjustmentInterface {
  shipment?: string | null
  order?: string | null
  orderItem?: string | null
  orderItemUnit?: string | null
}

export interface OrderItemUnit {
  id?: number
  shipment?: string | null
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
  order?: string | null
}

export type OrderItemUnitJsonLd = OrderItemUnit & OrderJsonLdResource

export interface OrderItem {
  variant: string
  productName?: string | null
  id?: number
  quantity: number
  unitPrice: number
  originalUnitPrice?: number | null
  total?: number
  units?: string[]
  fullDiscountedUnitPrice?: number
  subtotal?: number
  adjustments?: string[]
  adjustmentsTotal?: number
  product?: Record<string, unknown> | null
  discountedUnitPrice?: number
  adjustmentsRecursively?: Array<string | null>
  adjustmentsTotalRecursively?: number
}

export type OrderItemJsonLd = OrderItem & OrderJsonLdResource

export interface OrderShipment extends ShipmentInterface {
  shipment?: string | null
  order?: string
  adjustments?: string[]
  adjustmentsTotal?: number
  orderItem: string
  stockable?: StockableInterface | null
  shippable?: ShippableInterface | null
  taxTotal?: number
  total?: number
  adjustment?: Adjustment[]
  orderItemUnit?: string | null
  tracking?: string | null
  tracked?: boolean
  shippingWeight?: number
  shippingVolume?: number
  shippingUnitCount?: number
  shippingUnitTotal?: number
  shippables?: unknown
}

export type OrderShipmentJsonLd = OrderShipment & OrderJsonLdResource

export interface OrderAdjustment extends AdjustmentInterface {
  order?: string | null
  orderItem?: string | null
  orderItemUnit?: string | null
  shipment?: string | null
}

export type OrderCouponJsonLd = OrderCoupon & OrderJsonLdResource

export type OrderPromotionJsonLd = OrderPromotion & OrderJsonLdResource

export interface Order {
  customer?: string | null
  channel?: string | null
  shippingAddress?: string | null
  billingAddress?: string | null
  payments?: string[]
  shipments?: string[]
  currencyCode: string
  localeCode: string
  promotionCoupon?: string | null
  checkoutState: string
  paymentState: string
  shippingState: string
  promotions?: string[]
  tokenValue?: string | null
  customerIp?: string | null
  createdByGuest?: boolean
  id?: number
  checkoutCompletedAt?: string | null
  number?: string | null
  notes?: string | null
  items?: string[]
  itemsTotal?: number
  adjustments?: string[]
  adjustmentsTotal?: number
  total?: number
  state: string
  createdAt: string
  updatedAt?: string | null
  customerWithAuthorization?: OrderCustomerWithAuthorization | null
  user?: OrderUser | null
  itemUnits?: Record<string, unknown>
  payment?: OrderPayment[]
  paymentRequests?: OrderPaymentRequest[]
  lastPayment?: OrderPayment | null
  shippingRequired?: boolean
  shipment?: OrderShipment[]
  adjustmentsRecursively?: Array<string | null>
  adjustmentsTotalRecursively?: number
  totalQuantity?: number
  empty?: boolean
  promotionSubjectTotal?: number
  promotionSubjectCount?: number
  itemsSubtotal?: number
  taxTotal?: number
  shippingTaxTotal?: number
  taxExcludedTotal?: number
  taxIncludedTotal?: number
  shippingTotal?: number
  orderPromotionTotal?: number
  shippingPromotionTotal?: number
  nonDiscountedItemsTotal?: number
  checkoutCompleted?: boolean
  discountedUnitPrice?: number
}

export type OrderJsonLd = Order & OrderJsonLdResource

export type OrderSyliusAdminOrderIndex = Order

export type OrderSyliusAdminOrderShow = Order

export interface OrderSyliusShopCartShow extends Order {
  customer?: { email: string } | null
  shippingAddress?: string | null
  billingAddress?: string | null
  promotionCoupon?: { code: string } | null
}

export type OrderSyliusShopOrderAccountShow = Order

export interface OrderSyliusShopOrderIndex {
  channel?: string | null
  tokenValue?: string | null
  checkoutCompletedAt?: string | null
  number?: string | null
  itemsTotal?: number
  state: string
  itemsSubtotal?: number
}

export interface OrderAddItemToCartPayload {
  productVariant: string
  quantity: number
}

export interface OrderChangeItemQuantityPayload {
  quantity: number
}

export interface OrderChangePaymentMethodPayload {
  paymentMethod: string
}

export interface OrderChoosePaymentMethodPayload {
  paymentMethod: string
}

export interface OrderChooseShippingMethodPayload {
  shippingMethod: string
}

export interface OrderCompleteOrderPayload {
  notes?: string | null
}

export type OrderPickupCartPayload = Record<string, never>

export interface OrderResendOrderConfirmationEmailPayload {
  orderTokenValue: string
}

export interface OrderUpdateCartPayload {
  email?: string | null
  billingAddress?: Record<string, unknown> | null
  shippingAddress?: Record<string, unknown> | null
  couponCode?: string | null
}

export type OrderJsonLdSyliusAdminOrderIndex = OrderJsonLd

export type OrderJsonLdSyliusAdminOrderShow = OrderJsonLd

export type OrderJsonLdSyliusShopCartShow = OrderJsonLd

export type OrderJsonLdSyliusShopOrderAccountShow = OrderJsonLd

export type OrderJsonLdSyliusShopOrderIndex = OrderSyliusShopOrderIndex &
  OrderJsonLdResource

export type OrderItemJsonLdSyliusAdminOrderIndex = OrderItemJsonLd

export type OrderItemJsonLdSyliusAdminOrderShow = OrderItemJsonLd

export type OrderItemJsonLdSyliusAdminOrderItemShow = OrderItemJsonLd

export type OrderItemJsonLdSyliusShopCartShow = OrderItemJsonLd

export type OrderItemJsonLdSyliusShopOrderAccountShow = OrderItemJsonLd

export type OrderItemJsonLdSyliusShopOrderItemShow = OrderItemJsonLd

export type OrderItemSyliusAdminOrderIndex = OrderItem

export type OrderItemSyliusAdminOrderShow = OrderItem

export interface OrderItemSyliusAdminOrderItemShow extends OrderItem {
  order: string
}

export type OrderItemSyliusShopCartShow = OrderItem

export type OrderItemSyliusShopOrderAccountShow = OrderItem

export interface OrderItemSyliusShopOrderItemShow extends OrderItem {
  order: string
}

export type OrderItemUnitSyliusAdminOrderItemUnitShow = OrderItemUnit

export type OrderItemUnitJsonLdSyliusAdminOrderItemUnitShow =
  OrderItemUnitJsonLd

export interface OrderItemUnitInterface extends OrderItemUnit {
  adjustments?: Adjustment[]
  adjustable?: AdjustableInterface | null
}

export type OrderItemUnitInterfaceJsonLd = OrderItemUnitInterface &
  OrderJsonLdResource

export type OrderAdjustmentJsonLd = OrderAdjustment & OrderJsonLdResource

export interface OrderCollection extends OrderJsonLdResource {
  'hydra:member': OrderJsonLd[]
  'hydra:totalItems'?: number
}
