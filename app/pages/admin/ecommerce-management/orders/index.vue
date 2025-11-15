<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getArray,
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.orders',
  icon: 'mdi-receipt-text-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.orders.table.number'),
    key: 'number',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.orders.table.customer'),
    key: 'customer',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.orders.table.channel'),
    key: 'channel',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.orders.table.state'),
    key: 'state',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.orders.table.paymentState'),
    key: 'paymentState',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.orders.table.shippingState'),
    key: 'shippingState',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.orders.table.total'),
    key: 'total',
    align: 'end',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.orders.table.placedAt'),
    key: 'placedAt',
    minWidth: 200,
  },
])

const search = ref('')
const dateFormatter = createDateFormatter(locale)

const formatCurrency = (amount: number, currencyCode?: string | null) => {
  const code =
    currencyCode && currencyCode.trim().length > 0 ? currencyCode : 'USD'
  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: code,
    }).format(amount)
  } catch (_error) {
    return `${amount.toFixed(2)} ${code}`
  }
}

const {
  data: rawOrders,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/orders', {
  key: 'admin-ecommerce-orders-table',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
    'order[createdAt]': 'desc',
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawOrders.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const number =
      getString(record, ['number', 'tokenValue', 'code']) ??
      `order-${index + 1}`
    const customerRecord = toRecord(record?.customer)
    const channelRecord = toRecord(record?.channel)
    const payments = getArray(record, ['payments'])
    const currency =
      getString(record, ['currencyCode', 'currency', 'currency_code']) ?? 'USD'

    const customer =
      getString(customerRecord, [
        'fullName',
        'firstName',
        'email',
        'username',
      ]) ?? t('admin.ecommerce.common.unknownCustomer')
    const channel =
      resolveLocalizedString(channelRecord, locale, ['name', 'code']) ??
      t('admin.ecommerce.common.defaultChannel')
    const state =
      getString(record, ['state', 'status']) ??
      t('admin.ecommerce.common.unknownState')
    const paymentState =
      getString(record, ['paymentState', 'payment_state']) ??
      t('admin.ecommerce.common.unknownState')
    const shippingState =
      getString(record, ['shippingState', 'shipping_state']) ??
      t('admin.ecommerce.common.unknownState')
    const total = formatCurrency(
      getNumber(record, ['total', 'totalAmount']),
      currency,
    )
    const placedAt = formatDateValue(
      safeDate(record?.createdAt) ?? safeDate(record?.created_at),
      dateFormatter.value,
      '—',
    )
    const paymentMethods = payments
      .map((payment) => {
        const paymentRecord = toRecord(payment)
        return (
          resolveLocalizedString(paymentRecord, locale, ['name', 'method']) ??
          getString(paymentRecord, ['method', 'state']) ??
          null
        )
      })
      .filter((value): value is string => Boolean(value))
      .join(', ')

    return {
      number,
      customer,
      channel,
      state,
      paymentState,
      shippingState,
      total,
      placedAt,
      paymentMethods,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [
      row.number,
      row.customer,
      row.channel,
      row.state,
      row.paymentState,
      row.shippingState,
      row.paymentMethods,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term)),
  )
})

const errorMessage = computed(() => {
  if (!error.value) {
    return null
  }
  const err = error.value as { data?: { message?: string }; message?: string }
  return err?.data?.message || err?.message || t('common.unexpectedError')
})
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :title="t('admin.ecommerce.orders.title')"
    :subtitle="t('admin.ecommerce.orders.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
