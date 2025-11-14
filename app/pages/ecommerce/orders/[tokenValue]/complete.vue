<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import type {
  OrderJsonLdSyliusShopOrderAccountShow,
  OrderItemJsonLdSyliusShopOrderItemShow,
  OrderPayment,
  OrderShipment,
} from '~/types/order'

const { t, te, locale } = useI18n()
const route = useRoute()

definePageMeta({
  title: 'pages.ecommerceOrder.metaTitle',
})

type UnknownRecord = Record<string, unknown>

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80'

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object')

const toRecord = (value: unknown): UnknownRecord | null =>
  (isRecord(value) ? (value as UnknownRecord) : null)

const getString = (value: UnknownRecord | null | undefined, key: string): string | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate
  }

  return null
}

const extractCollectionItems = <T,>(input: HydraCollection<T> | null | undefined): T[] => {
  if (!input) {
    return []
  }

  if (Array.isArray((input as HydraCollection<T>)['hydra:member'])) {
    return ((input as HydraCollection<T>)['hydra:member'] as T[]).filter((item) => Boolean(item))
  }

  if (Array.isArray(input.member)) {
    return input.member.filter((item) => Boolean(item))
  }

  if (Array.isArray(input.items)) {
    return input.items.filter((item) => Boolean(item))
  }

  if (Array.isArray(input.data)) {
    return input.data.filter((item) => Boolean(item))
  }

  return []
}

const normalizeAmount = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const tokenValue = computed(() => {
  const param = route.params.tokenValue
  return Array.isArray(param) ? param[0] ?? '' : (param as string | undefined) ?? ''
})

const hasToken = computed(() => tokenValue.value.trim().length > 0)

const fetchOrder = async () => {
  if (!hasToken.value) {
    return null
  }

  return await $fetch<OrderJsonLdSyliusShopOrderAccountShow>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}`,
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const fetchOrderItems = async () => {
  if (!hasToken.value) {
    return null
  }

  return await $fetch<HydraCollection<OrderItemJsonLdSyliusShopOrderItemShow>>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}/items`,
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const {
  data: orderResponse,
  pending: orderPending,
  error: orderError,
  refresh: refreshOrder,
} = await useAsyncData(
  () => `ecommerce-order-${tokenValue.value}-${locale.value}`,
  fetchOrder,
  {
    watch: [() => tokenValue.value, () => locale.value],
  },
)

const {
  data: orderItemsResponse,
  pending: itemsPending,
  error: itemsError,
  refresh: refreshItems,
} = await useAsyncData(
  () => `ecommerce-order-items-${tokenValue.value}-${locale.value}`,
  fetchOrderItems,
  {
    watch: [() => tokenValue.value, () => locale.value],
  },
)

const order = computed(() => orderResponse.value ?? null)

const orderItems = computed(() =>
  extractCollectionItems<OrderItemJsonLdSyliusShopOrderItemShow>(orderItemsResponse.value),
)

const currencyCode = computed(() => order.value?.currencyCode || 'USD')

const currencyFormatter = computed(() => {
  const code = currencyCode.value

  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: code,
    })
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }
})

const formatMoney = (amount: unknown) => {
  const normalized = normalizeAmount(amount)
  if (normalized == null) {
    return null
  }

  return currencyFormatter.value.format(normalized / 100)
}

const getAddressLines = (source: unknown) => {
  const record = toRecord(source)
  if (!record) {
    return []
  }

  const firstName = getString(record, 'firstName')
  const lastName = getString(record, 'lastName')
  const company = getString(record, 'company')
  const street = getString(record, 'street') || getString(record, 'street1')
  const streetTwo = getString(record, 'street2')
  const postcode = getString(record, 'postcode')
  const city = getString(record, 'city')
  const province = getString(record, 'provinceName') || getString(record, 'provinceCode')
  const country = getString(record, 'countryName') || getString(record, 'countryCode')
  const phone = getString(record, 'phoneNumber')

  const lines: string[] = []

  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  if (fullName) {
    lines.push(fullName)
  }

  if (company) {
    lines.push(company)
  }

  if (street) {
    lines.push(street)
  }

  if (streetTwo) {
    lines.push(streetTwo)
  }

  const locality = [postcode, city].filter(Boolean).join(' ')
  if (locality) {
    lines.push(locality)
  }

  const region = [province, country].filter(Boolean).join(', ')
  if (region) {
    lines.push(region)
  }

  if (phone) {
    lines.push(phone)
  }

  return lines
}

const billingAddressLines = computed(() => getAddressLines(order.value?.billingAddress))
const shippingAddressLines = computed(() => getAddressLines(order.value?.shippingAddress))

const formatLocaleCode = (code: string | null | undefined) => {
  if (!code) {
    return t('pages.ecommerceOrder.fallbacks.unknownLocale')
  }

  const parts = code.replace(/_/g, '-').split('-')
  const language = parts[0]
  const region = parts[1]

  try {
    const languageDisplay = new Intl.DisplayNames([locale.value], { type: 'language' })
    const regionDisplay = region
      ? new Intl.DisplayNames([locale.value], { type: 'region' })
      : null

    const languageName = languageDisplay.of(language || '')
    const regionName = region ? regionDisplay?.of(region) : undefined

    if (languageName && regionName) {
      return `${languageName} (${regionName})`
    }

    if (languageName) {
      return languageName
    }
  } catch {
    // ignore formatting errors and fall back to the original code
  }

  return code
}

const formatState = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return t('pages.ecommerceOrder.fallbacks.unknownState')
  }

  const normalized = value.trim()
  const translationKey = `pages.ecommerceOrder.states.${normalized}`
  if (te(translationKey)) {
    return t(translationKey)
  }

  const withSpaces = normalized.replace(/[_-]+/g, ' ')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

const checkoutStateIndex = computed(() => {
  const mapping: Record<string, number> = {
    cart: 0,
    addressed: 1,
    'shipping_selected': 2,
    'payment_selected': 3,
    completed: 4,
  }

  const state = order.value?.checkoutState || 'cart'
  return mapping[state] ?? 0
})

const checkoutSteps = computed(() => {
  const steps: Array<{ key: 'address' | 'shipping' | 'payment' | 'complete'; status: 'complete' | 'current' | 'upcoming' }> = []
  const currentIndex = checkoutStateIndex.value

  const labels: Array<'address' | 'shipping' | 'payment' | 'complete'> = [
    'address',
    'shipping',
    'payment',
    'complete',
  ]

  labels.forEach((label, index) => {
    let status: 'complete' | 'current' | 'upcoming'
    if (currentIndex > index) {
      status = 'complete'
    } else if (currentIndex === index) {
      status = 'current'
    } else {
      status = 'upcoming'
    }

    steps.push({ key: label, status })
  })

  return steps
})

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  try {
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return date.toISOString()
  }
}

const summaryMetrics = computed(() => {
  if (!order.value) {
    return []
  }

  return [
    {
      label: t('pages.ecommerceOrder.summary.currency'),
      value: order.value.currencyCode || '—',
    },
    {
      label: t('pages.ecommerceOrder.summary.locale'),
      value: formatLocaleCode(order.value.localeCode),
    },
    {
      label: t('pages.ecommerceOrder.summary.checkoutState'),
      value: formatState(order.value.checkoutState),
    },
    {
      label: t('pages.ecommerceOrder.summary.paymentState'),
      value: formatState(order.value.paymentState),
    },
    {
      label: t('pages.ecommerceOrder.summary.shippingState'),
      value: formatState(order.value.shippingState),
    },
    {
      label: t('pages.ecommerceOrder.summary.placedOn'),
      value: formatDateTime(order.value.checkoutCompletedAt || order.value.createdAt) || '—',
    },
  ]
})

const collectPayments = (value: unknown): OrderPayment[] => {
  if (!value) {
    return []
  }

  const payments: OrderPayment[] = []

  const addPayment = (candidate: unknown) => {
    if (!candidate) {
      return
    }

    const record = toRecord(candidate)
    if (!record) {
      return
    }

    payments.push(record as unknown as OrderPayment)
  }

  if (Array.isArray((value as OrderJsonLdSyliusShopOrderAccountShow)?.payment)) {
    for (const entry of (value as OrderJsonLdSyliusShopOrderAccountShow).payment ?? []) {
      addPayment(entry)
    }
  }

  const direct = toRecord(value)
  if (direct) {
    const paymentField = direct.payment
    if (Array.isArray(paymentField)) {
      for (const entry of paymentField) {
        addPayment(entry)
      }
    }

    const lastPayment = direct.lastPayment
    if (lastPayment) {
      addPayment(lastPayment)
    }
  }

  const unique: OrderPayment[] = []
  const seen = new Set<string>()

  for (const payment of payments) {
    const record = payment as unknown as UnknownRecord
    const key = String(record.id ?? record['@id'] ?? JSON.stringify(record))
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(payment)
    }
  }

  return unique
}

const payments = computed(() => collectPayments(order.value))

const resolvePaymentMethod = (payment: OrderPayment): string => {
  const record = payment as unknown as UnknownRecord
  const method = record.method

  if (typeof method === 'string' && method.trim().length > 0) {
    return method
  }

  const methodRecord = toRecord(method)
  const name = getString(methodRecord, 'name')
  if (name) {
    return name
  }

  const code = getString(methodRecord, 'code')
  if (code) {
    return code
  }

  return t('pages.ecommerceOrder.fallbacks.unknownPaymentMethod')
}

const shipments = computed(() => {
  const orderRecord = order.value as unknown as UnknownRecord | null
  const result: OrderShipment[] = []

  if (!orderRecord) {
    return result
  }

  const shipmentField = orderRecord.shipment
  if (Array.isArray(shipmentField)) {
    for (const entry of shipmentField) {
      if (isRecord(entry)) {
        result.push(entry as unknown as OrderShipment)
      }
    }
  }

  return result
})

const resolveShipmentMethod = (shipment: OrderShipment): string => {
  const record = shipment as unknown as UnknownRecord
  const method = record.method

  if (typeof method === 'string' && method.trim().length > 0) {
    return method
  }

  const methodRecord = toRecord(method)
  const name = getString(methodRecord, 'name')
  if (name) {
    return name
  }

  const code = getString(methodRecord, 'code')
  if (code) {
    return code
  }

  return t('pages.ecommerceOrder.fallbacks.unknownShipmentMethod')
}

const resolveShipmentTracking = (shipment: OrderShipment): string | null => {
  const record = shipment as unknown as UnknownRecord
  const tracking = getString(record, 'tracking')
  if (tracking) {
    return tracking
  }

  return null
}

const resolveOrderItemName = (item: OrderItemJsonLdSyliusShopOrderItemShow): string => {
  const record = item as unknown as UnknownRecord
  const productName = getString(record, 'productName')
  if (productName) {
    return productName
  }

  const variant = getString(record, 'variantName') || getString(record, 'variant')
  if (variant) {
    return variant
  }

  return t('pages.ecommerceOrder.fallbacks.unknownProduct')
}

const resolveOrderItemVariant = (item: OrderItemJsonLdSyliusShopOrderItemShow): string | null => {
  const record = item as unknown as UnknownRecord
  const variantName = getString(record, 'variantName')
  if (variantName) {
    return variantName
  }

  const variantCode = getString(record, 'variantCode')
  if (variantCode) {
    return variantCode
  }

  const detailRecord = toRecord(record.details)
  const detailLabel = getString(detailRecord, 'label')
  if (detailLabel) {
    return detailLabel
  }

  return null
}

const resolveOrderItemImage = (item: OrderItemJsonLdSyliusShopOrderItemShow): string => {
  const record = item as unknown as UnknownRecord
  const productRecord = toRecord(record.product)
  const images = productRecord?.images

  if (typeof images === 'string' && images.trim().length > 0) {
    return images
  }

  if (Array.isArray(images)) {
    for (const image of images) {
      if (typeof image === 'string' && image.trim().length > 0) {
        return image
      }

      const imageRecord = toRecord(image)
      const path = getString(imageRecord, 'path') || getString(imageRecord, 'file')
      if (path) {
        return path
      }
    }
  }

  const firstImage = getString(productRecord, 'image')
  if (firstImage) {
    return firstImage
  }

  return FALLBACK_PRODUCT_IMAGE
}

const formatQuantity = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return 0
}

const resolveOrderItemUnitPrice = (item: OrderItemJsonLdSyliusShopOrderItemShow) => {
  const record = item as unknown as UnknownRecord
  const discounted = normalizeAmount(record.discountedUnitPrice)
  if (discounted != null) {
    return discounted
  }

  return normalizeAmount(record.unitPrice)
}

const resolveOrderItemOriginalPrice = (item: OrderItemJsonLdSyliusShopOrderItemShow) => {
  const record = item as unknown as UnknownRecord
  const original = normalizeAmount(record.originalUnitPrice)
  if (original != null) {
    return original
  }

  return null
}

const resolveOrderItemSubtotal = (item: OrderItemJsonLdSyliusShopOrderItemShow) => {
  const record = item as unknown as UnknownRecord
  const subtotal = normalizeAmount(record.subtotal)
  if (subtotal != null) {
    return subtotal
  }

  const total = normalizeAmount(record.total)
  if (total != null) {
    return total
  }

  const unit = resolveOrderItemUnitPrice(item)
  if (unit != null) {
    return unit * formatQuantity(record.quantity)
  }

  return null
}

const itemsCount = computed(() =>
  orderItems.value.reduce((total, item) => total + formatQuantity((item as unknown as UnknownRecord).quantity), 0),
)

const totals = computed(() => {
  if (!order.value) {
    return null
  }

  const record = order.value as unknown as UnknownRecord

  return {
    items: normalizeAmount(record.itemsTotal) ?? 0,
    discounts: normalizeAmount(record.orderPromotionTotal) ?? 0,
    shipping: normalizeAmount(record.shippingTotal) ?? 0,
    taxes: normalizeAmount(record.taxTotal) ?? 0,
    grandTotal: normalizeAmount(record.total) ?? 0,
  }
})

const notes = computed(() => order.value?.notes || '')

const refreshAll = async () => {
  await Promise.all([refreshOrder(), refreshItems()])
}
</script>

<template>
  <v-container fluid class="order-complete-page pa-0">
    <section class="order-complete-section">
      <ol class="order-stepper" aria-label="Checkout progress">
        <li
          v-for="(step, index) in checkoutSteps"
          :key="step.key"
          class="order-stepper__step"
          :class="`order-stepper__step--${step.status}`"
        >
          <div class="order-stepper__indicator" :aria-label="t(`pages.ecommerceOrder.status.steps.${step.key}`)">
            <span v-if="step.status === 'complete'" class="order-stepper__check">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="order-stepper__label">
            {{ t(`pages.ecommerceOrder.status.steps.${step.key}`) }}
          </span>
        </li>
      </ol>
    </section>

    <section class="order-complete-section">
      <AppCard class="order-card" elevation="3">
        <div class="order-card__header">
          <div>
            <p class="order-card__eyebrow text-uppercase text-medium-emphasis mb-1">
              {{ t('pages.ecommerceOrder.summary.title') }}
            </p>
            <h1 class="text-h4 font-weight-bold mb-2">
              {{ t('pages.ecommerceOrder.heading.title') }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
              {{ t('pages.ecommerceOrder.heading.subtitle') }}
            </p>
          </div>
          <div class="order-card__chips">
            <v-chip
              v-if="order?.number"
              color="primary"
              variant="elevated"
              size="large"
              class="order-card__chip"
            >
              {{ t('pages.ecommerceOrder.summary.orderNumber') }} {{ order?.number }}
            </v-chip>
            <v-chip
              v-if="tokenValue"
              color="secondary"
              variant="tonal"
              size="large"
              class="order-card__chip"
            >
              {{ tokenValue }}
            </v-chip>
          </div>
        </div>

        <div v-if="orderPending" class="order-card__status">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>
        <v-alert
          v-else-if="orderError"
          type="error"
          variant="tonal"
          border="start"
          prominent
          class="mb-6"
        >
          <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
            <span>{{ t('pages.ecommerceOrder.errors.loadFailed') }}</span>
            <AppButton color="primary" variant="flat" @click="refreshOrder">
              {{ t('pages.ecommerceOrder.actions.refresh') }}
            </AppButton>
          </div>
        </v-alert>
        <div v-else-if="order" class="order-summary">
          <div class="order-summary__grid">
            <div class="order-summary__panel order-summary__panel--primary">
              <div class="order-summary__metrics">
                <div v-for="metric in summaryMetrics" :key="metric.label" class="order-summary__metric">
                  <span class="order-summary__metric-label text-body-2 text-medium-emphasis">
                    {{ metric.label }}
                  </span>
                  <span class="order-summary__metric-value text-body-1 font-weight-medium">
                    {{ metric.value }}
                  </span>
                </div>
              </div>

              <div class="order-summary__addresses">
                <div class="order-summary__address">
                  <h2 class="text-subtitle-1 font-weight-semibold mb-2">
                    {{ t('pages.ecommerceOrder.addresses.billing') }}
                  </h2>
                  <p
                    v-if="billingAddressLines.length === 0"
                    class="text-body-2 text-medium-emphasis mb-0"
                  >
                    {{ t('pages.ecommerceOrder.addresses.missing') }}
                  </p>
                  <p
                    v-for="(line, index) in billingAddressLines"
                    v-else
                    :key="`billing-${index}`"
                    class="text-body-2 mb-1"
                  >
                    {{ line }}
                  </p>
                </div>
                <div class="order-summary__address">
                  <h2 class="text-subtitle-1 font-weight-semibold mb-2">
                    {{ t('pages.ecommerceOrder.addresses.shipping') }}
                  </h2>
                  <p
                    v-if="shippingAddressLines.length === 0"
                    class="text-body-2 text-medium-emphasis mb-0"
                  >
                    {{ t('pages.ecommerceOrder.addresses.missing') }}
                  </p>
                  <p
                    v-for="(line, index) in shippingAddressLines"
                    v-else
                    :key="`shipping-${index}`"
                    class="text-body-2 mb-1"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>

            <div class="order-summary__panel order-summary__panel--secondary">
              <div class="order-summary__section">
                <div class="order-summary__section-header">
                  <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                    {{ t('pages.ecommerceOrder.payments.title') }}
                  </h2>
                  <span class="text-caption text-medium-emphasis">
                    {{ t('pages.ecommerceOrder.payments.state') }}: {{ formatState(order.paymentState) }}
                  </span>
                </div>
                <div v-if="payments.length === 0" class="text-body-2 text-medium-emphasis">
                  {{ t('pages.ecommerceOrder.payments.noPayments') }}
                </div>
                <ul v-else class="order-summary__list">
                  <li v-for="payment in payments" :key="payment.id ?? resolvePaymentMethod(payment)" class="order-summary__list-item">
                    <div>
                      <p class="text-body-1 font-weight-medium mb-1">
                        {{ resolvePaymentMethod(payment) }}
                      </p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        {{ formatState((payment as unknown as UnknownRecord).state) }}
                      </p>
                    </div>
                    <span class="text-body-1 font-weight-semibold">
                      {{ formatMoney((payment as unknown as UnknownRecord).amount) ?? '—' }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="order-summary__section">
                <div class="order-summary__section-header">
                  <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                    {{ t('pages.ecommerceOrder.shipments.title') }}
                  </h2>
                  <span class="text-caption text-medium-emphasis">
                    {{ t('pages.ecommerceOrder.shipments.state') }}: {{ formatState(order.shippingState) }}
                  </span>
                </div>
                <div v-if="shipments.length === 0" class="text-body-2 text-medium-emphasis">
                  {{ t('pages.ecommerceOrder.shipments.noShipments') }}
                </div>
                <ul v-else class="order-summary__list">
                  <li v-for="shipment in shipments" :key="shipment.id ?? resolveShipmentMethod(shipment)" class="order-summary__list-item">
                    <div>
                      <p class="text-body-1 font-weight-medium mb-1">
                        {{ resolveShipmentMethod(shipment) }}
                      </p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        {{ formatState((shipment as unknown as UnknownRecord).state) }}
                      </p>
                    </div>
                    <span v-if="resolveShipmentTracking(shipment)" class="text-caption text-medium-emphasis">
                      {{ resolveShipmentTracking(shipment) }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-body-2 text-medium-emphasis">
          {{ t('pages.ecommerceOrder.errors.loadFailed') }}
        </div>
      </AppCard>
    </section>

    <section class="order-complete-section">
      <AppCard class="order-card" elevation="2">
        <div class="order-card__header order-card__header--compact">
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">
              {{ t('pages.ecommerceOrder.items.title') }}
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ t('pages.ecommerceOrder.items.count', { count: itemsCount }) }}
            </p>
          </div>
          <AppButton color="primary" variant="tonal" @click="refreshAll">
            {{ t('pages.ecommerceOrder.actions.refresh') }}
          </AppButton>
        </div>

        <div v-if="itemsPending" class="order-card__status">
          <v-progress-circular indeterminate color="primary" size="40" />
        </div>
        <v-alert
          v-else-if="itemsError"
          type="error"
          variant="tonal"
          border="start"
          prominent
          class="mb-6"
        >
          <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
            <span>{{ t('pages.ecommerceOrder.errors.loadFailed') }}</span>
            <AppButton color="primary" variant="flat" @click="refreshItems">
              {{ t('pages.ecommerceOrder.actions.refresh') }}
            </AppButton>
          </div>
        </v-alert>
        <div v-else>
          <div v-if="orderItems.length === 0" class="text-body-2 text-medium-emphasis">
            {{ t('pages.ecommerceOrder.items.empty') }}
          </div>
          <div v-else class="order-items">
            <v-table class="order-items__table" density="comfortable">
              <thead>
                <tr>
                  <th>{{ t('pages.ecommerceOrder.items.table.item') }}</th>
                  <th class="text-right">
                    {{ t('pages.ecommerceOrder.items.table.unitPrice') }}
                  </th>
                  <th class="text-right">{{ t('pages.ecommerceOrder.items.table.quantity') }}</th>
                  <th class="text-right">
                    {{ t('pages.ecommerceOrder.items.table.subtotal') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderItems" :key="(item as unknown as UnknownRecord).id ?? resolveOrderItemName(item)">
                  <td>
                    <div class="order-item">
                      <v-avatar size="64" variant="tonal" class="order-item__avatar">
                        <v-img :src="resolveOrderItemImage(item)" cover>
                          <template #placeholder>
                            <v-skeleton-loader type="avatar" class="h-100" />
                          </template>
                        </v-img>
                      </v-avatar>
                      <div class="order-item__details">
                        <p class="text-body-1 font-weight-medium mb-1">
                          {{ resolveOrderItemName(item) }}
                        </p>
                        <p v-if="resolveOrderItemVariant(item)" class="text-caption text-medium-emphasis mb-0">
                          {{ resolveOrderItemVariant(item) }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="text-right">
                    <div class="order-item__pricing">
                      <span class="text-body-1 font-weight-medium">
                        {{ formatMoney(resolveOrderItemUnitPrice(item)) ?? '—' }}
                      </span>
                      <span
                        v-if="resolveOrderItemOriginalPrice(item) &&
                          resolveOrderItemOriginalPrice(item)! > resolveOrderItemUnitPrice(item)!"
                        class="order-item__pricing-original"
                      >
                        {{ formatMoney(resolveOrderItemOriginalPrice(item)) }}
                      </span>
                    </div>
                  </td>
                  <td class="text-right">
                    <span class="text-body-1">
                      {{ formatQuantity((item as unknown as UnknownRecord).quantity) }}
                    </span>
                  </td>
                  <td class="text-right">
                    <span class="text-body-1 font-weight-semibold">
                      {{ formatMoney(resolveOrderItemSubtotal(item)) ?? '—' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div v-if="totals" class="order-totals">
              <div class="order-totals__row">
                <span>{{ t('pages.ecommerceOrder.totals.items') }}</span>
                <span>{{ formatMoney(totals.items) ?? '—' }}</span>
              </div>
              <div class="order-totals__row">
                <span>{{ t('pages.ecommerceOrder.totals.discounts') }}</span>
                <span>{{ formatMoney(totals.discounts) ?? '—' }}</span>
              </div>
              <div class="order-totals__row">
                <span>{{ t('pages.ecommerceOrder.totals.shipping') }}</span>
                <span>{{ formatMoney(totals.shipping) ?? '—' }}</span>
              </div>
              <div class="order-totals__row">
                <span>{{ t('pages.ecommerceOrder.totals.taxes') }}</span>
                <span>{{ formatMoney(totals.taxes) ?? '—' }}</span>
              </div>
              <div class="order-totals__row order-totals__row--grand">
                <span>{{ t('pages.ecommerceOrder.totals.grandTotal') }}</span>
                <span>{{ formatMoney(totals.grandTotal) ?? '—' }}</span>
              </div>
            </div>

            <div class="order-notes">
              <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                {{ t('pages.ecommerceOrder.notes.title') }}
              </h3>
              <p v-if="notes" class="text-body-2 mb-0">{{ notes }}</p>
              <p v-else class="text-body-2 text-medium-emphasis mb-0">
                {{ t('pages.ecommerceOrder.notes.empty') }}
              </p>
            </div>
          </div>
        </div>
      </AppCard>
    </section>
  </v-container>
</template>

<style scoped>
.order-complete-page {
  background: linear-gradient(180deg, rgba(248, 250, 255, 0.9), rgba(233, 239, 255, 0.85));
  padding: 24px clamp(16px, 6vw, 64px) 64px;
}

.order-complete-section {
  margin-bottom: 32px;
}

.order-stepper {
  display: flex;
  align-items: center;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
}

.order-stepper__step {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 32px;
}

.order-stepper__step::after {
  content: '';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 2px;
  background: rgba(var(--v-theme-primary), 0.2);
}

.order-stepper__step:last-child {
  padding-right: 0;
}

.order-stepper__step:last-child::after {
  display: none;
}

.order-stepper__indicator {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 600;
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgba(var(--v-theme-primary), 0.9);
}

.order-stepper__step--complete .order-stepper__indicator {
  background: rgba(var(--v-theme-primary), 0.18);
}

.order-stepper__step--current .order-stepper__indicator {
  background: rgba(var(--v-theme-primary), 1);
  color: #fff;
}

.order-stepper__check {
  font-size: 1.1rem;
}

.order-stepper__label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-background), 0.72);
  white-space: nowrap;
}

.order-card {
  padding: clamp(20px, 4vw, 32px);
  border-radius: var(--app-rounded, 18px);
}

.order-card__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.order-card__header--compact {
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.order-card__eyebrow {
  letter-spacing: 0.12em;
}

.order-card__chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.order-card__chip {
  font-weight: 600;
}

.order-card__status {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-summary__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
}

.order-summary__panel {
  background: rgba(var(--v-theme-surface-variant), 0.12);
  border-radius: var(--app-rounded, 16px);
  padding: clamp(16px, 3vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-summary__panel--secondary {
  background: rgba(var(--v-theme-primary), 0.08);
}

.order-summary__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.order-summary__metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.75);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.order-summary__metric-value {
  font-size: 1.05rem;
}

.order-summary__addresses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.order-summary__address {
  background: rgba(var(--v-theme-surface), 0.75);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.order-summary__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(var(--v-theme-surface), 0.85);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
}

.order-summary__section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-summary__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-summary__list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.order-items__table th {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.62);
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-item__avatar {
  border-radius: 16px;
  overflow: hidden;
}

.order-item__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-item__pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.order-item__pricing-original {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.order-totals {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.order-totals__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
}

.order-totals__row--grand {
  font-weight: 700;
  font-size: 1.1rem;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.order-notes {
  margin-top: 24px;
  background: rgba(var(--v-theme-primary), 0.04);
  border-radius: 12px;
  padding: 16px;
}

@media (max-width: 1280px) {
  .order-summary__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .order-card__header--compact {
    flex-direction: column;
    align-items: stretch;
  }

  .order-summary__metrics {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}
</style>
