<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import { useEcommerceCartStore } from '~/stores/ecommerceCart'
import type { OrderJsonLd } from '~/types/order'
import type { ShippingMethodJsonldSyliusShopShippingMethodIndex } from '~/types/shippingMethod'
import {
  extractCollectionItems,
  getString,
  isRecord,
  normalizeAmount,
  resolveTranslation,
  toRecord,
  type UnknownRecord,
} from '~/utils/ecommerce/product'

definePageMeta({
  title: 'pages.ecommerceCheckout.shipping.meta.title',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const cartStore = useEcommerceCartStore()

const queryOrderToken = computed(() => {
  const queryToken =
    route.query.order ??
    route.query.token ??
    route.query.tokenValue ??
    route.query.token_id
  if (Array.isArray(queryToken)) {
    return queryToken[0] ?? null
  }

  if (typeof queryToken === 'string') {
    return queryToken
  }

  return null
})

const orderToken = computed(
  () => queryOrderToken.value ?? cartStore.token ?? null,
)

watch(
  queryOrderToken,
  (value) => {
    if (value && value !== cartStore.token) {
      cartStore.setToken(value)
    }
  },
  { immediate: true },
)

const hasOrderToken = computed(() => Boolean(orderToken.value))

const resolveErrorMessage = (error: unknown, fallback: string): string => {
  if (!error) {
    return fallback
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  if (isRecord(error)) {
    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }

    if (isRecord(error.data) && typeof error.data.message === 'string') {
      return error.data.message
    }
  }

  return fallback
}

const fetchOrder = async () => {
  if (!orderToken.value) {
    return null
  }

  const headers = locale.value
    ? { 'Accept-Language': locale.value as string }
    : undefined

  return await $fetch<OrderJsonLd>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(orderToken.value)}`,
    {
      headers,
    },
  )
}

const {
  data: orderData,
  pending: isOrderLoading,
  error: orderError,
  refresh: refreshOrder,
} = await useAsyncData('ecommerce-checkout-shipping-order', fetchOrder, {
  watch: [orderToken, locale],
  server: false,
  default: () => null,
})

const currencyCode = computed(() => orderData.value?.currencyCode ?? 'USD')

const amountFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value ?? 'en', {
      style: 'currency',
      currency: currencyCode.value,
    }),
)

const formatAmount = (amount?: number | null) => {
  const formatter = amountFormatter.value
  if (amount == null) {
    return formatter.format(0)
  }

  const normalized = amount / 100
  return formatter.format(Number.isFinite(normalized) ? normalized : 0)
}

const orderTotals = computed(() => {
  const order = orderData.value
  if (!order) {
    return {
      itemsTotal: 0,
      orderPromotionTotal: 0,
      shippingTotal: 0,
      taxTotal: 0,
      total: 0,
      itemsCount: 0,
    }
  }

  return {
    itemsTotal: order.itemsTotal ?? 0,
    orderPromotionTotal: order.orderPromotionTotal ?? 0,
    shippingTotal: order.shippingTotal ?? 0,
    taxTotal: order.taxTotal ?? 0,
    total: order.total ?? 0,
    itemsCount: order.totalQuantity ?? order.items?.length ?? 0,
  }
})

watch(
  () => orderData.value,
  (value) => {
    cartStore.captureOrder(value)
  },
  { immediate: true },
)

const extractResourceId = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const segments = value.split('/')
  const lastSegment = segments.pop() ?? null
  if (lastSegment && lastSegment.trim().length > 0) {
    return lastSegment
  }

  return null
}

const resolveShipmentId = (
  shipment: UnknownRecord | null | undefined,
): string | null => {
  if (!shipment) {
    return null
  }

  const numericId = shipment.id
  if (typeof numericId === 'number' && Number.isFinite(numericId)) {
    return String(numericId)
  }

  if (typeof shipment.id === 'string' && shipment.id.trim().length > 0) {
    return shipment.id
  }

  if (typeof shipment['@id'] === 'string') {
    return extractResourceId(shipment['@id']) ?? shipment['@id']
  }

  const iri = shipment.iri
  if (typeof iri === 'string') {
    return extractResourceId(iri) ?? iri
  }

  return null
}

const resolveMethodCode = (method: unknown): string | null => {
  if (!method) {
    return null
  }

  if (typeof method === 'string') {
    return extractResourceId(method) ?? method
  }

  const record = toRecord(method)
  if (!record) {
    return null
  }

  if (typeof record.code === 'string' && record.code.trim().length > 0) {
    return record.code
  }

  if (typeof record.id === 'string' && record.id.trim().length > 0) {
    return record.id
  }

  if (typeof record['@id'] === 'string' && record['@id'].trim().length > 0) {
    return extractResourceId(record['@id']) ?? record['@id']
  }

  return null
}

const buildMethodIri = (code: string | null | undefined) =>
  code ? `/api/v2/shop/shipping-methods/${encodeURIComponent(code)}` : null

type ShipmentRecord = UnknownRecord

type ShippingMethodOption = {
  code: string
  iri: string | null
  label: string
  description: string | null
  amount: number | null
}

const shipments = computed<ShipmentRecord[]>(() => {
  const orderRecord = toRecord(orderData.value)
  if (!orderRecord) {
    return []
  }

  const shipmentSource = orderRecord.shipment ?? orderRecord.shipments ?? null
  const entries = extractCollectionItems<unknown>(shipmentSource)
  return entries
    .map((entry) => toRecord(entry))
    .filter((entry): entry is ShipmentRecord =>
      Boolean(entry && resolveShipmentId(entry)),
    )
})

const shipmentOptions = ref<Record<string, ShippingMethodOption[]>>({})
const shipmentLoading = ref<Record<string, boolean>>({})
const shipmentErrors = ref<Record<string, string | null>>({})
const selectedMethodCodes = ref<Record<string, string | null>>({})

const updatingShipmentId = ref<string | null>(null)
const updateSuccess = ref<string | null>(null)
const updateError = ref<string | null>(null)

const anyShipmentLoading = computed(() =>
  Object.values(shipmentLoading.value).some((entry) => Boolean(entry)),
)

const selectingDisabled = computed(
  () => updatingShipmentId.value !== null || anyShipmentLoading.value,
)

const resolveShippingMethodLabel = (
  method:
    | ShippingMethodJsonldSyliusShopShippingMethodIndex
    | UnknownRecord
    | null,
) => {
  if (!method) {
    return t('pages.ecommerceCheckout.shipping.fallbacks.methodLabel')
  }

  const record = toRecord(method)
  if (!record) {
    return t('pages.ecommerceCheckout.shipping.fallbacks.methodLabel')
  }

  if (typeof record.name === 'string' && record.name.trim().length > 0) {
    return record.name
  }

  const localeCode = typeof locale.value === 'string' ? locale.value : null
  const translationsSource = record.translations ?? record.translation ?? null

  if (localeCode && translationsSource) {
    const translation = resolveTranslation(translationsSource, localeCode)
    const translatedName = getString(translation, 'name')
    if (translatedName) {
      return translatedName
    }
  }

  if (translationsSource) {
    const fallbackTranslation = resolveTranslation(
      translationsSource,
      getString(record, 'fallbackLocale') ??
        getString(record, 'currentLocale') ??
        'en',
    )
    const fallbackName = getString(fallbackTranslation, 'name')
    if (fallbackName) {
      return fallbackName
    }
  }

  if (typeof record.code === 'string' && record.code.trim().length > 0) {
    return record.code.replace(/[_-]+/g, ' ')
  }

  return t('pages.ecommerceCheckout.shipping.fallbacks.methodLabel')
}

const resolveShippingMethodDescription = (
  method:
    | ShippingMethodJsonldSyliusShopShippingMethodIndex
    | UnknownRecord
    | null,
) => {
  if (!method) {
    return null
  }

  const record = toRecord(method)
  if (!record) {
    return null
  }

  if (
    typeof record.description === 'string' &&
    record.description.trim().length > 0
  ) {
    return record.description
  }

  const localeCode = typeof locale.value === 'string' ? locale.value : null
  const translationsSource = record.translations ?? record.translation ?? null

  if (localeCode && translationsSource) {
    const translation = resolveTranslation(translationsSource, localeCode)
    const translatedDescription = getString(translation, 'description')
    if (translatedDescription) {
      return translatedDescription
    }
  }

  if (translationsSource) {
    const fallbackTranslation = resolveTranslation(
      translationsSource,
      getString(record, 'fallbackLocale') ??
        getString(record, 'currentLocale') ??
        'en',
    )
    const fallbackDescription = getString(fallbackTranslation, 'description')
    if (fallbackDescription) {
      return fallbackDescription
    }
  }

  return null
}

const resolveShippingMethodAmount = (
  method:
    | ShippingMethodJsonldSyliusShopShippingMethodIndex
    | UnknownRecord
    | null,
): number | null => {
  if (!method) {
    return null
  }

  const record = toRecord(method)
  if (!record) {
    return null
  }

  if (typeof record.price === 'number' && Number.isFinite(record.price)) {
    return record.price
  }

  return normalizeAmount(record.price) ?? null
}

const fetchShipmentMethodsById = async (shipmentId: string, force = false) => {
  if (!orderToken.value) {
    return
  }

  if (!force && shipmentOptions.value[shipmentId]) {
    return
  }

  shipmentLoading.value = { ...shipmentLoading.value, [shipmentId]: true }
  shipmentErrors.value = { ...shipmentErrors.value, [shipmentId]: null }

  try {
    const headers = locale.value
      ? { 'Accept-Language': locale.value as string }
      : undefined

    const response = await $fetch<unknown>(
      `/api/ecommerce/v2/shop/orders/${encodeURIComponent(orderToken.value)}/shipments/${encodeURIComponent(shipmentId)}/methods`,
      {
        headers,
      },
    )

    const methods =
      extractCollectionItems<ShippingMethodJsonldSyliusShopShippingMethodIndex>(
        response,
      )
    const options = methods
      .map((method) => {
        const code = resolveMethodCode(method)
        if (!code) {
          return null
        }

        return {
          code,
          iri:
            typeof method['@id'] === 'string' && method['@id'].trim().length > 0
              ? method['@id']
              : buildMethodIri(code),
          label: resolveShippingMethodLabel(method),
          description: resolveShippingMethodDescription(method),
          amount: resolveShippingMethodAmount(method),
        }
      })
      .filter((option): option is ShippingMethodOption => Boolean(option))

    shipmentOptions.value = { ...shipmentOptions.value, [shipmentId]: options }
  } catch (error) {
    shipmentErrors.value = {
      ...shipmentErrors.value,
      [shipmentId]: resolveErrorMessage(
        error,
        t('pages.ecommerceCheckout.shipping.sections.loadError'),
      ),
    }
  } finally {
    shipmentLoading.value = { ...shipmentLoading.value, [shipmentId]: false }
  }
}

watch(
  shipments,
  (entries) => {
    const map: Record<string, string | null> = {}
    const shipmentIds: string[] = []

    for (const entry of entries) {
      const id = resolveShipmentId(entry)
      if (!id) {
        continue
      }

      shipmentIds.push(id)
      map[id] = resolveMethodCode(entry?.method)
      fetchShipmentMethodsById(id)
    }

    selectedMethodCodes.value = map

    const existingIds = Object.keys(shipmentOptions.value)
    for (const existing of existingIds) {
      if (!shipmentIds.includes(existing)) {
        const { [existing]: _removed, ...rest } = shipmentOptions.value
        shipmentOptions.value = rest

        const { [existing]: _removedLoading, ...restLoading } =
          shipmentLoading.value
        shipmentLoading.value = restLoading

        const { [existing]: _removedError, ...restErrors } =
          shipmentErrors.value
        shipmentErrors.value = restErrors
      }
    }
  },
  { immediate: true },
)

watch(
  () => locale.value,
  () => {
    const ids = shipments.value
      .map((shipment) => resolveShipmentId(shipment))
      .filter((id): id is string => Boolean(id))

    for (const id of ids) {
      fetchShipmentMethodsById(id, true)
    }
  },
)

const onSelectMethod = async (shipmentId: string, code: string | null) => {
  if (!orderToken.value || !code) {
    return
  }

  if (selectingDisabled.value) {
    return
  }

  const previous = selectedMethodCodes.value[shipmentId] ?? null
  if (previous === code) {
    return
  }

  const options = shipmentOptions.value[shipmentId] ?? []
  const option = options.find((entry) => entry.code === code)
  const nextIri = option?.iri ?? buildMethodIri(code)

  if (!nextIri) {
    updateError.value = t(
      'pages.ecommerceCheckout.shipping.notifications.error',
    )
    return
  }

  updateError.value = null
  updateSuccess.value = null
  updatingShipmentId.value = shipmentId
  selectedMethodCodes.value = {
    ...selectedMethodCodes.value,
    [shipmentId]: code,
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (locale.value) {
      headers['Accept-Language'] = locale.value as string
    }

    await $fetch(
      `/api/ecommerce/v2/shop/orders/${encodeURIComponent(orderToken.value)}/shipments/${encodeURIComponent(shipmentId)}`,
      {
        method: 'PATCH',
        body: { method: nextIri },
        headers,
      },
    )

    updateSuccess.value = t(
      'pages.ecommerceCheckout.shipping.notifications.success',
    )
    await refreshOrder()
  } catch (error) {
    selectedMethodCodes.value = {
      ...selectedMethodCodes.value,
      [shipmentId]: previous,
    }
    updateError.value = resolveErrorMessage(
      error,
      t('pages.ecommerceCheckout.shipping.notifications.error'),
    )
    console.error('Failed to update shipping method', error)
  } finally {
    updatingShipmentId.value = null
  }
}

const shipmentChangeAddressRoute = computed(() => {
  const query = orderToken.value ? { order: orderToken.value } : undefined
  if (query) {
    return localePath({
      name: 'ecommerce-checkout-address',
      query,
    })
  }

  return localePath({ name: 'ecommerce-checkout-address' })
})

const paymentRoute = computed(() =>
  orderToken.value
    ? localePath({
        name: 'ecommerce-payment-tokenValue',
        params: { tokenValue: orderToken.value },
      })
    : null,
)

const shipmentLabels = computed(() =>
  shipments.value.map((_, index) =>
    t('pages.ecommerceCheckout.shipping.shipmentTitle', { index: index + 1 }),
  ),
)

const canProceed = computed(() => {
  if (!orderToken.value || shipments.value.length === 0) {
    return false
  }

  for (const shipment of shipments.value) {
    const id = resolveShipmentId(shipment)
    if (!id) {
      return false
    }

    const options = shipmentOptions.value[id] ?? []
    if (options.length === 0) {
      return false
    }

    const selected = selectedMethodCodes.value[id]
    if (!selected) {
      return false
    }
  }

  return updatingShipmentId.value === null
})
</script>

<template>
  <div class="checkout-shipping-page">
    <div class="checkout-shipping-page__background" />
    <v-container class="py-10" fluid>
      <v-row
        class="checkout-shipping-page__grid"
        align="stretch"
        justify="center"
      >
        <v-col cols="12" lg="7">
          <AppCard class="checkout-shipping-card" elevation="3">
            <div class="checkout-shipping-card__header">
              <div>
                <p
                  class="text-body-2 text-uppercase text-medium-emphasis font-weight-medium mb-1"
                >
                  {{
                    t('pages.ecommerceCheckout.shipping.headline.step', {
                      step: 2,
                    })
                  }}
                </p>
                <h1 class="text-h5 text-md-h4 font-weight-bold">
                  {{ t('pages.ecommerceCheckout.shipping.headline.title') }}
                </h1>
                <p class="text-body-2 text-medium-emphasis mt-1">
                  {{ t('pages.ecommerceCheckout.shipping.headline.subtitle') }}
                </p>
              </div>
              <div class="checkout-shipping-card__steps">
                <span class="checkout-shipping-card__step">
                  {{ t('pages.ecommerceCheckout.address.steps.address') }}
                </span>
                <span
                  class="checkout-shipping-card__step checkout-shipping-card__step--active"
                >
                  {{ t('pages.ecommerceCheckout.address.steps.shipping') }}
                </span>
                <span class="checkout-shipping-card__step">
                  {{ t('pages.ecommerceCheckout.address.steps.payment') }}
                </span>
                <span class="checkout-shipping-card__step">
                  {{ t('pages.ecommerceCheckout.address.steps.complete') }}
                </span>
              </div>
            </div>

            <v-alert
              v-if="updateSuccess"
              type="success"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              {{ updateSuccess }}
            </v-alert>
            <v-alert
              v-else-if="updateError"
              type="error"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              {{ updateError }}
            </v-alert>

            <v-alert
              v-if="!hasOrderToken"
              type="warning"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              {{
                t('pages.ecommerceCheckout.shipping.notifications.missingOrder')
              }}
            </v-alert>

            <section class="checkout-shipping-section">
              <div class="checkout-shipping-section__header">
                <div>
                  <h2
                    class="checkout-shipping-section__title text-h6 font-weight-semibold mb-1"
                  >
                    {{ t('pages.ecommerceCheckout.shipping.sections.title') }}
                  </h2>
                  <p class="text-body-2 text-medium-emphasis">
                    {{
                      t('pages.ecommerceCheckout.shipping.sections.subtitle')
                    }}
                  </p>
                </div>
                <AppButton
                  variant="text"
                  class="text-primary"
                  :to="shipmentChangeAddressRoute"
                >
                  {{
                    t('pages.ecommerceCheckout.shipping.sections.changeAddress')
                  }}
                </AppButton>
              </div>

              <v-alert
                v-if="orderError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ t('pages.ecommerceCheckout.shipping.sections.orderError') }}
              </v-alert>

              <v-progress-linear
                v-else-if="isOrderLoading"
                indeterminate
                color="primary"
                class="mb-6"
              />

              <div v-else>
                <v-alert
                  v-if="shipments.length === 0"
                  type="info"
                  variant="tonal"
                  density="comfortable"
                >
                  {{ t('pages.ecommerceCheckout.shipping.sections.empty') }}
                </v-alert>

                <div
                  v-for="(shipment, index) in shipments"
                  :key="resolveShipmentId(shipment) ?? index"
                  class="checkout-shipping-shipment"
                >
                  <div class="checkout-shipping-shipment__header">
                    <h3 class="text-subtitle-1 font-weight-semibold">
                      {{ shipmentLabels[index] }}
                    </h3>
                    <span class="text-body-2 text-medium-emphasis">
                      {{ t('pages.ecommerceCheckout.shipping.shipmentHint') }}
                    </span>
                  </div>

                  <v-alert
                    v-if="shipmentErrors[resolveShipmentId(shipment) ?? '']"
                    type="error"
                    variant="tonal"
                    density="comfortable"
                    class="mb-4"
                  >
                    <div
                      class="d-flex align-center justify-space-between gap-4"
                    >
                      <span>
                        {{ shipmentErrors[resolveShipmentId(shipment) ?? ''] }}
                      </span>
                      <AppButton
                        size="small"
                        variant="text"
                        color="primary"
                        @click="
                          resolveShipmentId(shipment)
                            ? fetchShipmentMethodsById(
                                resolveShipmentId(shipment)!,
                                true,
                              )
                            : undefined
                        "
                      >
                        {{
                          t('pages.ecommerceCheckout.shipping.sections.retry')
                        }}
                      </AppButton>
                    </div>
                  </v-alert>

                  <v-progress-linear
                    v-else-if="
                      shipmentLoading[resolveShipmentId(shipment) ?? '']
                    "
                    indeterminate
                    color="primary"
                    class="mb-4"
                  />

                  <div v-else>
                    <p
                      v-if="
                        (
                          shipmentOptions[resolveShipmentId(shipment) ?? ''] ??
                          []
                        ).length === 0
                      "
                      class="text-body-2 text-medium-emphasis"
                    >
                      {{
                        t('pages.ecommerceCheckout.shipping.sections.noMethods')
                      }}
                    </p>

                    <v-radio-group
                      v-else
                      :model-value="
                        selectedMethodCodes[
                          resolveShipmentId(shipment) ?? ''
                        ] ?? null
                      "
                      :disabled="selectingDisabled"
                      class="checkout-shipping-options"
                      @update:model-value="
                        (value) =>
                          resolveShipmentId(shipment)
                            ? onSelectMethod(
                                resolveShipmentId(shipment)!,
                                value,
                              )
                            : undefined
                      "
                    >
                      <v-radio
                        v-for="option in shipmentOptions[
                          resolveShipmentId(shipment) ?? ''
                        ]"
                        :key="option.code"
                        :value="option.code"
                        class="checkout-shipping-option"
                      >
                        <template #label>
                          <div class="checkout-shipping-option__content">
                            <div>
                              <span class="checkout-shipping-option__name">{{
                                option.label
                              }}</span>
                              <span
                                v-if="option.description"
                                class="checkout-shipping-option__description"
                              >
                                {{ option.description }}
                              </span>
                            </div>
                            <span class="checkout-shipping-option__price">
                              {{
                                option.amount == null
                                  ? t(
                                      'pages.ecommerceCheckout.shipping.labels.unavailable',
                                    )
                                  : formatAmount(option.amount)
                              }}
                            </span>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </div>
            </section>

            <div class="checkout-shipping-actions mt-8">
              <AppButton
                class="checkout-shipping-actions__back"
                color="default"
                variant="tonal"
                :to="shipmentChangeAddressRoute"
              >
                {{ t('pages.ecommerceCheckout.shipping.actions.back') }}
              </AppButton>
              <AppButton
                color="primary"
                size="large"
                :to="paymentRoute ?? undefined"
                :disabled="!canProceed"
              >
                {{ t('pages.ecommerceCheckout.shipping.actions.next') }}
              </AppButton>
            </div>
          </AppCard>
        </v-col>

        <v-col cols="12" lg="5">
          <div class="checkout-summary">
            <AppCard class="checkout-summary__card" elevation="3">
              <h2 class="text-h6 font-weight-semibold mb-4">
                {{ t('pages.ecommerceCheckout.address.summary.title') }}
              </h2>

              <v-alert
                v-if="orderError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ t('pages.ecommerceCheckout.address.summary.orderError') }}
              </v-alert>
              <v-progress-linear
                v-else-if="isOrderLoading"
                indeterminate
                color="primary"
                class="mb-4"
              />

              <ul class="checkout-summary__items">
                <li class="checkout-summary__row">
                  <span>{{
                    t('pages.ecommerceCheckout.address.summary.itemsTotal')
                  }}</span>
                  <strong>{{ formatAmount(orderTotals.itemsTotal) }}</strong>
                </li>
                <li class="checkout-summary__row">
                  <span>{{
                    t('pages.ecommerceCheckout.address.summary.discount')
                  }}</span>
                  <strong
                    >-{{
                      formatAmount(Math.abs(orderTotals.orderPromotionTotal))
                    }}</strong
                  >
                </li>
                <li class="checkout-summary__row">
                  <span>{{
                    t('pages.ecommerceCheckout.address.summary.shipping')
                  }}</span>
                  <strong>{{ formatAmount(orderTotals.shippingTotal) }}</strong>
                </li>
                <li class="checkout-summary__row">
                  <span>{{
                    t('pages.ecommerceCheckout.address.summary.taxes')
                  }}</span>
                  <strong>{{ formatAmount(orderTotals.taxTotal) }}</strong>
                </li>
              </ul>

              <v-divider class="my-4" />

              <div class="checkout-summary__total">
                <span>{{
                  t('pages.ecommerceCheckout.address.summary.total')
                }}</span>
                <strong>{{ formatAmount(orderTotals.total) }}</strong>
              </div>

              <p class="text-body-2 text-medium-emphasis mt-4">
                {{
                  t('pages.ecommerceCheckout.address.summary.itemsLabel', {
                    count: orderTotals.itemsCount,
                  })
                }}
              </p>
            </AppCard>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.checkout-shipping-page {
  position: relative;
  min-height: 100%;
  background: linear-gradient(
    120deg,
    rgba(111, 66, 193, 0.1),
    rgba(59, 130, 246, 0.12)
  );
  padding-block: 3rem;
}

.checkout-shipping-page__background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top right,
      rgba(59, 130, 246, 0.2),
      transparent 45%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(236, 72, 153, 0.18),
      transparent 45%
    );
  pointer-events: none;
}

.checkout-shipping-page__grid {
  position: relative;
  z-index: 1;
}

.checkout-shipping-card {
  padding: 2.5rem;
  backdrop-filter: blur(16px);
}

.checkout-shipping-card__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.checkout-shipping-card__steps {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.checkout-shipping-card__step {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background-color: rgba(59, 130, 246, 0.1);
  color: rgb(var(--v-theme-primary));
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.checkout-shipping-card__step--active {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-primary-darken-1))
  );
  color: white;
}

.checkout-shipping-section__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkout-shipping-section__title {
  margin: 0;
}

.checkout-shipping-shipment {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  background-color: rgba(var(--v-theme-surface), 0.75);
  backdrop-filter: blur(12px);
  margin-bottom: 1.5rem;
}

.checkout-shipping-shipment__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
}

.checkout-shipping-options {
  margin: 0;
}

.checkout-shipping-option {
  padding: 0.5rem 0;
}

.checkout-shipping-option__content {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.checkout-shipping-option__name {
  display: block;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.checkout-shipping-option__description {
  display: block;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.checkout-shipping-option__price {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.checkout-shipping-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.checkout-shipping-actions__back {
  color: rgb(var(--v-theme-primary));
}

.checkout-summary {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkout-summary__card {
  padding: 2rem;
}

.checkout-summary__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.checkout-summary__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.78);
}

.checkout-summary__row strong {
  color: rgb(var(--v-theme-on-surface));
}

.checkout-summary__total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 960px) {
  .checkout-summary {
    position: static;
  }

  .checkout-shipping-card {
    padding: 1.75rem;
  }
}
</style>
