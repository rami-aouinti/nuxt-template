<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.shipments',
  icon: 'mdi-truck-delivery-outline',
  drawerIndex: 7,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.shipments.table.number'),
    key: 'number',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.shipments.table.order'),
    key: 'orderNumber',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.shipments.table.method'),
    key: 'method',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.shipments.table.state'),
    key: 'state',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.shipments.table.tracking'),
    key: 'tracking',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.shipments.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 200,
  },
])

const search = ref('')
const dateFormatter = createDateFormatter(locale)

const {
  data: rawShipments,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/shipments', {
  key: 'admin-ecommerce-shipments-table',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
    'order[createdAt]': 'desc',
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawShipments.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const number =
      getString(record, ['number', 'id', '@id']) ?? `shipment-${index + 1}`
    const orderRecord = toRecord(record?.order)
    const orderNumber =
      getString(orderRecord, ['number', 'tokenValue']) ??
      t('admin.ecommerce.common.unknownOrder')
    const methodRecord = toRecord(record?.method)
    const method =
      resolveLocalizedString(methodRecord, locale, ['name']) ??
      getString(methodRecord, ['code']) ??
      t('admin.ecommerce.common.none')
    const state =
      getString(record, ['state', 'status']) ??
      t('admin.ecommerce.common.unknownState')
    const tracking =
      getString(record, ['tracking', 'trackingCode', 'trackingNumber']) ||
      t('admin.ecommerce.shipments.table.noTracking')
    const updatedAt = formatDateValue(
      safeDate(record?.updatedAt) ?? safeDate(record?.updated_at),
      dateFormatter.value,
      '—',
    )

    return {
      number,
      orderNumber,
      method,
      state,
      tracking,
      updatedAt,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.number, row.orderNumber, row.method, row.state, row.tracking]
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
    :title="t('admin.ecommerce.shipments.title')"
    :subtitle="t('admin.ecommerce.shipments.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
