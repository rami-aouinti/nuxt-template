<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createNumberFormatter, formatNumberValue } from '~/utils/formatters'
import {
  getBoolean,
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.taxRates',
  icon: 'mdi-percent-outline',
  drawerIndex: 8,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  { title: t('admin.ecommerce.configuration.taxRates.table.name'), key: 'name', minWidth: 220 },
  { title: t('admin.ecommerce.configuration.taxRates.table.code'), key: 'code', minWidth: 140 },
  { title: t('admin.ecommerce.configuration.taxRates.table.category'), key: 'category', minWidth: 200 },
  { title: t('admin.ecommerce.configuration.taxRates.table.zone'), key: 'zone', minWidth: 200 },
  {
    title: t('admin.ecommerce.configuration.taxRates.table.amount'),
    key: 'amount',
    minWidth: 140,
    align: 'end',
  },
  {
    title: t('admin.ecommerce.configuration.taxRates.table.includedInPrice'),
    key: 'includedInPrice',
    align: 'center',
    width: 180,
  },
])

const search = ref('')

const percentFormatter = createNumberFormatter(locale, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const {
  data: rawTaxRates,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/tax-rates', {
  key: 'admin-ecommerce-configuration-tax-rates',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawTaxRates.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code = getString(record, ['code', 'id', '@id']) ?? `tax-rate-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name']) ??
      getString(record, ['name']) ??
      code

    const zoneRecord = toRecord(record?.zone)
    const zone =
      resolveLocalizedString(zoneRecord, locale, ['name']) ??
      getString(zoneRecord, ['code']) ??
      t('admin.ecommerce.configuration.taxRates.fallback.zone')

    const categoryRecord = toRecord(record?.category)
    const category =
      resolveLocalizedString(categoryRecord, locale, ['name']) ??
      getString(categoryRecord, ['code']) ??
      t('admin.ecommerce.configuration.taxRates.fallback.category')

    const amountValue = getNumber(record, ['amount', 'value', 'rate'], 0)
    const amount = formatNumberValue(amountValue, percentFormatter.value)
    const includedInPrice = getBoolean(
      record,
      ['includedInPrice', 'included_in_price', 'isIncludedInPrice'],
      false,
    )

    return {
      code,
      name,
      zone,
      category,
      amount,
      includedInPrice,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.name, row.code, row.zone, row.category]
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
    :title="t('admin.ecommerce.configuration.taxRates.title')"
    :subtitle="t('admin.ecommerce.configuration.taxRates.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #item.includedInPrice="{ item }">
      <v-chip :color="item.includedInPrice ? 'primary' : 'secondary'" variant="tonal">
        {{
          item.includedInPrice
            ? t('admin.ecommerce.configuration.taxRates.labels.included')
            : t('admin.ecommerce.configuration.taxRates.labels.excluded')
        }}
      </v-chip>
    </template>
  </AdminDataTable>
</template>
