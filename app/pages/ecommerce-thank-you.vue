<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEcommerceCartStore } from '~/stores/ecommerceCart'
import type { OrderJsonLd } from '~/types/order'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'

definePageMeta({
  title: 'navigation.ecommerceThankYou',
  path: '/ecommerce/thank-you',
})

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const cartStore = useEcommerceCartStore()

const summaryRef = ref<HTMLElement | null>(null)

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value))

const toRecord = (value: unknown): UnknownRecord | null =>
  (isRecord(value) ? (value as UnknownRecord) : null)

const getFirstQueryParam = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    const [first] = value
    return typeof first === 'string' ? first : null
  }

  return typeof value === 'string' ? value : null
}

const getString = (
  value: UnknownRecord | null | undefined,
  key: string,
): string | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate
  }

  return null
}

const getNumber = (
  value: UnknownRecord | null | undefined,
  key: string,
): number | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'number' && Number.isFinite(candidate)) {
    return candidate
  }

  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    const parsed = Number.parseFloat(candidate)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
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

const tokenValue = computed(() => {
  const params = route.params as Record<string, string | string[] | undefined>
  const paramToken = getFirstQueryParam(params?.tokenValue)
  const queryToken =
    getFirstQueryParam(route.query.orderToken) ??
    getFirstQueryParam(route.query.token)

  return (paramToken ?? queryToken ?? '').trim()
})

const hasToken = computed(() => tokenValue.value.length > 0)

const fetchOrder = async () => {
  if (!hasToken.value) {
    return null
  }

  return await $fetch<OrderJsonLd>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}`,
    {
      headers: {
        'Accept-Language': locale.value,
      },
    },
  )
}

const {
  data: orderResponse,
  pending,
  error,
  refresh: refreshOrder,
} = await useAsyncData<OrderJsonLd | null>(
  'ecommerce-thank-you-order',
  fetchOrder,
  {
    immediate: hasToken.value,
    watch: [tokenValue, () => locale.value],
  },
)

watch(
  hasToken,
  (available) => {
    if (!available) {
      orderResponse.value = null
    }
  },
  { immediate: true },
)

const order = computed(() => orderResponse.value)
const orderRecord = computed(() => toRecord(order.value as unknown))

watch(
  () => order.value?.tokenValue,
  (token) => {
    if (token && cartStore.token === token) {
      cartStore.clear()
    }
  },
  { immediate: true },
)

const dateFormatter = createDateFormatter(locale, {
  dateStyle: 'long',
  timeStyle: 'short',
})

const checkoutDate = computed(() => {
  const current = order.value as UnknownRecord | null
  if (!current) {
    return null
  }

  const checkoutCompleted = getString(current, 'checkoutCompletedAt')
  if (checkoutCompleted) {
    return checkoutCompleted
  }

  const placedAt = getString(current, 'createdAt')
  if (placedAt) {
    return placedAt
  }

  const updatedAt = getString(current, 'updatedAt')
  if (updatedAt) {
    return updatedAt
  }

  return null
})

const formattedCheckoutDate = computed(() => {
  if (!checkoutDate.value) {
    return null
  }

  return formatDateValue(
    checkoutDate.value,
    dateFormatter.value,
    checkoutDate.value,
  )
})

const currencyCode = computed(() => getString(orderRecord.value, 'currencyCode') ?? 'USD')

const amountFormatter = computed(() => {
  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currencyCode.value,
      currencyDisplay: 'narrowSymbol',
    })
  } catch {
    return new Intl.NumberFormat(locale.value)
  }
})

const formatAmount = (value: number | null | undefined) => {
  if (value == null) {
    return null
  }

  const normalized = value / 100
  try {
    return amountFormatter.value.format(normalized)
  } catch {
    return `${currencyCode.value} ${normalized.toFixed(2)}`
  }
}

const fallbackItemName = computed(() => t('pages.ecommerceThankYou.itemFallback'))

const orderItemsRecords = computed<UnknownRecord[]>(() => {
  const current = orderRecord.value
  if (!current) {
    return []
  }

  const items = extractCollectionItems<unknown>(current.items)
  return items
    .map((entry) => toRecord(entry))
    .filter((entry): entry is UnknownRecord => Boolean(entry))
})

type NormalizedOrderItem = {
  key: string
  name: string
  variant: string | null
  quantity: number | null
  total: number | null
  totalLabel: string | null
  unitLabel: string | null
}

const normalizedOrderItems = computed<NormalizedOrderItem[]>(() =>
  orderItemsRecords.value.map((item, index) => {
    const id = getNumber(item, 'id')
    const name =
      getString(item, 'productName') ??
      getString(item, 'name') ??
      fallbackItemName.value

    const variant =
      getString(item, 'variantName') ??
      getString(item, 'variant') ??
      getString(toRecord(item['variant']), 'name')

    const quantity =
      getNumber(item, 'quantity') ??
      getNumber(item, 'count')

    const total = normalizeAmount(item['total'])
    const unitPrice =
      normalizeAmount(item['unitPrice']) ??
      normalizeAmount(item['discountedUnitPrice'])

    return {
      key: id != null ? String(id) : `${name}-${variant ?? ''}-${index}`,
      name,
      variant,
      quantity: quantity ?? null,
      total,
      totalLabel: formatAmount(total),
      unitLabel: formatAmount(unitPrice),
    }
  }),
)

const orderItemsCount = computed(() => {
  const current = orderRecord.value
  const totalQuantity = getNumber(current, 'totalQuantity')
  if (totalQuantity != null) {
    return Math.max(0, Math.round(totalQuantity))
  }

  const aggregated = normalizedOrderItems.value.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  )

  return aggregated > 0 ? aggregated : null
})

const itemsCountLabel = computed(() => {
  if (orderItemsCount.value == null) {
    return null
  }

  return t('pages.ecommerceThankYou.itemCount', {
    count: orderItemsCount.value,
  })
})

const subtotalLabel = computed(() =>
  formatAmount(
    getNumber(orderRecord.value, 'itemsSubtotal') ??
      getNumber(orderRecord.value, 'itemsTotal'),
  ),
)

const shippingLabel = computed(() =>
  formatAmount(getNumber(orderRecord.value, 'shippingTotal')),
)

const taxLabel = computed(() =>
  formatAmount(getNumber(orderRecord.value, 'taxTotal')),
)

const totalLabel = computed(() =>
  formatAmount(
    getNumber(orderRecord.value, 'total') ??
      getNumber(orderRecord.value, 'taxIncludedTotal') ??
      getNumber(orderRecord.value, 'promotionSubjectTotal'),
  ),
)

const orderState = computed(() => {
  const value = getString(orderRecord.value, 'state')
  if (!value) {
    return null
  }

  return value
    .split(/[\s_-]+/u)
    .map((segment) =>
      segment.length > 0
        ? segment[0]?.toUpperCase() + segment.slice(1).toLowerCase()
        : segment,
    )
    .join(' ')
})

const paymentState = computed(() => {
  const value = getString(orderRecord.value, 'paymentState')
  if (!value) {
    return null
  }

  return value
    .split(/[\s_-]+/u)
    .map((segment) =>
      segment.length > 0
        ? segment[0]?.toUpperCase() + segment.slice(1).toLowerCase()
        : segment,
    )
    .join(' ')
})

const shippingState = computed(() => {
  const value = getString(orderRecord.value, 'shippingState')
  if (!value) {
    return null
  }

  return value
    .split(/[\s_-]+/u)
    .map((segment) =>
      segment.length > 0
        ? segment[0]?.toUpperCase() + segment.slice(1).toLowerCase()
        : segment,
    )
    .join(' ')
})

const extractAddressLines = (value: unknown): string[] => {
  if (!value) {
    return []
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  const record = toRecord(value)
  if (!record) {
    return []
  }

  const lines: string[] = []
  const fullName = [
    getString(record, 'firstName'),
    getString(record, 'lastName'),
  ]
    .filter(Boolean)
    .join(' ')
    .trim()

  if (fullName.length > 0) {
    lines.push(fullName)
  }

  const company = getString(record, 'company')
  if (company) {
    lines.push(company)
  }

  const street =
    getString(record, 'street') ??
    getString(record, 'street1') ??
    getString(record, 'streetAddress') ??
    getString(record, 'address1')
  if (street) {
    lines.push(street)
  }

  const street2 =
    getString(record, 'street2') ??
    getString(record, 'address2') ??
    getString(record, 'apartment')
  if (street2) {
    lines.push(street2)
  }

  const postcode = getString(record, 'postcode')
  const city = getString(record, 'city')
  const province =
    getString(record, 'provinceName') ?? getString(record, 'provinceCode')

  const localityParts = [postcode, city, province].filter(Boolean)
  if (localityParts.length > 0) {
    lines.push(localityParts.join(' '))
  }

  const country =
    getString(record, 'countryName') ?? getString(record, 'countryCode')
  if (country) {
    lines.push(country)
  }

  const phone = getString(record, 'phoneNumber')
  if (phone) {
    lines.push(phone)
  }

  return lines
}

const shippingAddressSource = computed(() => {
  const current = orderRecord.value
  if (!current) {
    return null
  }

  if (current.shippingAddress) {
    return current.shippingAddress
  }

  const shipments = current.shipment
  if (Array.isArray(shipments)) {
    for (const entry of shipments) {
      const shipmentRecord = toRecord(entry)
      if (!shipmentRecord) {
        continue
      }

      if (shipmentRecord.shippingAddress) {
        return shipmentRecord.shippingAddress
      }
    }
  }

  return null
})

const billingAddressSource = computed(() => orderRecord.value?.billingAddress ?? null)

const shippingAddressLines = computed(() =>
  extractAddressLines(shippingAddressSource.value),
)

const billingAddressLines = computed(() =>
  extractAddressLines(billingAddressSource.value),
)

const shippingMethod = computed(() => {
  const current = orderRecord.value
  if (!current) {
    return null
  }

  const shipments = current.shipment
  if (Array.isArray(shipments)) {
    for (const entry of shipments) {
      const shipmentRecord = toRecord(entry)
      if (!shipmentRecord) {
        continue
      }

      const method = shipmentRecord.method
      if (typeof method === 'string' && method.trim().length > 0) {
        return method
      }

      const methodRecord = toRecord(method)
      const name =
        getString(methodRecord, 'name') ?? getString(methodRecord, 'code')
      if (name) {
        return name
      }
    }
  }

  return null
})

const contactEmail = computed(() => {
  const current = orderRecord.value
  if (!current) {
    return null
  }

  const direct = getString(current, 'email')
  if (direct) {
    return direct
  }

  const customer =
    toRecord(current.customerWithAuthorization) ?? toRecord(current.customer)

  if (customer) {
    return (
      getString(customer, 'email') ??
      getString(customer, 'emailCanonical') ??
      getString(customer, 'username')
    )
  }

  return null
})

const contactPhone = computed(() => {
  const current = orderRecord.value
  if (!current) {
    return null
  }

  const customer =
    toRecord(current.customerWithAuthorization) ?? toRecord(current.customer)

  if (customer) {
    return getString(customer, 'phoneNumber')
  }

  return null
})

const hasContactDetails = computed(
  () => Boolean(contactEmail.value || contactPhone.value),
)

const hasShippingAddress = computed(
  () => shippingAddressLines.value.length > 0,
)

const hasBillingAddress = computed(
  () => billingAddressLines.value.length > 0,
)

const orderNumberLabel = computed(() => {
  const number = getString(orderRecord.value, 'number')
  if (number) {
    return t('pages.ecommerceThankYou.orderNumber', { number })
  }

  if (hasToken.value) {
    return t('pages.ecommerceThankYou.orderTokenLabel', {
      token: tokenValue.value,
    })
  }

  return null
})

const orderErrorMessage = computed(() => {
  const err = error.value
  if (!err) {
    return null
  }

  if (typeof err === 'string') {
    return err
  }

  const statusMessage = (err as Partial<{ statusMessage: string }>).statusMessage
  if (typeof statusMessage === 'string') {
    return statusMessage
  }

  return err.message ?? null
})

const scrollToSummary = () => {
  const target = summaryRef.value
  if (!target) {
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <v-container class="thank-you-container py-12 py-md-16" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <AppCard
          class="thank-you-hero pa-8 pa-md-12 text-center"
          :shadow="false"
          variant="flat"
        >
          <div class="thank-you-hero__icon mb-6">
            <v-icon
              icon="mdi-check-circle-outline"
              size="64"
              color="primary"
            />
          </div>
          <h1 class="thank-you-hero__title mb-3">
            {{ t('pages.ecommerceThankYou.heroTitle') }}
          </h1>
          <p class="thank-you-hero__subtitle text-medium-emphasis mb-6">
            {{ t('pages.ecommerceThankYou.heroSubtitle') }}
          </p>
          <p
            v-if="hasToken"
            class="thank-you-hero__token text-caption text-medium-emphasis mb-8"
          >
            {{
              t('pages.ecommerceThankYou.orderTokenLabel', {
                token: tokenValue,
              })
            }}
          </p>
          <div
            class="thank-you-hero__actions d-flex flex-column flex-sm-row justify-center align-center ga-4"
          >
            <AppButton
              color="primary"
              size="large"
              :disabled="!order"
              @click="scrollToSummary"
            >
              {{ t('pages.ecommerceThankYou.viewOrder') }}
            </AppButton>
            <AppButton
              color="primary"
              variant="text"
              size="large"
              :to="localePath('/ecommerce')"
            >
              {{ t('pages.ecommerceThankYou.backToShop') }}
            </AppButton>
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-10">
      <v-col cols="12" md="10" lg="8">
        <div ref="summaryRef">
          <AppCard
            class="thank-you-summary pa-6 pa-md-8"
            :shadow="false"
            variant="flat"
            :loading="pending"
          >
            <template #title>
              <div
                class="d-flex flex-column flex-sm-row justify-space-between align-start ga-4"
              >
                <div>
                  <h2 class="text-h5 mb-1">
                    {{ t('pages.ecommerceThankYou.orderSummary') }}
                  </h2>
                  <p
                    v-if="orderNumberLabel"
                    class="text-body-2 text-medium-emphasis mb-0"
                  >
                    {{ orderNumberLabel }}
                  </p>
                  <p
                    v-if="formattedCheckoutDate"
                    class="text-body-2 text-medium-emphasis mb-0"
                  >
                    {{
                      t('pages.ecommerceThankYou.placedOn', {
                        date: formattedCheckoutDate,
                      })
                    }}
                  </p>
                </div>
                <div class="thank-you-summary__status d-flex flex-wrap ga-2">
                  <v-chip v-if="orderState" color="primary" size="small" variant="flat">
                    {{ orderState }}
                  </v-chip>
                  <v-chip v-if="paymentState" color="success" size="small" variant="tonal">
                    {{ paymentState }}
                  </v-chip>
                  <v-chip v-if="shippingState" color="info" size="small" variant="tonal">
                    {{ shippingState }}
                  </v-chip>
                </div>
              </div>
            </template>

            <div v-if="pending" class="d-flex justify-center py-8">
              <v-progress-circular indeterminate color="primary" size="36" />
            </div>

            <div v-else>
              <v-alert
                v-if="!hasToken"
                type="info"
                variant="tonal"
                class="mb-6"
              >
                {{ t('pages.ecommerceThankYou.missingToken') }}
              </v-alert>

              <template v-else>
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-6"
                >
                  <div class="font-weight-medium mb-1">
                    {{ t('pages.ecommerceThankYou.loadError') }}
                  </div>
                  <div v-if="orderErrorMessage" class="text-body-2 mb-3">
                    {{ orderErrorMessage }}
                  </div>
                  <AppButton
                    color="primary"
                    variant="tonal"
                    size="small"
                    @click="refreshOrder"
                  >
                    {{ t('pages.ecommerceThankYou.retry') }}
                  </AppButton>
                </v-alert>

                <div v-else-if="order" class="thank-you-summary__content">
                  <section class="thank-you-summary__items mb-8">
                    <div class="d-flex justify-space-between align-center mb-4">
                      <h3 class="text-subtitle-1 font-weight-semibold mb-0">
                        {{ t('pages.ecommerceThankYou.items') }}
                      </h3>
                      <span
                        v-if="itemsCountLabel"
                        class="text-body-2 text-medium-emphasis"
                      >
                        {{ itemsCountLabel }}
                      </span>
                    </div>

                    <div
                      v-if="normalizedOrderItems.length === 0"
                      class="thank-you-summary__empty text-medium-emphasis"
                    >
                      {{ t('pages.ecommerceThankYou.emptyItems') }}
                    </div>
                    <div v-else class="thank-you-summary__item-list">
                      <div
                        v-for="item in normalizedOrderItems"
                        :key="item.key"
                        class="thank-you-summary__item"
                      >
                        <div class="thank-you-summary__item-details">
                          <p class="thank-you-summary__item-name mb-1">
                            {{ item.name }}
                          </p>
                          <p
                            v-if="item.variant"
                            class="thank-you-summary__item-variant text-caption text-medium-emphasis mb-0"
                          >
                            {{ item.variant }}
                          </p>
                          <p
                            v-if="item.unitLabel"
                            class="thank-you-summary__item-unit text-caption text-medium-emphasis mb-0"
                          >
                            {{ t('pages.ecommerceThankYou.unitPrice', {
                              price: item.unitLabel,
                            }) }}
                          </p>
                        </div>
                        <div class="thank-you-summary__item-meta text-end">
                          <p class="thank-you-summary__item-quantity mb-1">
                            <strong v-if="item.quantity != null">
                              × {{ item.quantity }}
                            </strong>
                          </p>
                          <p class="thank-you-summary__item-total text-body-2 mb-0">
                            {{ item.totalLabel ?? '—' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section class="thank-you-summary__totals mb-8">
                    <h3 class="text-subtitle-1 font-weight-semibold mb-3">
                      {{ t('pages.ecommerceThankYou.totals') }}
                    </h3>
                    <div class="thank-you-summary__totals-grid">
                      <div v-if="subtotalLabel" class="thank-you-summary__totals-row">
                        <span>{{ t('pages.ecommerceThankYou.subtotal') }}</span>
                        <span>{{ subtotalLabel }}</span>
                      </div>
                      <div v-if="shippingLabel" class="thank-you-summary__totals-row">
                        <span>{{ t('pages.ecommerceThankYou.shipping') }}</span>
                        <span>{{ shippingLabel }}</span>
                      </div>
                      <div v-if="shippingMethod" class="thank-you-summary__totals-row text-medium-emphasis">
                        <span>{{ t('pages.ecommerceThankYou.shippingMethod') }}</span>
                        <span>{{ shippingMethod }}</span>
                      </div>
                      <div v-if="taxLabel" class="thank-you-summary__totals-row">
                        <span>{{ t('pages.ecommerceThankYou.tax') }}</span>
                        <span>{{ taxLabel }}</span>
                      </div>
                      <div class="thank-you-summary__totals-row thank-you-summary__totals-row--total">
                        <span>{{ t('pages.ecommerceThankYou.total') }}</span>
                        <span>{{ totalLabel ?? '—' }}</span>
                      </div>
                    </div>
                  </section>

                  <section class="thank-you-summary__details">
                    <div v-if="hasContactDetails" class="thank-you-summary__detail-card">
                      <h3 class="text-subtitle-1 font-weight-semibold mb-3">
                        {{ t('pages.ecommerceThankYou.contact') }}
                      </h3>
                      <p v-if="contactEmail" class="mb-2">
                        <span class="text-medium-emphasis">
                          {{ t('pages.ecommerceThankYou.email') }}
                        </span>
                        <br />
                        <span>{{ contactEmail }}</span>
                      </p>
                      <p v-if="contactPhone" class="mb-0">
                        <span class="text-medium-emphasis">
                          {{ t('pages.ecommerceThankYou.phone') }}
                        </span>
                        <br />
                        <span>{{ contactPhone }}</span>
                      </p>
                    </div>

                    <div class="thank-you-summary__detail-card">
                      <h3 class="text-subtitle-1 font-weight-semibold mb-3">
                        {{ t('pages.ecommerceThankYou.shippingAddress') }}
                      </h3>
                      <div v-if="hasShippingAddress">
                        <p
                          v-for="(line, index) in shippingAddressLines"
                          :key="`shipping-${index}`"
                          class="mb-1"
                        >
                          {{ line }}
                        </p>
                      </div>
                      <p v-else class="text-medium-emphasis mb-0">
                        {{ t('pages.ecommerceThankYou.noAddress') }}
                      </p>
                    </div>

                    <div class="thank-you-summary__detail-card">
                      <h3 class="text-subtitle-1 font-weight-semibold mb-3">
                        {{ t('pages.ecommerceThankYou.billingAddress') }}
                      </h3>
                      <div v-if="hasBillingAddress">
                        <p
                          v-for="(line, index) in billingAddressLines"
                          :key="`billing-${index}`"
                          class="mb-1"
                        >
                          {{ line }}
                        </p>
                      </div>
                      <p v-else class="text-medium-emphasis mb-0">
                        {{ t('pages.ecommerceThankYou.noAddress') }}
                      </p>
                    </div>
                  </section>
                </div>

                <v-alert v-else type="info" variant="tonal">
                  {{ t('pages.ecommerceThankYou.noOrder') }}
                </v-alert>
              </template>
            </div>
          </AppCard>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.thank-you-container {
  background: linear-gradient(
    180deg,
    rgba(var(--v-theme-primary), 0.08) 0%,
    rgba(var(--v-theme-surface), 0) 100%
  );
}

.thank-you-hero {
  background: linear-gradient(
    145deg,
    rgba(var(--v-theme-primary), 0.16),
    rgba(var(--v-theme-primary), 0.05)
  );
  color: rgba(var(--v-theme-on-surface), 0.94);
}

.thank-you-hero__icon {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(var(--v-theme-primary), 0.12);
}

.thank-you-hero__title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
}

.thank-you-hero__subtitle {
  font-size: 1.05rem;
  max-width: 460px;
  margin: 0 auto;
}

.thank-you-hero__token {
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.thank-you-summary__status .v-chip {
  font-weight: 600;
}

.thank-you-summary__item-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.thank-you-summary__item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.22);
}

.thank-you-summary__item-name {
  font-weight: 600;
  font-size: 1.05rem;
}

.thank-you-summary__item-meta {
  min-width: 96px;
}

.thank-you-summary__item-total {
  font-weight: 600;
}

.thank-you-summary__totals-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.18);
}

.thank-you-summary__totals-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.98rem;
}

.thank-you-summary__totals-row--total {
  font-weight: 700;
  font-size: 1.1rem;
}

.thank-you-summary__details {
  display: grid;
  gap: 24px;
}

.thank-you-summary__detail-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.14);
}

.thank-you-summary__empty {
  padding: 24px;
  border-radius: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.14);
}

@media (min-width: 960px) {
  .thank-you-summary__content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 32px;
  }

  .thank-you-summary__totals {
    margin-bottom: 0;
  }

  .thank-you-summary__details {
    grid-column: span 2;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
