<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { Notify } from '~/stores/notification'
import type { HydraCollectionBaseSchema } from '~/types/hydra'
import type {
  OrderItemJsonLd,
  OrderJsonLdSyliusShopCartShow,
  OrderShipmentJsonLd,
} from '~/types/order'
import type { ShippingMethodJsonldSyliusShopShippingMethodIndex } from '~/types/shippingMethod'

definePageMeta({
  title: 'pages.ecommerceShipping.metaTitle',
})

const { t, locale } = useI18n()
const route = useRoute()

interface ShippingEntry {
  id: string | null
  shipment: OrderShipmentJsonLd | UnknownRecord | null
  methods: ShippingMethodJsonldSyliusShopShippingMethodIndex[]
}

type UnknownRecord = Record<string, unknown>

type HydraCollection<T> = HydraCollectionBaseSchema & {
  'hydra:member'?: T[]
  member?: T[]
  items?: T[]
  data?: T[]
}

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object')

const toRecord = (value: unknown): UnknownRecord | null =>
  (isRecord(value) ? (value as UnknownRecord) : null)

const getString = (value: UnknownRecord | null, key: string): string | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate
  }

  return null
}

const getNumber = (value: UnknownRecord | null, key: string): number | null => {
  if (!value) {
    return null
  }

  const candidate = value[key]
  if (typeof candidate === 'number' && Number.isFinite(candidate)) {
    return candidate
  }

  if (typeof candidate === 'string') {
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

const extractCodeFromReference = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    const segments = value.split('/')
    return segments.at(-1) ?? value
  }

  const record = toRecord(value)
  if (record) {
    const code = getString(record, 'code')
    if (code) {
      return code
    }
  }

  return null
}

const extractShipmentId = (value: UnknownRecord | null): string | null => {
  if (!value) {
    return null
  }

  const numericId = value.id
  if (typeof numericId === 'number' && Number.isFinite(numericId)) {
    return String(numericId)
  }

  if (typeof numericId === 'string' && numericId.trim().length > 0) {
    return numericId
  }

  const iri = getString(value, '@id')
  if (iri) {
    const segments = iri.split('/')
    return segments.at(-1) ?? iri
  }

  return null
}

const resolveShipmentItems = (order: UnknownRecord | null) => {
  if (!order) {
    return []
  }

  const items = order.items
  return extractCollectionItems<OrderItemJsonLd>(items)
    .map((item) => toRecord(item))
    .filter((item): item is UnknownRecord => Boolean(item))
}

const resolveShipments = (order: UnknownRecord | null) => {
  if (!order) {
    return []
  }

  const shipments = order.shipment ?? order.shipments
  return extractCollectionItems<OrderShipmentJsonLd | UnknownRecord>(shipments)
    .map((shipment) => toRecord(shipment))
    .filter((shipment): shipment is UnknownRecord => Boolean(shipment))
}

const tokenValue = computed(() => {
  const rawToken = route.query.tokenValue ?? route.query.orderToken ?? route.params.tokenValue
  if (Array.isArray(rawToken)) {
    return rawToken[0] ?? ''
  }

  return typeof rawToken === 'string' ? rawToken : ''
})

const selectedMethods = ref<Record<string, string>>({})
const savingStates = ref<Record<string, boolean>>({})
const updateErrors = ref<Record<string, string>>({})

const fetchShippingData = async () => {
  if (!tokenValue.value) {
    return null
  }

  const order = await $fetch<OrderJsonLdSyliusShopCartShow>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}`,
  )

  const orderRecord = toRecord(order)
  const shipments = resolveShipments(orderRecord)

  const shipmentEntries: ShippingEntry[] = []
  for (const shipmentRecord of shipments) {
    const shipmentId = extractShipmentId(shipmentRecord)
    let methods: ShippingMethodJsonldSyliusShopShippingMethodIndex[] = []

    if (shipmentId) {
      try {
        const response = await $fetch<HydraCollection<ShippingMethodJsonldSyliusShopShippingMethodIndex>>(
          `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}/shipments/${encodeURIComponent(shipmentId)}/methods`,
        )

        methods = extractCollectionItems<ShippingMethodJsonldSyliusShopShippingMethodIndex>(
          response,
        )
      } catch (fetchError) {
        if (import.meta.dev) {
          console.warn('Failed to load shipping methods', fetchError)
        }
        methods = []
      }
    }

    shipmentEntries.push({
      id: shipmentId,
      shipment: shipmentRecord as OrderShipmentJsonLd,
      methods,
    })
  }

  return {
    order,
    shipments: shipmentEntries,
  }
}

const {
  data: shippingData,
  pending,
  error,
  refresh,
} = await useAsyncData('ecommerce-shipping', fetchShippingData, {
  watch: [tokenValue],
})

const orderRecord = computed(() => toRecord(shippingData.value?.order))
const orderItems = computed(() => resolveShipmentItems(orderRecord.value))
const shipmentEntries = computed(() => shippingData.value?.shipments ?? [])

watch(
  shipmentEntries,
  (entries) => {
    const nextSelection: Record<string, string> = { ...selectedMethods.value }
    for (const entry of entries) {
      if (!entry.id) {
        continue
      }

      const shipmentRecord = toRecord(entry.shipment)
      const currentMethod = extractCodeFromReference(
        shipmentRecord ? shipmentRecord.method : null,
      )

      if (currentMethod && !nextSelection[entry.id]) {
        nextSelection[entry.id] = currentMethod
      }
    }

    selectedMethods.value = nextSelection
  },
  { immediate: true },
)

const currencyCode = computed(() => getString(orderRecord.value, 'currencyCode') ?? 'USD')

const priceFormatter = computed(() => {
  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currencyCode.value,
    })
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }
})

const formatPrice = (amount: unknown): string => {
  const normalized = normalizeAmount(amount)
  if (normalized == null) {
    return priceFormatter.value.format(0)
  }

  try {
    return priceFormatter.value.format(normalized / 100)
  } catch {
    const displayCurrency = currencyCode.value || 'USD'
    return `${displayCurrency} ${(normalized / 100).toFixed(2)}`
  }
}

const resolveMethodPrice = (method: ShippingMethodJsonldSyliusShopShippingMethodIndex) => {
  if (method.price == null) {
    return t('pages.ecommerceShipping.methods.free')
  }

  if (method.price === 0) {
    return t('pages.ecommerceShipping.methods.free')
  }

  return formatPrice(method.price)
}

const resolveMethodDescription = (
  method: ShippingMethodJsonldSyliusShopShippingMethodIndex,
) => {
  return method.description && method.description.trim().length > 0
    ? method.description
    : null
}

const resolveMethodName = (method: ShippingMethodJsonldSyliusShopShippingMethodIndex) =>
  method.name && method.name.trim().length > 0 ? method.name : method.code

const resolveOrderTotals = computed(() => {
  const record = orderRecord.value
  if (!record) {
    return {
      items: 0,
      discount: 0,
      shipping: 0,
      taxes: 0,
      total: 0,
    }
  }

  const itemsTotal = getNumber(record, 'itemsTotal') ?? 0
  const discountTotal =
    (getNumber(record, 'orderPromotionTotal') ?? 0) +
    (getNumber(record, 'shippingPromotionTotal') ?? 0)
  const shippingTotal = getNumber(record, 'shippingTotal') ?? 0
  const taxesTotal = getNumber(record, 'taxTotal') ?? 0
  const grandTotal = getNumber(record, 'total') ?? itemsTotal + shippingTotal + taxesTotal

  return {
    items: itemsTotal,
    discount: discountTotal,
    shipping: shippingTotal,
    taxes: taxesTotal,
    total: grandTotal,
  }
})

const summaryRows = computed(() => {
  const totals = resolveOrderTotals.value

  return [
    {
      key: 'items',
      label: t('pages.ecommerceShipping.summary.items'),
      amount: totals.items,
    },
    {
      key: 'discount',
      label: t('pages.ecommerceShipping.summary.discount'),
      amount: totals.discount,
    },
    {
      key: 'shipping',
      label: t('pages.ecommerceShipping.summary.shipping'),
      amount: totals.shipping,
    },
    {
      key: 'taxes',
      label: t('pages.ecommerceShipping.summary.taxes'),
      amount: totals.taxes,
    },
  ]
})

const summaryTotal = computed(() => resolveOrderTotals.value.total)

const shipmentsAvailable = computed(
  () => shipmentEntries.value.length > 0 && tokenValue.value.length > 0,
)

const allShipmentsConfigured = computed(() =>
  shipmentEntries.value.length > 0 &&
  shipmentEntries.value.every((entry) => entry.id && selectedMethods.value[entry.id]),
)

const generalErrorMessage = computed(() => {
  if (!tokenValue.value) {
    return t('pages.ecommerceShipping.states.missingToken')
  }

  if (error.value) {
    return t('pages.ecommerceShipping.states.loadFailed')
  }

  if (!pending.value && shipmentEntries.value.length === 0) {
    return t('pages.ecommerceShipping.states.empty')
  }

  return null
})

const isSavingShipment = (shipmentId: string | null | undefined) => {
  if (!shipmentId) {
    return false
  }

  return Boolean(savingStates.value[shipmentId])
}

const handleRefresh = async () => {
  await refresh()
}

const handleMethodSelection = async (shipmentId: string, methodCode: string) => {
  if (!shipmentId || !methodCode || !tokenValue.value) {
    return
  }

  selectedMethods.value = {
    ...selectedMethods.value,
    [shipmentId]: methodCode,
  }

  savingStates.value = {
    ...savingStates.value,
    [shipmentId]: true,
  }
  updateErrors.value = {
    ...updateErrors.value,
    [shipmentId]: '',
  }

  try {
    await $fetch(
      `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}/shipments/${encodeURIComponent(shipmentId)}`,
      {
        method: 'PATCH',
        body: {
          shippingMethod: `/api/v2/shop/shipping-methods/${methodCode}`,
        },
      },
    )

    Notify.success(t('pages.ecommerceShipping.messages.updated'))
    await refresh()
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : t('pages.ecommerceShipping.messages.updateFailed')

    updateErrors.value = {
      ...updateErrors.value,
      [shipmentId]: errorMessage,
    }
    Notify.error(errorMessage)
  } finally {
    savingStates.value = {
      ...savingStates.value,
      [shipmentId]: false,
    }
  }
}

const handleContinue = () => {
  Notify.info(t('pages.ecommerceShipping.messages.continueInfo'))
}
</script>

<template>
  <v-container fluid class="ecommerce-shipping-page pa-0">
    <div class="shipping-hero">
      <div class="shipping-hero__content">
        <p class="shipping-hero__kicker text-overline">
          {{ t('pages.ecommerceShipping.kicker') }}
        </p>
        <h1 class="shipping-hero__title text-h3 text-md-h2 font-weight-bold mb-2">
          {{ t('pages.ecommerceShipping.title') }}
        </h1>
        <p class="shipping-hero__subtitle text-body-1 text-medium-emphasis">
          {{ t('pages.ecommerceShipping.subtitle') }}
        </p>
      </div>
      <div class="shipping-hero__steps">
        <div
          v-for="(step, index) in [
            t('pages.ecommerceShipping.steps.address'),
            t('pages.ecommerceShipping.steps.shipping'),
            t('pages.ecommerceShipping.steps.payment'),
            t('pages.ecommerceShipping.steps.complete'),
          ]"
          :key="step"
          class="shipping-step"
          :class="{
            'shipping-step--active': index === 1,
            'shipping-step--completed': index < 1,
          }"
        >
          <div class="shipping-step__bullet">
            <span>{{ index + 1 }}</span>
          </div>
          <span class="shipping-step__label">{{ step }}</span>
          <span v-if="index < 3" class="shipping-step__divider" />
        </div>
      </div>
    </div>

    <v-container class="shipping-content" fluid>
      <v-row class="shipping-layout" align="stretch" justify="center" no-gutters>
        <v-col cols="12" lg="7" class="pa-3 pa-md-4">
          <AppCard
            class="shipping-card"
            elevation="3"
            :loading="pending"
            variant="elevated"
          >
            <div class="shipping-card__header">
              <div>
                <h2 class="text-h5 text-md-h4 font-weight-bold mb-1">
                  {{ t('pages.ecommerceShipping.cardTitle') }}
                </h2>
                <p class="text-body-1 text-medium-emphasis mb-0">
                  {{ t('pages.ecommerceShipping.cardSubtitle') }}
                </p>
              </div>
              <AppButton
                variant="tonal"
                color="primary"
                :loading="pending"
                @click="handleRefresh"
              >
                {{ t('pages.ecommerceShipping.actions.refresh') }}
              </AppButton>
            </div>

            <v-alert
              v-if="generalErrorMessage"
              type="warning"
              variant="tonal"
              class="mb-6"
            >
              {{ generalErrorMessage }}
            </v-alert>

            <template v-if="shipmentsAvailable">
              <div
                v-for="(entry, index) in shipmentEntries"
                :key="entry.id ?? index"
                class="shipping-section"
              >
                <div class="shipping-section__header">
                  <div>
                    <h3 class="text-h6 text-md-h5 font-weight-semibold mb-1">
                      {{
                        t('pages.ecommerceShipping.shipment.title', {
                        index: index + 1,
                      })
                    }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ t('pages.ecommerceShipping.shipment.subtitle') }}
                  </p>
                </div>
                <div v-if="entry.shipment" class="shipping-section__status">
                  <span class="shipping-section__status-label">
                    {{ t('pages.ecommerceShipping.shipment.status') }}
                  </span>
                  <span class="shipping-section__status-value">
                    {{
                      getString(toRecord(entry.shipment), 'state')
                        ? t('pages.ecommerceShipping.shipment.state', {
                            state: getString(toRecord(entry.shipment), 'state'),
                          })
                        : t('pages.ecommerceShipping.shipment.pending')
                    }}
                  </span>
                </div>
              </div>

              <div class="shipping-methods">
                <div class="shipping-methods__heading">
                  <h4 class="text-subtitle-1 font-weight-medium mb-2">
                    {{ t('pages.ecommerceShipping.methods.heading') }}
                  </h4>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ t('pages.ecommerceShipping.methods.caption') }}
                  </p>
                </div>

                <v-radio-group
                  class="shipping-methods__list"
                  :model-value="entry.id ? selectedMethods[entry.id] ?? '' : ''"
                  :disabled="isSavingShipment(entry.id)"
                  @update:model-value="
                    (value) => entry.id && handleMethodSelection(entry.id, value as string)
                  "
                >
                  <v-radio
                    v-for="method in entry.methods"
                    :key="method.code"
                    :value="method.code"
                    class="shipping-method"
                  >
                    <template #label>
                      <div class="shipping-method__content">
                        <div>
                          <div class="shipping-method__name">
                            {{ resolveMethodName(method) }}
                          </div>
                          <div
                            v-if="resolveMethodDescription(method)"
                            class="shipping-method__description"
                          >
                            {{ resolveMethodDescription(method) }}
                          </div>
                        </div>
                        <div class="shipping-method__price">
                          {{ resolveMethodPrice(method) }}
                        </div>
                      </div>
                    </template>
                  </v-radio>

                  <p v-if="entry.methods.length === 0" class="text-body-2 text-medium-emphasis mb-0">
                    {{ t('pages.ecommerceShipping.methods.empty') }}
                  </p>
                </v-radio-group>

                <v-progress-linear
                  v-if="isSavingShipment(entry.id)"
                  indeterminate
                  color="primary"
                  class="mt-3"
                />

                <v-alert
                  v-if="entry.id && updateErrors[entry.id]"
                  type="error"
                  variant="tonal"
                  class="mt-3"
                >
                  {{ updateErrors[entry.id] }}
                </v-alert>
              </div>
              </div>
            </template>

            <div v-if="shipmentsAvailable" class="shipping-actions">
              <AppButton
                color="primary"
                size="large"
                class="shipping-actions__next"
                :disabled="!allShipmentsConfigured"
                @click="handleContinue"
              >
                {{ t('pages.ecommerceShipping.actions.next') }}
              </AppButton>
            </div>
          </AppCard>
        </v-col>

        <v-col cols="12" lg="5" class="pa-3 pa-md-4">
          <AppCard class="shipping-summary" elevation="4">
            <div class="shipping-summary__header">
              <h2 class="text-h5 font-weight-bold mb-1">
                {{ t('pages.ecommerceShipping.summary.title') }}
              </h2>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ t('pages.ecommerceShipping.summary.subtitle') }}
              </p>
            </div>

            <ul v-if="orderItems.length" class="shipping-summary__items">
              <li
                v-for="(item, index) in orderItems"
                :key="getString(toRecord(item), '@id') ?? index"
                class="shipping-summary__item"
              >
                <div>
                  <p class="shipping-summary__item-name mb-1">
                    {{ getString(toRecord(item), 'productName') ?? t('pages.ecommerceShipping.summary.unknownProduct') }}
                  </p>
                  <p class="shipping-summary__item-quantity text-body-2 text-medium-emphasis mb-0">
                    {{
                      t('pages.ecommerceShipping.summary.quantity', {
                        count: getNumber(toRecord(item), 'quantity') ?? 1,
                      })
                    }}
                  </p>
                </div>
                <div class="shipping-summary__item-price">
                  {{ formatPrice(getNumber(toRecord(item), 'total') ?? getNumber(toRecord(item), 'subtotal')) }}
                </div>
              </li>
            </ul>

            <div class="shipping-summary__totals">
              <div
                v-for="row in summaryRows"
                :key="row.key"
                class="shipping-summary__row"
              >
                <span class="shipping-summary__label">{{ row.label }}</span>
                <span
                  class="shipping-summary__value"
                  :class="{ 'shipping-summary__value--negative': row.amount < 0 }"
                >
                  {{ formatPrice(row.amount) }}
                </span>
              </div>
              <div class="shipping-summary__divider" />
              <div class="shipping-summary__row shipping-summary__row--total">
                <span class="shipping-summary__label">
                  {{ t('pages.ecommerceShipping.summary.total') }}
                </span>
                <span class="shipping-summary__value shipping-summary__value--total">
                  {{ formatPrice(summaryTotal) }}
                </span>
              </div>
            </div>
          </AppCard>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.ecommerce-shipping-page {
  background: linear-gradient(135deg, rgba(51, 94, 234, 0.08), rgba(255, 255, 255, 0));
  min-height: 100vh;
  padding-bottom: 64px;
}

.shipping-hero {
  position: relative;
  padding: 64px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
  justify-content: center;
  max-width: 1280px;
  margin: 0 auto;
}

.shipping-hero__content {
  max-width: 520px;
}

.shipping-hero__kicker {
  color: rgba(var(--v-theme-primary), 0.8);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.shipping-hero__title {
  color: rgb(var(--v-theme-primary));
}

.shipping-hero__subtitle {
  max-width: 440px;
}

.shipping-hero__steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  width: 100%;
}

.shipping-step {
  position: relative;
  padding: 16px 20px;
  border-radius: 18px;
  background: rgba(var(--v-theme-surface), 0.82);
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: inset 0 0 0 1px rgba(var(--v-theme-primary), 0.08);
}

.shipping-step--active {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  box-shadow: none;
}

.shipping-step--completed {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.shipping-step__bullet {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 600;
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}

.shipping-step--active .shipping-step__bullet {
  background: rgba(var(--v-theme-on-primary), 0.16);
  color: rgb(var(--v-theme-on-primary));
}

.shipping-step--completed .shipping-step__bullet {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.shipping-step__label {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.shipping-step__divider {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 2px;
  background: rgba(var(--v-theme-primary), 0.2);
}

.shipping-content {
  max-width: 1280px;
}

.shipping-card {
  padding: 32px;
  min-height: 100%;
}

.shipping-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.shipping-section {
  padding: 24px;
  border-radius: 18px;
  background: rgba(var(--v-theme-surface-variant), 0.18);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  margin-bottom: 32px;
}

.shipping-section:last-of-type {
  margin-bottom: 40px;
}

.shipping-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.shipping-section__status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.shipping-section__status-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.shipping-section__status-value {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.shipping-methods__heading {
  margin-bottom: 16px;
}

.shipping-methods__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-method {
  --v-theme-surface: rgba(var(--v-theme-surface), 0.92);
  border-radius: 16px;
  padding: 4px;
}

.shipping-method :deep(.v-selection-control__input) {
  align-self: center;
}

.shipping-method :deep(.v-selection-control__wrapper) {
  width: auto;
  margin-right: 16px;
}

.shipping-method__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(var(--v-theme-surface), 0.88);
  box-shadow: 0 6px 16px rgba(21, 46, 124, 0.08);
  width: 100%;
}

.shipping-method__name {
  font-weight: 600;
}

.shipping-method__description {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.9rem;
  margin-top: 4px;
}

.shipping-method__price {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.shipping-actions {
  display: flex;
  justify-content: flex-end;
}

.shipping-actions__next {
  min-width: 220px;
}

.shipping-summary {
  padding: 32px;
  position: sticky;
  top: 32px;
}

.shipping-summary__header {
  margin-bottom: 24px;
}

.shipping-summary__items {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shipping-summary__item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.shipping-summary__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.shipping-summary__item-name {
  font-weight: 600;
}

.shipping-summary__item-quantity {
  letter-spacing: 0.02em;
}

.shipping-summary__item-price {
  font-weight: 600;
}

.shipping-summary__totals {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.shipping-summary__divider {
  height: 1px;
  width: 100%;
  background: rgba(var(--v-theme-outline), 0.16);
}

.shipping-summary__row--total {
  font-size: 1.1rem;
  font-weight: 700;
}

.shipping-summary__label {
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.shipping-summary__value {
  font-weight: 600;
}

.shipping-summary__value--negative {
  color: rgb(var(--v-theme-error));
}

.shipping-summary__value--total {
  color: rgb(var(--v-theme-primary));
  font-size: 1.2rem;
}

@media (max-width: 960px) {
  .shipping-card,
  .shipping-summary {
    padding: 24px;
  }

  .shipping-hero {
    padding: 48px 16px 24px;
  }

  .shipping-hero__steps {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
}

@media (max-width: 600px) {
  .shipping-method__content {
    flex-direction: column;
    align-items: flex-start;
  }

  .shipping-step__divider {
    display: none;
  }

  .shipping-summary {
    position: static;
  }
}
</style>
