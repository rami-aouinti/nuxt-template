<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import type { OrderJsonLdSyliusShopOrderAccountShow } from '~/types/order'

const ORDERS_ENDPOINT = '/api/ecommerce/v2/shop/orders'

function resolveOrderDetailsEndpoint(token: string) {
  return `/api/ecommerce/v2/shop/orders/${encodeURIComponent(token)}`
}

function resolvePaymentConfigurationEndpoint(token: string, paymentId: string) {
  return `/api/ecommerce/v2/shop/orders/${encodeURIComponent(token)}/payments/${encodeURIComponent(paymentId)}/configuration`
}

definePageMeta({
  title: 'navigation.profileOrders',
  middleware: 'auth',
})

const { t, locale } = useI18n()

interface EcommerceOrderCollectionResponse {
  'hydra:member'?: Array<Record<string, unknown>>
  'hydra:totalItems'?: number | string
}

interface EcommerceOrderListItem {
  id: string
  number: string
  createdAt: Date | null
  totalCents: number | null
  currency: string
  stateKey: string | null
  rawState: string
  tokenValue: string | null
  paymentId: string | null
  shipTo: string
}

interface OrderDetailsState {
  open: boolean
  loading: boolean
  error: string | null
  order: OrderJsonLdSyliusShopOrderAccountShow | null
}

const currencyFormatters = new Map<string, Intl.NumberFormat>()

const {
  data: ordersResponse,
  pending,
  error,
  refresh,
} = await useAsyncData<EcommerceOrderCollectionResponse>(
  'profile-ecommerce-orders',
  async () => await $fetch<EcommerceOrderCollectionResponse>(ORDERS_ENDPOINT),
  { server: true },
)

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })
const dateTimeFormatter = createDateFormatter(locale, {
  dateStyle: 'long',
  timeStyle: 'short',
})

const detailsState = reactive<OrderDetailsState>({
  open: false,
  loading: false,
  error: null,
  order: null,
})

const paymentLoading = reactive<Record<string, boolean>>({})

const orders = computed<EcommerceOrderListItem[]>(() => {
  const members = ordersResponse.value?.['hydra:member']
  if (!Array.isArray(members)) {
    return []
  }

  return members
    .map((record, index) => mapOrderRecord(record, index))
    .filter((item): item is EcommerceOrderListItem => item !== null)
})

const totalOrders = computed(() => {
  const total = ensureNumber(ordersResponse.value?.['hydra:totalItems'])
  return total ?? orders.value.length
})

const loadErrorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  return extractRequestError(
    error.value,
    t('profile.orders.notifications.loadFailed'),
  )
})

const hasOrders = computed(() => orders.value.length > 0)
const isLoading = computed(() => pending.value)

const selectedOrderSummary = computed(() => {
  const order = detailsState.order
  if (!order) {
    return null
  }

  const stateKey = ensureString(order.state)?.toLowerCase() ?? null

  return {
    number: ensureString(order.number) ?? '—',
    tokenValue: ensureString(order.tokenValue),
    createdAt:
      ensureDate(order.checkoutCompletedAt) ?? ensureDate(order.createdAt),
    updatedAt: ensureDate(order.updatedAt),
    totalCents: ensureNumber(order.total),
    itemsTotal: ensureNumber(order.itemsTotal),
    shippingTotal: ensureNumber(order.shippingTotal),
    taxTotal: ensureNumber(order.taxTotal),
    currency: ensureString(order.currencyCode) ?? 'USD',
    stateKey,
    rawState: ensureString(order.state) ?? '',
    stateLabel: getStateLabel(stateKey, ensureString(order.state) ?? ''),
    customer: extractCustomerName(order) ?? t('profile.orders.labels.shipToUnknown'),
    customerEmail:
      ensureString(order.customerWithAuthorization?.email) ??
      ensureString(order.customerWithAuthorization?.emailCanonical) ??
      ensureString(order.user?.email) ??
      null,
    customerPhone:
      ensureString(order.customerWithAuthorization?.phoneNumber) ?? null,
    shippingAddress: extractAddress(order.shippingAddress),
    billingAddress: extractAddress(order.billingAddress),
  }
})

watch(
  () => error.value,
  (value) => {
    if (!value || !import.meta.client) return
    const message = extractRequestError(
      value,
      t('profile.orders.notifications.loadFailed'),
    )
    Notify.error(message)
  },
)

watch(
  () => locale.value,
  () => {
    currencyFormatters.clear()
    if (import.meta.client) {
      refresh()
    }
  },
)

function ensureString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return null
}

function ensureNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function ensureDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

function extractRequestError(error: unknown, fallback: string): string {
  if (error instanceof FetchError) {
    const data = error.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && typeof error.message === 'string') {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

function extractCustomerName(record: Record<string, unknown>): string | null {
  const customer = record['customerWithAuthorization']
  if (customer && typeof customer === 'object') {
    const customerRecord = customer as Record<string, unknown>
    const fullName = ensureString(customerRecord.fullName)
    if (fullName) {
      return fullName
    }

    const firstName = ensureString(customerRecord.firstName)
    const lastName = ensureString(customerRecord.lastName)
    const combined = [firstName, lastName].filter(Boolean).join(' ')
    if (combined) {
      return combined
    }
  }

  const user = record['user']
  if (user && typeof user === 'object') {
    const userRecord = user as Record<string, unknown>
    const fullName = ensureString(userRecord.fullName)
    if (fullName) {
      return fullName
    }

    const username = ensureString(userRecord.username)
    if (username) {
      return username
    }
  }

  return null
}

function extractAddress(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return ensureString(value)
  }

  const record = value as Record<string, unknown>
  const parts: string[] = []

  const name = extractNameFromRecord(record)
  if (name) {
    parts.push(name)
  }

  const street = ensureString(record['street'])
  if (street) {
    parts.push(street)
  }

  const city = ensureString(record['city'])
  const postcode = ensureString(record['postcode'])
  const citySegment = [postcode, city].filter(Boolean).join(' ')
  if (citySegment) {
    parts.push(citySegment)
  }

  const province =
    ensureString(record['provinceName']) ?? ensureString(record['provinceCode'])
  const country = ensureString(record['countryCode'])
  const region = [province, country].filter(Boolean).join(', ')
  if (region) {
    parts.push(region)
  }

  if (parts.length === 0) {
    return null
  }

  return parts.join(', ')
}

function extractNameFromRecord(record: Record<string, unknown>): string | null {
  const fullName = ensureString(record['fullName'])
  if (fullName) {
    return fullName
  }

  const firstName = ensureString(record['firstName'])
  const lastName = ensureString(record['lastName'])
  const combined = [firstName, lastName].filter(Boolean).join(' ')
  if (combined) {
    return combined
  }

  return ensureString(record['name'])
}

function extractPaymentIdFromValue(value: unknown): string | null {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    const segments = value.split('/')
    const last = segments.pop()
    return last && last.length > 0 ? last : null
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const id = ensureString(record['id'])
    if (id) {
      return id
    }

    const iri = ensureString(record['@id'])
    if (iri) {
      return extractPaymentIdFromValue(iri)
    }
  }

  return null
}

function extractPaymentId(record: Record<string, unknown>): string | null {
  const payments = record['payments']
  if (Array.isArray(payments)) {
    for (const payment of payments) {
      const id = extractPaymentIdFromValue(payment)
      if (id) {
        return id
      }
    }
  }

  const paymentCollection = record['payment']
  if (Array.isArray(paymentCollection)) {
    for (const payment of paymentCollection) {
      const id = extractPaymentIdFromValue(payment)
      if (id) {
        return id
      }
    }
  }

  const lastPayment = record['lastPayment']
  const lastPaymentId = extractPaymentIdFromValue(lastPayment)
  if (lastPaymentId) {
    return lastPaymentId
  }

  return null
}

function extractShipTo(record: Record<string, unknown>): string {
  const shippingAddress = record['shippingAddress']
  if (shippingAddress && typeof shippingAddress === 'object') {
    const name = extractNameFromRecord(
      shippingAddress as Record<string, unknown>,
    )
    if (name) {
      return name
    }
  }

  const customerName = extractCustomerName(record)
  if (customerName) {
    return customerName
  }

  return t('profile.orders.labels.shipToUnknown')
}

function mapOrderRecord(
  record: Record<string, unknown>,
  index: number,
): EcommerceOrderListItem | null {
  const id =
    ensureString(record['@id']) ?? ensureString(record['id']) ?? `order-${index}`
  const number =
    ensureString(record['number']) ?? `#${String(index + 1).padStart(6, '0')}`
  const createdAt =
    ensureDate(record['checkoutCompletedAt']) ?? ensureDate(record['createdAt'])
  const totalCents = ensureNumber(record['total'])
  const currency = ensureString(record['currencyCode']) ?? 'USD'
  const state = ensureString(record['state']) ?? ''
  const tokenValue = ensureString(record['tokenValue'])
  const paymentId = extractPaymentId(record)
  const shipTo = extractShipTo(record)

  return {
    id,
    number,
    createdAt,
    totalCents,
    currency,
    stateKey: state ? state.toLowerCase() : null,
    rawState: state,
    tokenValue,
    paymentId,
    shipTo,
  }
}

function getStateLabel(stateKey: string | null, fallback: string): string {
  if (stateKey) {
    const key = stateKey.replace(/[^a-z_-]/g, '')
    const translationKey = `profile.orders.states.${key}`
    const translated = t(translationKey)
    if (translated !== translationKey) {
      return translated
    }
  }

  if (fallback) {
    return fallback
  }

  return t('profile.orders.states.unknown')
}

function formatOrderDate(date: Date | null): string {
  if (!date) {
    return '—'
  }

  return formatDateValue(date, dateFormatter.value, '—')
}

function formatOrderDateTime(date: Date | null): string {
  if (!date) {
    return '—'
  }

  return formatDateValue(date, dateTimeFormatter.value, '—')
}

function formatOrderTotal(amount: number | null, currency: string): string {
  if (amount == null) {
    return '—'
  }

  const normalizedCurrency = currency || 'USD'
  const key = `${locale.value || 'en'}-${normalizedCurrency}`
  let formatter = currencyFormatters.get(key)
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale.value || 'en', {
        style: 'currency',
        currency: normalizedCurrency,
      })
    } catch {
      formatter = new Intl.NumberFormat(locale.value || 'en', {
        style: 'currency',
        currency: 'USD',
      })
    }
    currencyFormatters.set(key, formatter)
  }

  return formatter.format(amount / 100)
}

function isPaymentLoading(id: string): boolean {
  return Boolean(paymentLoading[id])
}

function setPaymentLoading(id: string, value: boolean) {
  paymentLoading[id] = value
}

async function handleRefresh() {
  await refresh()
}

async function openOrderDetails(order: EcommerceOrderListItem) {
  if (!order.tokenValue) {
    Notify.error(t('profile.orders.notifications.detailsLoadFailed'))
    return
  }

  detailsState.open = true
  detailsState.loading = true
  detailsState.error = null
  detailsState.order = null

  try {
    const response = await $fetch<OrderJsonLdSyliusShopOrderAccountShow>(
      resolveOrderDetailsEndpoint(order.tokenValue),
    )
    detailsState.order = response
  } catch (err) {
    const message = extractRequestError(
      err,
      t('profile.orders.notifications.detailsLoadFailed'),
    )
    detailsState.error = message
    if (import.meta.client) {
      Notify.error(message)
    }
  } finally {
    detailsState.loading = false
  }
}

function closeOrderDetails() {
  detailsState.open = false
}

function extractNestedUrl(record: Record<string, unknown>): string | null {
  const potentialKeys = ['redirectUrl', 'redirectURL', 'redirect_uri', 'url', 'paymentUrl']

  for (const key of potentialKeys) {
    const value = record[key]
    const url = ensureString(value)
    if (url && /^https?:\/\//i.test(url)) {
      return url
    }
  }

  const data = record['data']
  if (data && typeof data === 'object') {
    const nested = extractNestedUrl(data as Record<string, unknown>)
    if (nested) {
      return nested
    }
  }

  const options = record['options']
  if (options && typeof options === 'object') {
    const nested = extractNestedUrl(options as Record<string, unknown>)
    if (nested) {
      return nested
    }
  }

  return null
}

async function handlePay(order: EcommerceOrderListItem) {
  if (!order.tokenValue || !order.paymentId) {
    Notify.warning(t('profile.orders.notifications.paymentConfigMissing'))
    return
  }

  const endpoint = resolvePaymentConfigurationEndpoint(
    order.tokenValue,
    order.paymentId,
  )

  setPaymentLoading(order.id, true)

  try {
    const configuration = await $fetch<Record<string, unknown>>(endpoint)
    const url =
      (configuration && typeof configuration === 'string'
        ? ensureString(configuration)
        : null) ??
      (configuration && typeof configuration === 'object'
        ? extractNestedUrl(configuration)
        : null)

    if (url && import.meta.client) {
      window.open(url, '_blank', 'noopener')
    } else {
      Notify.warning(t('profile.orders.notifications.paymentConfigMissing'))
    }
  } catch (err) {
    const message = extractRequestError(
      err,
      t('profile.orders.notifications.paymentOpenFailed'),
    )
    if (import.meta.client) {
      Notify.error(message)
    }
  } finally {
    setPaymentLoading(order.id, false)
  }
}
</script>

<template>
  <ProfilePageShell>
    <section class="profile-orders">
      <header class="profile-orders__header">
        <div>
          <p class="profile-orders__eyebrow">
            {{ t('navigation.profile') }}
          </p>
          <h1 class="profile-orders__title">
            {{ t('profile.orders.page.title') }}
          </h1>
          <p class="profile-orders__subtitle">
            {{ t('profile.orders.page.subtitle') }}
          </p>
        </div>
        <AppButton
          color="primary"
          variant="tonal"
          :loading="isLoading"
          @click="handleRefresh"
        >
          {{ t('profile.orders.actions.refresh') }}
        </AppButton>
      </header>

      <AppCard class="profile-orders__card" :loading="isLoading">
        <template #title>
          <div class="profile-orders__card-title">
            <span>{{ t('profile.orders.page.title') }}</span>
            <v-chip
              v-if="totalOrders > 0"
              size="small"
              color="primary"
              variant="tonal"
            >
              {{ totalOrders }}
            </v-chip>
          </div>
        </template>
        <template #subtitle>
          {{ t('profile.orders.page.subtitle') }}
        </template>

        <div v-if="loadErrorMessage" class="profile-orders__state">
          <p class="profile-orders__state-message">
            {{ loadErrorMessage }}
          </p>
          <AppButton color="primary" variant="tonal" @click="handleRefresh">
            {{ t('profile.orders.actions.retry') }}
          </AppButton>
        </div>

        <div v-else-if="!hasOrders" class="profile-orders__state">
          <p class="profile-orders__state-message">
            {{ t('profile.orders.table.empty') }}
          </p>
        </div>

        <div v-else class="profile-orders__table">
          <v-table class="profile-orders-table" density="comfortable">
            <thead>
              <tr>
                <th scope="col">
                  {{ t('profile.orders.table.number') }}
                </th>
                <th scope="col">
                  {{ t('profile.orders.table.date') }}
                </th>
                <th scope="col">
                  {{ t('profile.orders.table.shipTo') }}
                </th>
                <th scope="col" class="profile-orders-table__numeric">
                  {{ t('profile.orders.table.total') }}
                </th>
                <th scope="col">
                  {{ t('profile.orders.table.state') }}
                </th>
                <th scope="col">
                  {{ t('profile.orders.table.actions') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>
                  <span class="profile-orders-table__number">
                    {{ order.number }}
                  </span>
                </td>
                <td>
                  {{ formatOrderDate(order.createdAt) }}
                </td>
                <td>
                  {{ order.shipTo }}
                </td>
                <td class="profile-orders-table__numeric">
                  {{ formatOrderTotal(order.totalCents, order.currency) }}
                </td>
                <td>
                  <v-chip size="small" variant="tonal" color="primary">
                    {{ getStateLabel(order.stateKey, order.rawState) }}
                  </v-chip>
                </td>
                <td class="profile-orders-table__actions">
                  <AppButton
                    size="small"
                    variant="text"
                    :disabled="!order.tokenValue"
                    @click="openOrderDetails(order)"
                  >
                    {{ t('profile.orders.actions.show') }}
                  </AppButton>
                  <AppButton
                    size="small"
                    color="primary"
                    variant="tonal"
                    :loading="isPaymentLoading(order.id)"
                    :disabled="!order.tokenValue || !order.paymentId"
                    @click="handlePay(order)"
                  >
                    {{ t('profile.orders.actions.pay') }}
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </AppCard>
    </section>

    <v-dialog v-model="detailsState.open" max-width="720">
      <AppCard
        class="profile-order-details"
        variant="flat"
        :loading="detailsState.loading"
      >
        <template #title>
          <div class="profile-order-details__header">
            <div>
              <p class="profile-order-details__eyebrow">
                {{ t('profile.orders.details.title') }}
              </p>
              <h2 class="profile-order-details__title">
                {{ selectedOrderSummary?.number ?? '—' }}
              </h2>
            </div>
            <v-chip
              v-if="selectedOrderSummary"
              size="small"
              variant="flat"
              color="primary"
            >
              {{ selectedOrderSummary.stateLabel }}
            </v-chip>
          </div>
        </template>
        <template #actions>
          <AppButton variant="text" @click="closeOrderDetails">
            {{ t('common.actions.close') }}
          </AppButton>
        </template>

        <div v-if="detailsState.error" class="profile-order-details__state">
          <p class="profile-order-details__state-message">
            {{ detailsState.error }}
          </p>
        </div>
        <div v-else-if="selectedOrderSummary" class="profile-order-details__content">
          <dl class="profile-order-details__meta">
            <div>
              <dt>{{ t('profile.orders.details.placedOn') }}</dt>
              <dd>{{ formatOrderDateTime(selectedOrderSummary.createdAt) }}</dd>
            </div>
            <div>
              <dt>{{ t('profile.orders.details.updatedAt') }}</dt>
              <dd>{{ formatOrderDateTime(selectedOrderSummary.updatedAt) }}</dd>
            </div>
          </dl>

          <div class="profile-order-details__totals">
            <div>
              <span class="profile-order-details__totals-label">
                {{ t('profile.orders.details.itemsTotal') }}
              </span>
              <span>
                {{
                  formatOrderTotal(
                    selectedOrderSummary.itemsTotal,
                    selectedOrderSummary.currency,
                  )
                }}
              </span>
            </div>
            <div>
              <span class="profile-order-details__totals-label">
                {{ t('profile.orders.details.shippingTotal') }}
              </span>
              <span>
                {{
                  formatOrderTotal(
                    selectedOrderSummary.shippingTotal,
                    selectedOrderSummary.currency,
                  )
                }}
              </span>
            </div>
            <div>
              <span class="profile-order-details__totals-label">
                {{ t('profile.orders.details.taxTotal') }}
              </span>
              <span>
                {{
                  formatOrderTotal(
                    selectedOrderSummary.taxTotal,
                    selectedOrderSummary.currency,
                  )
                }}
              </span>
            </div>
            <div>
              <span class="profile-order-details__totals-label">
                {{ t('profile.orders.details.total') }}
              </span>
              <span>
                {{
                  formatOrderTotal(
                    selectedOrderSummary.totalCents,
                    selectedOrderSummary.currency,
                  )
                }}
              </span>
            </div>
          </div>

          <div class="profile-order-details__section">
            <h3>{{ t('profile.orders.details.customer') }}</h3>
            <p>{{ selectedOrderSummary.customer }}</p>
            <p v-if="selectedOrderSummary.customerEmail">
              <strong>{{ t('profile.orders.details.email') }}:</strong>
              {{ selectedOrderSummary.customerEmail }}
            </p>
            <p v-if="selectedOrderSummary.customerPhone">
              <strong>{{ t('profile.orders.details.phone') }}:</strong>
              {{ selectedOrderSummary.customerPhone }}
            </p>
          </div>

          <div class="profile-order-details__section profile-order-details__addresses">
            <div>
              <h3>{{ t('profile.orders.details.shippingAddress') }}</h3>
              <p>
                {{
                  selectedOrderSummary.shippingAddress ??
                    t('profile.orders.details.addressUnavailable')
                }}
              </p>
            </div>
            <div>
              <h3>{{ t('profile.orders.details.billingAddress') }}</h3>
              <p>
                {{
                  selectedOrderSummary.billingAddress ??
                    t('profile.orders.details.addressUnavailable')
                }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="profile-order-details__state">
          <p class="profile-order-details__state-message">
            {{ t('profile.orders.details.loading') }}
          </p>
        </div>
      </AppCard>
    </v-dialog>
  </ProfilePageShell>
</template>

<style scoped>
.profile-orders {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-orders__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.profile-orders__eyebrow {
  margin: 0 0 4px;
  color: rgba(var(--v-theme-primary), 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.profile-orders__title {
  margin: 0;
  font-size: clamp(1.75rem, 2vw + 1rem, 2.25rem);
  font-weight: 700;
}

.profile-orders__subtitle {
  margin: 4px 0 0;
  color: rgba(var(--v-theme-on-surface), 0.7);
  max-width: 520px;
}

.profile-orders__card {
  padding: 8px 0 0;
}

.profile-orders__card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1.05rem;
}

.profile-orders__state {
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.profile-orders__state-message {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.68);
}

.profile-orders__table {
  overflow-x: auto;
}

.profile-orders-table {
  min-width: 720px;
}

.profile-orders-table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.profile-orders-table td {
  vertical-align: middle;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.profile-orders-table__numeric {
  text-align: right;
  white-space: nowrap;
}

.profile-orders-table__number {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.profile-orders-table__actions {
  display: flex;
  gap: 8px;
}

.profile-order-details__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.profile-order-details__eyebrow {
  margin: 0 0 4px;
  color: rgba(var(--v-theme-primary), 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.profile-order-details__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.profile-order-details__state {
  padding: 32px 24px;
  text-align: center;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.profile-order-details__state-message {
  margin: 0;
}

.profile-order-details__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-order-details__meta {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 0;
}

.profile-order-details__meta dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.profile-order-details__meta dd {
  margin: 0;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.profile-order-details__totals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 16px;
  border-radius: var(--app-rounded, 16px);
  background: rgba(var(--v-theme-primary), 0.06);
}

.profile-order-details__totals-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 4px;
}

.profile-order-details__section h3 {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
}

.profile-order-details__section p {
  margin: 4px 0;
  color: rgba(var(--v-theme-on-surface), 0.78);
}

.profile-order-details__addresses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

@media (max-width: 600px) {
  .profile-orders-table {
    min-width: 100%;
  }

  .profile-orders-table th,
  .profile-orders-table td {
    padding-inline: 12px !important;
  }
}
</style>
