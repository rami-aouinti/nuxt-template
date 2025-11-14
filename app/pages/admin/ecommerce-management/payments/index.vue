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
  title: 'admin.ecommerce.navigation.payments',
  icon: 'mdi-credit-card-outline',
  drawerIndex: 8,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.payments.table.order'),
    key: 'orderNumber',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.payments.table.customer'),
    key: 'customer',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.payments.table.method'),
    key: 'method',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.payments.table.state'),
    key: 'state',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.payments.table.amount'),
    key: 'amount',
    align: 'end',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.payments.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 200,
  },
])

const search = ref('')
const dateFormatter = createDateFormatter(locale)

const formatCurrency = (amount: number, currencyCode?: string | null) => {
  const code = currencyCode && currencyCode.trim().length > 0 ? currencyCode : 'USD'
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
  key: 'admin-ecommerce-payments',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
    'order[createdAt]': 'desc',
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawOrders.value)

  return entries.flatMap((entry, index) => {
    const record = toRecord(entry)
    const orderNumber =
      getString(record, ['number', 'tokenValue', 'code']) ??
      `order-${index + 1}`
    const customerRecord = toRecord(record?.customer)
    const customer =
      getString(customerRecord, [
        'fullName',
        'firstName',
        'email',
        'username',
      ]) ?? t('admin.ecommerce.common.unknownCustomer')
    const currency =
      getString(record, ['currencyCode', 'currency', 'currency_code']) ?? 'USD'
    const payments = getArray(record, ['payments'])

    if (!payments.length) {
      return [
        {
          orderNumber,
          customer,
          method: t('admin.ecommerce.payments.table.noPayments'),
          state: t('admin.ecommerce.common.none'),
          amount: formatCurrency(0, currency),
          updatedAt: formatDateValue(
            safeDate(record?.updatedAt) ?? safeDate(record?.updated_at),
            dateFormatter.value,
            '—',
          ),
        },
      ]
    }

    return payments.map((payment, paymentIndex) => {
      const paymentRecord = toRecord(payment)
      const method =
        resolveLocalizedString(paymentRecord, locale, ['name', 'method']) ??
        getString(paymentRecord, ['method']) ??
        t('admin.ecommerce.common.none')
      const state =
        getString(paymentRecord, ['state']) ??
        t('admin.ecommerce.common.unknownState')
      const amount = formatCurrency(
        getNumber(paymentRecord, ['amount']),
        getString(paymentRecord, ['currencyCode']) ?? currency,
      )
      const updatedAt = formatDateValue(
        safeDate(paymentRecord?.updatedAt) ?? safeDate(paymentRecord?.updated_at),
        dateFormatter.value,
        '—',
      )

      return {
        orderNumber,
        customer,
        method,
        state,
        amount,
        updatedAt,
        index: paymentIndex,
      }
    })
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.orderNumber, row.customer, row.method, row.state]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term)),
  )
})

const errorMessage = computed(() => {
  if (!error.value) {
    return null
  }
  const err = error.value as { data?: { message?: string }; message?: string }
  return (
    err?.data?.message || err?.message || t('common.unexpectedError')
  )
})
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :title="t('admin.ecommerce.payments.title')"
    :subtitle="t('admin.ecommerce.payments.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
