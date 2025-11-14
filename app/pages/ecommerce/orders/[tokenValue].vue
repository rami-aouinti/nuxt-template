<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { FetchError } from 'ofetch'

import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import {
  createDateFormatter,
  formatDateValue,
} from '~/utils/formatters'
import type {
  OrderItemJsonLdSyliusShopOrderAccountShow,
  OrderJsonLdSyliusShopOrderAccountShow,
  OrderPaymentJsonLd,
  OrderShipmentJsonLd,
} from '~/types/order'
import type { AddressJsonldSyliusShopOrderAccountShow } from '~/types/address'

definePageMeta({
  title: 'pages.ecommerceOrder.meta.title',
})

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

type UnknownRecord = Record<string, unknown>

type HydraCollection<T> = {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const EMPTY_COLLECTION: HydraCollection<never> = { 'hydra:member': [] }

const tokenValue = computed(() => {
  const raw = route.params.tokenValue
  if (Array.isArray(raw)) {
    return raw[0] ?? ''
  }
  if (typeof raw === 'string') {
    return raw
  }
  return ''
})

const extractFetchErrorStatus = (error: unknown): number | null => {
  if (!error || typeof error !== 'object') {
    return null
  }

  const fetchError = error as FetchError & {
    statusCode?: number
    response?: { status?: number }
  }

  if (typeof fetchError.status === 'number') {
    return fetchError.status
  }

  if (typeof fetchError.statusCode === 'number') {
    return fetchError.statusCode
  }

  const responseStatus = fetchError.response?.status
  return typeof responseStatus === 'number' ? responseStatus : null
}

const fetchOrder = () => {
  const token = tokenValue.value
  if (!token) {
    return Promise.reject(new Error('Order token missing'))
  }

  return $fetch<OrderJsonLdSyliusShopOrderAccountShow>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(token)}`,
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
} = await useAsyncData('ecommerce-order', fetchOrder, {
  watch: [() => tokenValue.value, () => locale.value],
})

const order = computed(() => orderResponse.value ?? null)

const fetchOrderItems = async () => {
  const token = tokenValue.value
  if (!token) {
    return EMPTY_COLLECTION as HydraCollection<OrderItemJsonLdSyliusShopOrderAccountShow>
  }

  return await $fetch<HydraCollection<OrderItemJsonLdSyliusShopOrderAccountShow>>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(token)}/items`,
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const {
  data: orderItemsResponse,
  pending: orderItemsPending,
  error: orderItemsError,
  refresh: refreshOrderItems,
} = await useAsyncData('ecommerce-order-items', fetchOrderItems, {
  watch: [() => tokenValue.value, () => locale.value],
})

type OrderAddress = AddressJsonldSyliusShopOrderAccountShow | null

const billingAddress = ref<OrderAddress>(null)
const shippingAddress = ref<OrderAddress>(null)
const addressesLoading = ref(false)
const addressesError = ref<Error | null>(null)

const ADDRESS_RESOURCE_PATTERN = /\/addresses\/([^/]+)$/i

const resolveAddressResource = async (
  value: unknown,
  localeCode: string,
): Promise<OrderAddress> => {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    const match = value.match(ADDRESS_RESOURCE_PATTERN)
    if (!match) {
      return null
    }

    try {
      return await $fetch<AddressJsonldSyliusShopOrderAccountShow>(
        `/api/ecommerce/v2/shop/addresses/${encodeURIComponent(match[1])}`,
        {
          headers: {
            'Accept-Language': localeCode,
          },
        },
      )
    } catch (error) {
      addressesError.value =
        error instanceof Error ? error : new Error(String(error))
      return null
    }
  }

  if (value && typeof value === 'object') {
    const record = value as UnknownRecord
    if (
      'street' in record ||
      'city' in record ||
      'firstName' in record ||
      'lastName' in record
    ) {
      return record as AddressJsonldSyliusShopOrderAccountShow
    }
  }

  return null
}

watch(
  [order, () => locale.value],
  async ([currentOrder, currentLocale], _prev, onCleanup) => {
    if (!currentOrder) {
      billingAddress.value = null
      shippingAddress.value = null
      addressesError.value = null
      addressesLoading.value = false
      return
    }

    const state = { cancelled: false }
    onCleanup(() => {
      state.cancelled = true
    })

    addressesLoading.value = true
    addressesError.value = null

    try {
      const [billing, shipping] = await Promise.all([
        resolveAddressResource(currentOrder.billingAddress, currentLocale),
        resolveAddressResource(currentOrder.shippingAddress, currentLocale),
      ])

      if (state.cancelled) {
        return
      }

      billingAddress.value = billing
      shippingAddress.value = shipping
    } finally {
      if (!state.cancelled) {
        addressesLoading.value = false
      }
    }
  },
  { immediate: true },
)

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object');

function extractCollectionItems<T>(input: unknown): T[] {
  if (!input) {
    return []
  }

  if (Array.isArray(input)) {
    return input.filter((item): item is T => Boolean(item))
  }

  if (isRecord(input)) {
    const hydraMember = input['hydra:member']
    if (Array.isArray(hydraMember)) {
      return hydraMember.filter((item): item is T => Boolean(item))
    }

    const member = input.member
    if (Array.isArray(member)) {
      return member.filter((item): item is T => Boolean(item))
    }

    const items = input.items
    if (Array.isArray(items)) {
      return items.filter((item): item is T => Boolean(item))
    }

    const data = input.data
    if (Array.isArray(data)) {
      return data.filter((item): item is T => Boolean(item))
    }
  }

  return []
}

const orderItems = computed(() =>
  extractCollectionItems<OrderItemJsonLdSyliusShopOrderAccountShow>(
    orderItemsResponse.value,
  ),
)

const payments = computed<OrderPaymentJsonLd[]>(() => {
  const fromOrder = order.value?.payment
  if (Array.isArray(fromOrder)) {
    return fromOrder.filter((payment): payment is OrderPaymentJsonLd =>
      Boolean(payment),
    )
  }

  const fromCollection = extractCollectionItems<OrderPaymentJsonLd>(
    order.value?.payments,
  )

  return fromCollection
})

const shipments = computed<OrderShipmentJsonLd[]>(() => {
  const fromOrder = order.value?.shipment
  if (Array.isArray(fromOrder)) {
    return fromOrder.filter((shipment): shipment is OrderShipmentJsonLd =>
      Boolean(shipment),
    )
  }

  const fromCollection = extractCollectionItems<OrderShipmentJsonLd>(
    order.value?.shipments,
  )

  return fromCollection
})

const orderLocale = computed(() => order.value?.localeCode ?? locale.value ?? 'en')

const dateFormatter = createDateFormatter(orderLocale, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const fallbackText = computed(() => t('pages.ecommerceOrder.fallbacks.unknown'))

const formatDate = (value: unknown) =>
  formatDateValue(value, dateFormatter.value, fallbackText.value)

const currencyFormatter = computed(() => {
  const currency = order.value?.currencyCode ?? 'USD'
  const localeCode = orderLocale.value

  try {
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch {
    return new Intl.NumberFormat(localeCode, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
})

const formatAmount = (value: unknown) => {
  if (value == null) {
    return fallbackText.value
  }

  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return String(value)
  }

  const normalized = numeric / 100

  try {
    return currencyFormatter.value.format(normalized)
  } catch {
    const currency = order.value?.currencyCode
    return currency ? `${currency} ${normalized.toFixed(2)}` : normalized.toFixed(2)
  }
}

const formatStateValue = (value: unknown) => {
  if (!value || typeof value !== 'string') {
    return fallbackText.value
  }

  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const resolveStateColor = (value: unknown): string => {
  if (!value || typeof value !== 'string') {
    return 'default'
  }

  const normalized = value.toLowerCase()

  if (/(paid|completed|fulfilled|shipped|delivered)/.test(normalized)) {
    return 'success'
  }

  if (/(cancelled|refunded|failed|void)/.test(normalized)) {
    return 'error'
  }

  if (/(processing|awaiting|pending|ready)/.test(normalized)) {
    return 'warning'
  }

  return 'primary'
}

const resolveMethodName = (value: unknown) => {
  if (!value) {
    return fallbackText.value
  }

  if (typeof value === 'string') {
    const segments = value.split('/')
    const last = segments.pop() ?? value
    return formatStateValue(last)
  }

  return String(value)
}

const countryDisplayNames = computed(() => {
  try {
    return new Intl.DisplayNames([orderLocale.value], { type: 'region' })
  } catch {
    return null
  }
})

const formatCountry = (code: unknown) => {
  if (!code || typeof code !== 'string') {
    return null
  }

  try {
    return countryDisplayNames.value?.of(code) ?? code
  } catch {
    return code
  }
}

const makeAddressLines = (address: OrderAddress) => {
  if (!address) {
    return [t('pages.ecommerceOrder.fallbacks.noAddress')]
  }

  const lines: string[] = []
  const name = [address.firstName, address.lastName]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
  if (name) {
    lines.push(name)
  }

  if (typeof address.company === 'string' && address.company.trim().length > 0) {
    lines.push(address.company)
  }

  if (typeof address.street === 'string' && address.street.trim().length > 0) {
    lines.push(address.street)
  }

  const localityParts = [address.postcode, address.city]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
  if (localityParts.length) {
    lines.push(localityParts.join(' '))
  }

  const countryName = formatCountry(address.countryCode)
  if (countryName) {
    lines.push(countryName)
  }

  if (
    typeof address.phoneNumber === 'string' &&
    address.phoneNumber.trim().length > 0
  ) {
    lines.push(address.phoneNumber)
  }

  return lines.length ? lines : [t('pages.ecommerceOrder.fallbacks.noAddress')]
}

const orderNumber = computed(() => order.value?.number ?? tokenValue.value)

const breadcrumbs = computed(() => [
  { title: t('pages.ecommerceOrder.breadcrumbs.account'), to: localePath('/profile') },
  { title: t('pages.ecommerceOrder.breadcrumbs.orders') },
  { title: orderNumber.value },
])

const headerSubtitle = computed(() => t('pages.ecommerceOrder.heading.subtitle'))

const headerTitle = computed(() =>
  t('pages.ecommerceOrder.heading.title', { number: orderNumber.value }),
)

const orderStateChip = computed(() => ({
  label: formatStateValue(order.value?.state),
  color: resolveStateColor(order.value?.state),
}))

const informationRows = computed(() => {
  if (!order.value) {
    return []
  }

  const rows: Array<{ label: string; value: string }> = []

  rows.push({
    label: t('pages.ecommerceOrder.labels.createdAt'),
    value: formatDate(order.value.createdAt),
  })

  if (order.value.checkoutCompletedAt) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.completedAt'),
      value: formatDate(order.value.checkoutCompletedAt),
    })
  }

  if (order.value.updatedAt) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.updatedAt'),
      value: formatDate(order.value.updatedAt),
    })
  }

  rows.push({
    label: t('pages.ecommerceOrder.labels.currency'),
    value: order.value.currencyCode ?? fallbackText.value,
  })

  rows.push({
    label: t('pages.ecommerceOrder.labels.locale'),
    value: order.value.localeCode ?? fallbackText.value,
  })

  rows.push({
    label: t('pages.ecommerceOrder.labels.checkoutState'),
    value: formatStateValue(order.value.checkoutState),
  })

  rows.push({
    label: t('pages.ecommerceOrder.labels.paymentState'),
    value: formatStateValue(order.value.paymentState),
  })

  rows.push({
    label: t('pages.ecommerceOrder.labels.shippingState'),
    value: formatStateValue(order.value.shippingState),
  })

  rows.push({
    label: t('pages.ecommerceOrder.labels.state'),
    value: formatStateValue(order.value.state),
  })

  if (order.value.channel) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.channel'),
      value: formatStateValue(order.value.channel),
    })
  }

  if (order.value.customerWithAuthorization?.email) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.email'),
      value: order.value.customerWithAuthorization.email,
    })
  } else if (order.value.user?.email) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.email'),
      value: order.value.user.email,
    })
  }

  if (order.value.customerWithAuthorization?.fullName) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.customer'),
      value: order.value.customerWithAuthorization.fullName,
    })
  }

  if (order.value.totalQuantity != null) {
    rows.push({
      label: t('pages.ecommerceOrder.labels.quantity'),
      value: String(order.value.totalQuantity),
    })
  }

  return rows
})

const summaryRows = computed(() => {
  if (!order.value) {
    return []
  }

  return [
    {
      key: 'itemsTotal',
      label: t('pages.ecommerceOrder.sections.summary.itemsTotal'),
      value: formatAmount(order.value.itemsTotal),
    },
    {
      key: 'taxTotal',
      label: t('pages.ecommerceOrder.sections.summary.taxTotal'),
      value: formatAmount(order.value.taxTotal),
    },
    {
      key: 'shippingTotal',
      label: t('pages.ecommerceOrder.sections.summary.shippingTotal'),
      value: formatAmount(order.value.shippingTotal),
    },
    {
      key: 'total',
      label: t('pages.ecommerceOrder.sections.summary.total'),
      value: formatAmount(order.value.total),
    },
  ]
})

const hasOrderError = computed(() => Boolean(orderError.value))

const isOrderNotFound = computed(() =>
  extractFetchErrorStatus(orderError.value) === 404,
)

const orderErrorMessage = computed(() => {
  if (isOrderNotFound.value) {
    return t('pages.ecommerceOrder.messages.notFound')
  }
  return t('pages.ecommerceOrder.messages.loadingError')
})

const itemsErrorMessage = computed(() => {
  if (!orderItemsError.value) {
    return ''
  }

  return t('pages.ecommerceOrder.messages.itemsError')
})

const addressesErrorMessage = computed(() => {
  if (!addressesError.value) {
    return ''
  }

  return t('pages.ecommerceOrder.messages.addressesError')
})

</script>

<template>
  <v-container fluid class="ecommerce-order-page">
    <div class="ecommerce-order-header">
      <div>
        <p class="ecommerce-order-subtitle mb-2">{{ headerSubtitle }}</p>
        <div class="d-flex flex-column flex-sm-row flex-wrap align-sm-center gap-3">
          <h1 class="ecommerce-order-title mb-0">{{ headerTitle }}</h1>
          <v-chip
            v-if="order"
            :color="orderStateChip.color"
            variant="tonal"
            class="font-weight-semibold"
          >
            {{ orderStateChip.label }}
          </v-chip>
        </div>
        <v-breadcrumbs
          :items="breadcrumbs"
          class="px-0 mt-4 ecommerce-order-breadcrumbs"
          density="comfortable"
        />
      </div>
      <AppButton color="primary" variant="flat" class="ecommerce-order-pay">
        {{ t('pages.ecommerceOrder.actions.pay') }}
      </AppButton>
    </div>

    <div v-if="orderPending" class="d-flex justify-center py-12">
      <v-progress-circular color="primary" size="48" indeterminate />
    </div>

    <v-alert
      v-else-if="hasOrderError"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-3">
        <span>{{ orderErrorMessage }}</span>
        <AppButton color="primary" variant="flat" @click="refreshOrder">
          {{ t('pages.ecommerceOrder.actions.retry') }}
        </AppButton>
      </div>
    </v-alert>

    <div v-else-if="order" class="ecommerce-order-content">
      <v-row class="g-6" align="stretch">
        <v-col cols="12" md="8" class="d-flex flex-column gap-6">
          <AppCard class="ecommerce-order-card" variant="flat" elevation="0">
            <template #title>
              <div class="d-flex flex-column flex-sm-row flex-wrap align-sm-center justify-space-between gap-3">
                <h2 class="text-h5 mb-0">
                  {{ t('pages.ecommerceOrder.sections.information.title') }}
                </h2>
                <span class="text-medium-emphasis text-body-2">
                  {{ t('pages.ecommerceOrder.labels.token', { token: tokenValue }) }}
                </span>
              </div>
            </template>
            <div class="ecommerce-order-grid">
              <div
                v-for="row in informationRows"
                :key="row.label"
                class="ecommerce-order-grid__item"
              >
                <p class="text-caption text-uppercase text-medium-emphasis mb-1">
                  {{ row.label }}
                </p>
                <p class="text-body-1 font-weight-medium mb-0">{{ row.value }}</p>
              </div>
            </div>
          </AppCard>

          <AppCard class="ecommerce-order-card" variant="flat" elevation="0">
            <template #title>
              <div class="d-flex flex-column flex-sm-row flex-wrap align-sm-center justify-space-between gap-3">
                <h2 class="text-h5 mb-0">
                  {{ t('pages.ecommerceOrder.sections.addresses.title') }}
                </h2>
                <span v-if="addressesLoading" class="text-body-2 text-medium-emphasis">
                  {{ t('pages.ecommerceOrder.sections.addresses.loading') }}
                </span>
              </div>
            </template>

            <v-alert
              v-if="addressesErrorMessage"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              {{ addressesErrorMessage }}
            </v-alert>

            <div class="ecommerce-order-addresses">
              <div class="ecommerce-order-addresses__column">
                <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                  {{ t('pages.ecommerceOrder.sections.addresses.billing') }}
                </h3>
                <p
                  v-for="line in makeAddressLines(billingAddress)"
                  :key="`billing-${line}`"
                  class="text-body-2 mb-1"
                >
                  {{ line }}
                </p>
              </div>
              <div class="ecommerce-order-addresses__column">
                <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                  {{ t('pages.ecommerceOrder.sections.addresses.shipping') }}
                </h3>
                <p
                  v-for="line in makeAddressLines(shippingAddress)"
                  :key="`shipping-${line}`"
                  class="text-body-2 mb-1"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </AppCard>

          <AppCard class="ecommerce-order-card" variant="flat" elevation="0">
            <template #title>
              <div class="d-flex flex-column flex-sm-row flex-wrap align-sm-center justify-space-between gap-3">
                <h2 class="text-h5 mb-0">
                  {{ t('pages.ecommerceOrder.sections.items.title') }}
                </h2>
                <AppButton
                  color="primary"
                  variant="text"
                  size="small"
                  @click="refreshOrderItems"
                >
                  {{ t('pages.ecommerceOrder.actions.refresh') }}
                </AppButton>
              </div>
            </template>

            <v-alert
              v-if="itemsErrorMessage"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              {{ itemsErrorMessage }}
            </v-alert>

            <div v-if="orderItemsPending" class="d-flex justify-center py-8">
              <v-progress-circular color="primary" indeterminate />
            </div>
            <div v-else-if="orderItems.length" class="ecommerce-order-items">
              <div class="ecommerce-order-items__header">
                <span>{{ t('pages.ecommerceOrder.sections.items.table.product') }}</span>
                <span>{{ t('pages.ecommerceOrder.sections.items.table.unitPrice') }}</span>
                <span>{{ t('pages.ecommerceOrder.sections.items.table.quantity') }}</span>
                <span>{{ t('pages.ecommerceOrder.sections.items.table.total') }}</span>
              </div>
              <div
                v-for="item in orderItems"
                :key="item['@id'] ?? `${item.variant}-${item.id}`"
                class="ecommerce-order-items__row"
              >
                <div>
                  <p class="text-body-1 font-weight-medium mb-1">
                    {{ item.productName ?? formatStateValue(item.variant) }}
                  </p>
                  <p
                    v-if="item.variant && item.variant !== item.productName"
                    class="text-caption text-medium-emphasis mb-0"
                  >
                    {{ item.variant }}
                  </p>
                </div>
                <span>{{ formatAmount(item.unitPrice) }}</span>
                <span>{{ item.quantity }}</span>
                <span>{{ formatAmount(item.total ?? item.subtotal ?? item.unitPrice) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-body-1 text-medium-emphasis mb-0">
                {{ t('pages.ecommerceOrder.sections.items.empty') }}
              </p>
            </div>
          </AppCard>
        </v-col>

        <v-col cols="12" md="4" class="d-flex flex-column gap-6">
          <AppCard class="ecommerce-order-card" variant="flat" elevation="0">
            <template #title>
              <h2 class="text-h5 mb-0">
                {{ t('pages.ecommerceOrder.sections.payments.title') }}
              </h2>
            </template>

            <div v-if="payments.length" class="ecommerce-order-list">
              <div
                v-for="payment in payments"
                :key="payment.id ?? payment.method ?? payment['@id']"
                class="ecommerce-order-list__item"
              >
                <div>
                  <p class="text-body-1 font-weight-medium mb-1">
                    {{ resolveMethodName(payment.method) }}
                  </p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ formatStateValue(payment.state) }}
                  </p>
                </div>
                <span class="text-body-1 font-weight-semibold">
                  {{ formatAmount(payment.amount) }}
                </span>
              </div>
            </div>
            <div v-else class="text-medium-emphasis text-body-2">
              {{ t('pages.ecommerceOrder.sections.payments.empty') }}
            </div>
          </AppCard>

          <AppCard class="ecommerce-order-card" variant="flat" elevation="0">
            <template #title>
              <h2 class="text-h5 mb-0">
                {{ t('pages.ecommerceOrder.sections.shipments.title') }}
              </h2>
            </template>

            <div v-if="shipments.length" class="ecommerce-order-list">
              <div
                v-for="shipment in shipments"
                :key="shipment.id ?? shipment.method ?? shipment['@id']"
                class="ecommerce-order-list__item"
              >
                <div>
                  <p class="text-body-1 font-weight-medium mb-1">
                    {{ resolveMethodName(shipment.method) }}
                  </p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ formatStateValue(shipment.state) }}
                  </p>
                </div>
                <div class="text-right">
                  <p v-if="shipment.tracking" class="text-caption text-medium-emphasis mb-1">
                    {{ shipment.tracking }}
                  </p>
                  <p class="text-body-1 font-weight-semibold mb-0">
                    {{ formatAmount(shipment.total ?? shipment.adjustmentsTotal) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-medium-emphasis text-body-2">
              {{ t('pages.ecommerceOrder.sections.shipments.empty') }}
            </div>
          </AppCard>

          <AppCard class="ecommerce-order-card" variant="flat" elevation="0">
            <template #title>
              <h2 class="text-h5 mb-0">
                {{ t('pages.ecommerceOrder.sections.summary.title') }}
              </h2>
            </template>

            <div class="ecommerce-order-summary">
              <div
                v-for="row in summaryRows"
                :key="row.key"
                class="ecommerce-order-summary__row"
              >
                <span class="text-body-2 text-medium-emphasis">
                  {{ row.label }}
                </span>
                <span class="text-body-1 font-weight-semibold">{{ row.value }}</span>
              </div>
            </div>
          </AppCard>
        </v-col>
      </v-row>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-body-1 text-medium-emphasis mb-0">
        {{ isOrderNotFound
          ? t('pages.ecommerceOrder.messages.notFound')
          : t('pages.ecommerceOrder.messages.loadingError')
        }}
      </p>
    </div>
  </v-container>
</template>

<style scoped>
.ecommerce-order-page {
  min-height: 100%;
  padding-block: clamp(32px, 6vw, 64px);
  background: linear-gradient(
      180deg,
      rgba(var(--v-theme-primary), 0.08),
      rgba(var(--v-theme-surface), 0)
    ),
    rgba(var(--v-theme-surface), 1);
}

.ecommerce-order-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: clamp(24px, 4vw, 40px);
}

@media (min-width: 960px) {
  .ecommerce-order-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.ecommerce-order-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.ecommerce-order-subtitle {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(var(--v-theme-primary), 0.8);
  letter-spacing: 0.08em;
}

.ecommerce-order-breadcrumbs :deep(.v-breadcrumbs-item--link) {
  font-weight: 600;
}

.ecommerce-order-pay {
  align-self: flex-start;
}

.ecommerce-order-content {
  margin-top: clamp(16px, 3vw, 32px);
}

.ecommerce-order-card {
  border-radius: 18px;
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
  background: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(12px);
}

.ecommerce-order-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  padding-inline: clamp(12px, 3vw, 24px);
  padding-bottom: clamp(12px, 3vw, 24px);
}

.ecommerce-order-grid__item {
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(var(--v-theme-primary), 0.04);
}

.ecommerce-order-addresses {
  display: grid;
  gap: clamp(16px, 3vw, 32px);
  padding-inline: clamp(12px, 3vw, 24px);
  padding-bottom: clamp(12px, 3vw, 24px);
}

@media (min-width: 900px) {
  .ecommerce-order-addresses {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.ecommerce-order-addresses__column {
  padding: 16px;
  border-radius: 14px;
  background: rgba(var(--v-theme-primary), 0.04);
}

.ecommerce-order-items {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
}

.ecommerce-order-items__header,
.ecommerce-order-items__row {
  display: grid;
  grid-template-columns: minmax(160px, 2fr) repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 16px 20px;
}

.ecommerce-order-items__header {
  background: rgba(var(--v-theme-primary), 0.06);
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.ecommerce-order-items__row:nth-child(even) {
  background: rgba(var(--v-theme-primary), 0.02);
}

.ecommerce-order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
}

.ecommerce-order-list__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(var(--v-theme-primary), 0.04);
}

.ecommerce-order-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 24px;
}

.ecommerce-order-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 960px) {
  .ecommerce-order-items__header,
  .ecommerce-order-items__row {
    grid-template-columns: minmax(160px, 1.5fr) repeat(3, minmax(0, 0.75fr));
  }
}

@media (max-width: 600px) {
  .ecommerce-order-items__header,
  .ecommerce-order-items__row {
    grid-template-columns: minmax(140px, 2fr) minmax(0, 1fr);
  }

  .ecommerce-order-items__header span:nth-child(3),
  .ecommerce-order-items__header span:nth-child(4),
  .ecommerce-order-items__row span:nth-child(3),
  .ecommerce-order-items__row span:nth-child(4) {
    display: none;
  }
}
</style>
