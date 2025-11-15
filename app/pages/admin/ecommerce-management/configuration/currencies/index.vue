<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  createDateFormatter,
  createNumberFormatter,
  formatDateValue,
  formatNumberValue,
} from '~/utils/formatters'
import {
  getBoolean,
  getNumber,
  getString,
  normalizeHydraCollection,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.currencies',
  icon: 'mdi-currency-usd',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.currencies.table.code'),
    key: 'code',
    minWidth: 120,
  },
  {
    title: t('admin.ecommerce.configuration.currencies.table.name'),
    key: 'name',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.configuration.currencies.table.exchangeRate'),
    key: 'exchangeRate',
    minWidth: 160,
    align: 'end',
  },
  {
    title: t('admin.ecommerce.configuration.currencies.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.configuration.currencies.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 140,
  },
])

const search = ref('')

const numberFormatter = createNumberFormatter(locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})

const dateFormatter = createDateFormatter(locale)

const {
  data: rawCurrencies,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/currencies', {
  key: 'admin-ecommerce-configuration-currencies',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawCurrencies.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code = getString(record, ['code']) ?? `currency-${index + 1}`
    const name = getString(record, ['name']) ?? code
    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)
    const exchangeRateValue = getNumber(
      record,
      ['exchangeRate', 'ratio', 'rate'],
      1,
    )
    const exchangeRate = formatNumberValue(
      exchangeRateValue,
      numberFormatter.value,
    )
    const updatedAt = formatDateValue(
      record?.updatedAt,
      dateFormatter.value,
      t('admin.ecommerce.configuration.currencies.fallback.updatedAt'),
    )

    return {
      code,
      name,
      exchangeRate,
      enabled,
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
    [row.name, row.code]
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
    :title="t('admin.ecommerce.configuration.currencies.title')"
    :subtitle="t('admin.ecommerce.configuration.currencies.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #item.enabled="{ item }">
      <v-chip :color="item.enabled ? 'success' : 'error'" variant="tonal">
        {{
          item.enabled
            ? t('admin.ecommerce.common.enabled')
            : t('admin.ecommerce.common.disabled')
        }}
      </v-chip>
    </template>
  </AdminDataTable>
</template>
