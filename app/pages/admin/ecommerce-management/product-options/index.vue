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
  title: 'admin.ecommerce.navigation.productOptions',
  icon: 'mdi-tune-variant',
  drawerIndex: 4,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.productOptions.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.productOptions.table.code'),
    key: 'code',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.productOptions.table.values'),
    key: 'values',
    align: 'end',
    minWidth: 120,
  },
  {
    title: t('admin.ecommerce.productOptions.table.position'),
    key: 'position',
    align: 'end',
    minWidth: 120,
  },
  {
    title: t('admin.ecommerce.productOptions.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 200,
  },
])

const search = ref('')
const dateFormatter = createDateFormatter(locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const {
  data: rawOptions,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/product-options', {
  key: 'admin-ecommerce-product-options',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawOptions.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code =
      getString(record, ['code', '@id', 'id']) ?? `option-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name', 'title']) ?? code
    const values = getArray(record, ['values', 'value']).length
    const position = getNumber(record, ['position'], index + 1)
    const updatedAt = formatDateValue(
      safeDate(record?.updatedAt) ?? safeDate(record?.updated_at),
      dateFormatter.value,
      '—',
    )

    return {
      code,
      name,
      values,
      position,
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
  return (
    err?.data?.message || err?.message || t('common.unexpectedError')
  )
})
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :title="t('admin.ecommerce.productOptions.title')"
    :subtitle="t('admin.ecommerce.productOptions.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
