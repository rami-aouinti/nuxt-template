<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppCard from '~/components/ui/AppCard.vue'
import type { OrderJsonLd, OrderPayment } from '~/types/order'
import type {
  PaymentMethodJsonldSyliusShopPaymentMethodIndex,
  PaymentMethodSummary,
} from '~/types/payment'
import { DEFAULT_LOCALE } from '~/utils/i18n/locales'

definePageMeta({
  title: 'pages.ecommercePayment.meta.title',
})

const route = useRoute()
const { t, te, locale } = useI18n()

const pluralRules = computed(
  () => new Intl.PluralRules(locale.value || DEFAULT_LOCALE),
)

const tokenValue = computed(() => {
  const value = route.params.tokenValue
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return typeof value === 'string' ? value : ''
})

const isRecord = (value: unknown): value is Record<string, any> =>
  Boolean(value) && typeof value === 'object'

type PaymentLike = (OrderPayment & { '@id'?: string | null }) &
  Record<string, unknown>

type PaymentMethodLike = (
  | PaymentMethodJsonldSyliusShopPaymentMethodIndex
  | PaymentMethodSummary
  | (Record<string, unknown> & { code?: string; name?: string | null })
) & { '@id'?: string | null }

type PaymentConfigurationResponse = {
  payment?: Record<string, unknown>
  paymentMethods?: unknown
  payment_methods?: unknown
  methods?: unknown
  availablePaymentMethods?: unknown
}

const buildMethodIri = (code: string | null | undefined) =>
  code ? `/api/v2/shop/payment-methods/${encodeURIComponent(code)}` : null

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

const resolvePaymentId = (payment: PaymentLike | null | undefined) => {
  if (!payment) {
    return null
  }

  if (typeof payment.id === 'number') {
    return String(payment.id)
  }

  if (typeof payment.id === 'string' && payment.id.trim().length > 0) {
    return payment.id
  }

  if (typeof payment['@id'] === 'string') {
    return extractResourceId(payment['@id'])
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

  if (isRecord(method)) {
    if (typeof method.code === 'string' && method.code.trim().length > 0) {
      return method.code
    }

    if (typeof method['@id'] === 'string') {
      const resourceId = extractResourceId(method['@id'])
      if (resourceId) {
        return resourceId
      }
    }

    if (typeof method.name === 'string' && method.name.trim().length > 0) {
      return method.name
    }
  }

  return null
}

const resolveMethodLabel = (
  method: PaymentMethodLike,
  localeCode: string | null | undefined,
  fallback: string,
) => {
  if (typeof method.name === 'string' && method.name.trim().length > 0) {
    return method.name
  }

  if (isRecord(method.translations)) {
    const translations = method.translations as Record<string, unknown>
    if (localeCode && isRecord(translations[localeCode])) {
      const translation = translations[localeCode] as Record<string, unknown>
      if (
        typeof translation.name === 'string' &&
        translation.name.trim().length > 0
      ) {
        return translation.name
      }
    }

    for (const value of Object.values(translations)) {
      if (isRecord(value) && typeof value.name === 'string' && value.name.trim()) {
        return value.name
      }
    }
  }

  const code = resolveMethodCode(method)
  if (code) {
    return code.replace(/[_-]+/g, ' ')
  }

  return fallback
}

const resolveMethodDescription = (method: PaymentMethodLike) => {
  if (typeof method.description === 'string' && method.description.trim()) {
    return method.description
  }

  if (isRecord(method.translations)) {
    const translations = method.translations as Record<string, unknown>
    for (const value of Object.values(translations)) {
      if (
        isRecord(value) &&
        typeof value.description === 'string' &&
        value.description.trim()
      ) {
        return value.description
      }
    }
  }

  return null
}

const resolveMethodInstructions = (method: PaymentMethodLike) => {
  if (typeof method.instructions === 'string' && method.instructions.trim()) {
    return method.instructions
  }

  if (isRecord(method.translations)) {
    const translations = method.translations as Record<string, unknown>
    for (const value of Object.values(translations)) {
      if (
        isRecord(value) &&
        typeof value.instructions === 'string' &&
        value.instructions.trim()
      ) {
        return value.instructions
      }
    }
  }

  return null
}

const resolveMethodIri = (method: PaymentMethodLike | string | null | undefined) => {
  if (!method) {
    return null
  }

  if (typeof method === 'string') {
    return method
  }

  if (typeof method['@id'] === 'string' && method['@id'].trim().length > 0) {
    return method['@id']
  }

  if (typeof method.code === 'string' && method.code.trim().length > 0) {
    return buildMethodIri(method.code)
  }

  return null
}

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
  const token = tokenValue.value
  if (!token) {
    return null
  }

  const headers = locale.value
    ? { 'Accept-Language': locale.value as string }
    : undefined

  return await $fetch<OrderJsonLd>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(token)}`,
    {
      headers,
    },
  )
}

const {
  data: orderData,
  pending: orderPending,
  error: orderError,
  refresh: refreshOrder,
} = await useAsyncData('ecommerce-payment-order', fetchOrder, {
  watch: [() => tokenValue.value, () => locale.value],
})

const order = computed<OrderJsonLd | null>(() => {
  const value = orderData.value
  if (!value || !isRecord(value)) {
    return null
  }

  return value as OrderJsonLd
})

const orderPayments = computed<PaymentLike[]>(() => {
  const currentOrder = order.value
  if (!currentOrder) {
    return []
  }

  const payments = Array.isArray(currentOrder.payment)
    ? currentOrder.payment
    : Array.isArray(currentOrder.payments)
      ? currentOrder.payments
      : []

  return payments.filter((payment): payment is PaymentLike => isRecord(payment))
})

const activePaymentIndex = computed(() =>
  orderPayments.value.findIndex((payment) => resolvePaymentId(payment) !== null),
)

const activePayment = computed<PaymentLike | null>(() => {
  const payments = orderPayments.value
  if (!payments.length) {
    return null
  }

  if (activePaymentIndex.value >= 0) {
    return payments[activePaymentIndex.value]
  }

  return payments[0]
})

const activePaymentId = computed(() => resolvePaymentId(activePayment.value))

const paymentStepOrder: Array<'address' | 'shipping' | 'payment' | 'complete'> = [
  'address',
  'shipping',
  'payment',
  'complete',
]

const checkoutStateToIndex: Record<string, number> = {
  cart: 0,
  addressed: 1,
  shipping_selected: 2,
  payment_selected: 2,
  completed: 3,
}

const currentStepIndex = computed(() => {
  const state = order.value?.checkoutState
  if (state && state in checkoutStateToIndex) {
    return checkoutStateToIndex[state]
  }

  return 2
})

const stepItems = computed(() =>
  paymentStepOrder.map((key, index) => {
    const status =
      index < currentStepIndex.value
        ? 'complete'
        : index === currentStepIndex.value
          ? 'current'
          : 'upcoming'

    return {
      key,
      status,
      label: t(`pages.ecommercePayment.steps.${key}`),
    }
  }),
)

const fetchPaymentConfiguration = async () => {
  const token = tokenValue.value
  const paymentId = activePaymentId.value
  if (!token || !paymentId) {
    return null
  }

  const headers = locale.value
    ? { 'Accept-Language': locale.value as string }
    : undefined

  return await $fetch<PaymentConfigurationResponse>(
    `/api/ecommerce/v2/shop/orders/${encodeURIComponent(token)}/payments/${encodeURIComponent(paymentId)}/configuration`,
    {
      headers,
    },
  )
}

const {
  data: paymentConfiguration,
  pending: paymentConfigurationPending,
  error: paymentConfigurationError,
  refresh: refreshPaymentConfiguration,
} = await useAsyncData(
  'ecommerce-payment-configuration',
  fetchPaymentConfiguration,
  {
    watch: [
      () => tokenValue.value,
      () => activePaymentId.value,
      () => locale.value,
    ],
  },
)

type PaymentMethodOption = {
  key: string
  code: string
  label: string
  description: string | null
  instructions: string | null
  iri: string | null
  raw: PaymentMethodLike | string
}

const normalizePaymentMethod = (
  entry: unknown,
  localeCode: string | null | undefined,
): PaymentMethodOption | null => {
  if (!entry) {
    return null
  }

  if (typeof entry === 'string') {
    const code = resolveMethodCode(entry)
    if (!code) {
      return null
    }

    const label = code.replace(/[_-]+/g, ' ')
    return {
      key: entry,
      code,
      label,
      description: null,
      instructions: null,
      iri: entry,
      raw: entry,
    }
  }

  if (!isRecord(entry)) {
    return null
  }

  const method = entry as PaymentMethodLike
  const code = resolveMethodCode(method)
  if (!code) {
    return null
  }

  const label = resolveMethodLabel(
    method,
    localeCode,
    t('pages.ecommercePayment.states.defaultMethodName'),
  )
  const description = resolveMethodDescription(method)
  const instructions = resolveMethodInstructions(method)
  const iri = resolveMethodIri(method)

  return {
    key: iri ?? code,
    code,
    label,
    description,
    instructions,
    iri,
    raw: method,
  }
}

const extractMethodEntries = (config: PaymentConfigurationResponse | null) => {
  if (!config) {
    return []
  }

  const candidates: unknown[] = []
  const possibleKeys: Array<keyof PaymentConfigurationResponse> = [
    'paymentMethods',
    'payment_methods',
    'methods',
    'availablePaymentMethods',
  ]

  for (const key of possibleKeys) {
    const value = config[key]
    if (!value) {
      continue
    }

    if (Array.isArray(value)) {
      candidates.push(...value)
    } else {
      candidates.push(value)
    }
  }

  const payment = config.payment
  if (payment && isRecord(payment) && Array.isArray(payment.methods)) {
    candidates.push(...payment.methods)
  }

  return candidates
}

const paymentMethods = computed<PaymentMethodOption[]>(() => {
  const config = paymentConfiguration.value
  const localeCode = locale.value
  const entries = extractMethodEntries(config ?? null)

  const normalized: PaymentMethodOption[] = []
  const seenCodes = new Set<string>()

  for (const entry of entries) {
    const option = normalizePaymentMethod(entry, localeCode)
    if (!option) {
      continue
    }

    if (seenCodes.has(option.code)) {
      continue
    }

    seenCodes.add(option.code)
    normalized.push(option)
  }

  // Ensure the currently selected method is always visible.
  const activeMethodCode = resolveMethodCode(activePayment.value?.method)
  if (
    activeMethodCode &&
    !seenCodes.has(activeMethodCode) &&
    activePayment.value?.method
  ) {
    const fallbackOption = normalizePaymentMethod(
      activePayment.value.method,
      localeCode,
    )
    if (fallbackOption) {
      normalized.unshift(fallbackOption)
      seenCodes.add(fallbackOption.code)
    }
  }

  return normalized
})

const selectedMethodCode = ref<string | null>(null)

watch(
  () => resolveMethodCode(activePayment.value?.method),
  (code) => {
    selectedMethodCode.value = code
  },
  { immediate: true },
)

const updatingMethodCode = ref<string | null>(null)
const updateError = ref<string | null>(null)
const updateSuccess = ref<string | null>(null)

const anyLoading = computed(
  () => orderPending.value || paymentConfigurationPending.value,
)

const loadErrorMessage = computed(() => {
  if (orderError.value) {
    return resolveErrorMessage(
      orderError.value,
      t('pages.ecommercePayment.notifications.loadingError'),
    )
  }

  if (paymentConfigurationError.value) {
    return resolveErrorMessage(
      paymentConfigurationError.value,
      t('pages.ecommercePayment.notifications.loadingError'),
    )
  }

  return null
})

const orderCurrency = computed(() => order.value?.currencyCode || 'USD')

const currencyFormatter = computed(() => {
  try {
    return new Intl.NumberFormat(locale.value ?? 'en', {
      style: 'currency',
      currency: orderCurrency.value || 'USD',
      minimumFractionDigits: 2,
    })
  } catch (error) {
    console.error('Failed to create currency formatter', error)
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    })
  }
})

const formatCurrency = (amount: number | null | undefined) => {
  if (amount == null) {
    return currencyFormatter.value.format(0)
  }

  const normalized = amount / 100

  try {
    return currencyFormatter.value.format(normalized)
  } catch (error) {
    console.error('Failed to format currency', error)
    return `${orderCurrency.value} ${normalized.toFixed(2)}`
  }
}

const summaryItems = computed(() => {
  const currentOrder = order.value
  if (!currentOrder) {
    return []
  }

  return [
    {
      key: 'itemsTotal',
      label: t('pages.ecommercePayment.summary.itemsTotal'),
      amount: currentOrder.itemsTotal ?? 0,
    },
    {
      key: 'discount',
      label: t('pages.ecommercePayment.summary.discount'),
      amount: currentOrder.orderPromotionTotal ?? 0,
    },
    {
      key: 'shipping',
      label: t('pages.ecommercePayment.summary.shipping'),
      amount: currentOrder.shippingTotal ?? 0,
    },
    {
      key: 'taxes',
      label: t('pages.ecommercePayment.summary.taxes'),
      amount: currentOrder.taxTotal ?? 0,
    },
  ]
})

const orderTotal = computed(() => order.value?.total ?? 0)

const customerName = computed(() => {
  const currentOrder = order.value
  if (!currentOrder) {
    return t('pages.ecommercePayment.summary.customerFallback')
  }

  const customer = currentOrder.customerWithAuthorization
  if (customer && typeof customer.fullName === 'string' && customer.fullName) {
    return customer.fullName
  }

  if (customer) {
    const nameParts = [customer.firstName, customer.lastName]
      .filter((part): part is string => typeof part === 'string' && !!part)
      .join(' ')
    if (nameParts) {
      return nameParts
    }
  }

  if (typeof currentOrder.customer === 'string' && currentOrder.customer) {
    return currentOrder.customer
  }

  if (currentOrder.user && typeof currentOrder.user.email === 'string') {
    return currentOrder.user.email
  }

  return t('pages.ecommercePayment.summary.customerFallback')
})

const itemCountLabel = computed(() => {
  const currentOrder = order.value
  const count = currentOrder?.totalQuantity ?? currentOrder?.items?.length ?? 0
  const pluralCategory = pluralRules.value.select(count)
  const baseKey = 'pages.ecommercePayment.summary.itemCount'
  const pluralizedKey = `${baseKey}.${pluralCategory}`

  if (te(pluralizedKey)) {
    return t(pluralizedKey, { count })
  }

  return t(`${baseKey}.other`, { count })
})

const paymentTitle = computed(() => {
  const index = activePaymentIndex.value >= 0 ? activePaymentIndex.value + 1 : 1
  return t('pages.ecommercePayment.labels.paymentTitle', { index })
})

const selectingDisabled = computed(
  () => updatingMethodCode.value !== null || anyLoading.value,
)

const selectMethod = async (option: PaymentMethodOption) => {
  if (!tokenValue.value || !activePaymentId.value) {
    return
  }

  if (selectingDisabled.value) {
    return
  }

  const nextIri = option.iri ?? buildMethodIri(option.code)
  if (!nextIri) {
    updateError.value = t('pages.ecommercePayment.notifications.updateFailed')
    return
  }

  updateError.value = null
  updateSuccess.value = null
  updatingMethodCode.value = option.code

  try {
    await $fetch(
      `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}/payments/${encodeURIComponent(activePaymentId.value)}`,
      {
        method: 'PATCH',
        body: { paymentMethod: nextIri },
        headers: {
          'Content-Type': 'application/json',
          ...(locale.value ? { 'Accept-Language': locale.value as string } : {}),
        },
      },
    )

    selectedMethodCode.value = option.code
    updateSuccess.value = t(
      'pages.ecommercePayment.notifications.updateSuccess',
    )

    await Promise.all([refreshOrder(), refreshPaymentConfiguration()])
  } catch (error) {
    updateError.value = resolveErrorMessage(
      error,
      t('pages.ecommercePayment.notifications.updateFailed'),
    )
    console.error('Failed to update payment method', error)
  } finally {
    updatingMethodCode.value = null
  }
}

const completingOrder = ref(false)
const completionError = ref<string | null>(null)
const completionSuccess = ref<string | null>(null)

const canProceed = computed(
  () =>
    Boolean(selectedMethodCode.value) &&
    !anyLoading.value &&
    updatingMethodCode.value === null &&
    !completingOrder.value,
)

const completeOrder = async () => {
  if (!tokenValue.value || !activePaymentId.value) {
    return
  }

  completionError.value = null
  completionSuccess.value = null
  completingOrder.value = true

  try {
    await $fetch(
      `/api/ecommerce/v2/shop/orders/${encodeURIComponent(tokenValue.value)}/complete`,
      {
        method: 'PATCH',
        body: {},
        headers: {
          'Content-Type': 'application/json',
          ...(locale.value ? { 'Accept-Language': locale.value as string } : {}),
        },
      },
    )

    completionSuccess.value = t(
      'pages.ecommercePayment.notifications.completeSuccess',
    )
    await refreshOrder()
  } catch (error) {
    completionError.value = resolveErrorMessage(
      error,
      t('pages.ecommercePayment.notifications.completeFailed'),
    )
    console.error('Failed to complete order', error)
  } finally {
    completingOrder.value = false
  }
}
</script>

<template>
  <v-container fluid class="ecommerce-payment">
    <v-row class="ecommerce-payment__content" align="stretch" no-gutters>
      <v-col cols="12" lg="8" class="pa-4">
        <div class="ecommerce-payment__primary">
          <nav aria-label="Checkout steps" class="payment-steps">
            <ol class="payment-steps__list">
              <li
                v-for="step in stepItems"
                :key="step.key"
                class="payment-steps__item"
                :class="`payment-steps__item--${step.status}`"
              >
                <span class="payment-steps__indicator">
                  <v-icon
                    v-if="step.status === 'complete'"
                    icon="mdi-check"
                    size="16"
                  />
                  <span v-else-if="step.status === 'current'">{{ paymentStepOrder.indexOf(step.key) + 1 }}</span>
                  <span v-else>{{ paymentStepOrder.indexOf(step.key) + 1 }}</span>
                </span>
                <span class="payment-steps__label">{{ step.label }}</span>
              </li>
            </ol>
          </nav>

          <AppCard class="payment-card" elevation="3">
            <div class="payment-card__header">
              <div>
                <p class="payment-card__subtitle text-body-2">
                  {{ t('pages.ecommercePayment.labels.paymentSubtitle') }}
                </p>
                <h2 class="payment-card__title">
                  {{ paymentTitle }}
                </h2>
              </div>
              <AppButton
                variant="text"
                size="small"
                class="payment-card__change-shipping"
                :disabled="true"
              >
                {{ t('pages.ecommercePayment.labels.changeShipping') }}
              </AppButton>
            </div>

            <div class="payment-card__body">
              <div v-if="loadErrorMessage" class="payment-card__alert">
                <v-alert type="error" :text="loadErrorMessage" density="comfortable" />
              </div>

              <div v-if="updateError" class="payment-card__alert">
                <v-alert type="error" :text="updateError" density="comfortable" />
              </div>

              <div v-if="updateSuccess" class="payment-card__alert">
                <v-alert type="success" :text="updateSuccess" density="comfortable" />
              </div>

              <div
                v-if="completionError"
                class="payment-card__alert"
              >
                <v-alert type="error" :text="completionError" density="comfortable" />
              </div>

              <div
                v-if="completionSuccess"
                class="payment-card__alert"
              >
                <v-alert type="success" :text="completionSuccess" density="comfortable" />
              </div>

              <div v-if="anyLoading" class="payment-card__loader">
                <v-progress-linear indeterminate color="primary" />
                <p class="payment-card__loader-text">
                  {{ t('pages.ecommercePayment.states.loading') }}
                </p>
              </div>

              <div
                v-else-if="paymentMethods.length === 0"
                class="payment-card__empty"
              >
                <v-icon icon="mdi-credit-card-off" size="24" class="mr-2" />
                <span>{{ t('pages.ecommercePayment.states.empty') }}</span>
              </div>

              <div v-else class="payment-methods" role="radiogroup">
                <button
                  v-for="method in paymentMethods"
                  :key="method.key"
                  class="payment-method"
                  type="button"
                  role="radio"
                  :aria-checked="selectedMethodCode === method.code"
                  :class="{
                    'payment-method--selected': selectedMethodCode === method.code,
                    'payment-method--disabled': selectingDisabled,
                  }"
                  :disabled="selectingDisabled"
                  @click="selectMethod(method)"
                >
                  <div class="payment-method__indicator">
                    <span class="payment-method__radio">
                      <span class="payment-method__radio-inner" />
                    </span>
                  </div>
                  <div class="payment-method__content">
                    <div class="payment-method__header">
                      <span class="payment-method__label">{{ method.label }}</span>
                      <span v-if="updatingMethodCode === method.code" class="payment-method__pending">
                        <v-progress-circular indeterminate size="16" width="2" />
                      </span>
                    </div>
                    <p v-if="method.description" class="payment-method__description">
                      {{ method.description }}
                    </p>
                    <p v-if="method.instructions" class="payment-method__instructions">
                      {{ method.instructions }}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div class="payment-card__footer">
              <div class="payment-card__hint">
                <span v-if="!selectedMethodCode">
                  {{ t('pages.ecommercePayment.labels.noSelection') }}
                </span>
              </div>
              <AppButton
                color="primary"
                class="payment-card__submit"
                :loading="completingOrder"
                :disabled="!canProceed"
                @click="completeOrder"
              >
                {{ t('pages.ecommercePayment.actions.next') }}
              </AppButton>
            </div>
          </AppCard>
        </div>
      </v-col>

      <v-col cols="12" lg="4" class="pa-4">
        <AppCard class="payment-summary" elevation="2">
          <div class="payment-summary__header">
            <h3 class="payment-summary__title">
              {{ t('pages.ecommercePayment.summary.title') }}
            </h3>
            <p class="payment-summary__customer text-body-2">
              {{ customerName }}
            </p>
            <p class="payment-summary__item-count text-caption">
              {{ itemCountLabel }}
            </p>
          </div>

          <v-divider class="my-4" />

          <ul class="payment-summary__list">
            <li v-for="item in summaryItems" :key="item.key" class="payment-summary__item">
              <span>{{ item.label }}</span>
              <span>{{ formatCurrency(item.amount ?? 0) }}</span>
            </li>
          </ul>

          <v-divider class="my-4" />

          <div class="payment-summary__total">
            <span>{{ t('pages.ecommercePayment.summary.total') }}</span>
            <span>{{ formatCurrency(orderTotal) }}</span>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.ecommerce-payment {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(132, 94, 247, 0.12), rgba(45, 197, 253, 0.1));
}

.ecommerce-payment__content {
  max-width: 1200px;
  margin: 0 auto;
}

.ecommerce-payment__primary {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.payment-steps {
  padding: 16px 24px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
}

.payment-steps__list {
  display: flex;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.payment-steps__item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(18, 24, 38, 0.6);
  font-weight: 500;
}

.payment-steps__item--complete {
  color: rgb(var(--v-theme-primary));
}

.payment-steps__item--current {
  color: rgb(var(--v-theme-on-surface));
}

.payment-steps__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(132, 94, 247, 0.15);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.payment-steps__item--complete .payment-steps__indicator {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.payment-card {
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(244, 247, 255, 0.9));
}

.payment-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.payment-card__subtitle {
  margin: 0 0 4px;
  color: rgba(18, 24, 38, 0.6);
}

.payment-card__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.payment-card__change-shipping {
  margin-left: auto;
  text-transform: none;
}

.payment-card__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-card__alert {
  width: 100%;
}

.payment-card__loader {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.6);
}

.payment-card__loader-text {
  margin: 0;
  color: rgba(18, 24, 38, 0.6);
  font-weight: 500;
}

.payment-card__empty {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.6);
  color: rgba(18, 24, 38, 0.6);
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-method {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  padding: 20px 24px;
  border-radius: 20px;
  border: 1px solid rgba(132, 94, 247, 0.15);
  background: white;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.payment-method:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.payment-method:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(132, 94, 247, 0.12);
}

.payment-method--selected {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 16px 32px rgba(132, 94, 247, 0.18);
}

.payment-method--disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.payment-method__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 6px;
}

.payment-method__radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(132, 94, 247, 0.5);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.payment-method--selected .payment-method__radio {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(132, 94, 247, 0.1);
}

.payment-method__radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.payment-method--selected .payment-method__radio-inner {
  background-color: rgb(var(--v-theme-primary));
  transform: scale(1);
}

.payment-method__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment-method__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-method__label {
  font-size: 1.05rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.payment-method__pending {
  display: inline-flex;
  align-items: center;
}

.payment-method__description,
.payment-method__instructions {
  margin: 0;
  color: rgba(18, 24, 38, 0.68);
  line-height: 1.45;
}

.payment-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.payment-card__hint {
  color: rgba(18, 24, 38, 0.6);
  font-size: 0.9rem;
}

.payment-summary {
  padding: 28px;
  border-radius: 24px;
  background: white;
  position: sticky;
  top: 32px;
}

.payment-summary__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-summary__title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.payment-summary__customer {
  margin: 0;
  color: rgba(18, 24, 38, 0.75);
}

.payment-summary__item-count {
  margin: 0;
  color: rgba(18, 24, 38, 0.6);
}

.payment-summary__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-summary__item {
  display: flex;
  justify-content: space-between;
  color: rgba(18, 24, 38, 0.75);
}

.payment-summary__total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1rem;
}

@media (max-width: 960px) {
  .payment-card,
  .payment-summary {
    padding: 24px;
    border-radius: 18px;
  }

  .payment-steps__list {
    flex-wrap: wrap;
    gap: 16px;
  }

  .payment-card__footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .payment-card__hint {
    text-align: center;
  }
}
</style>
