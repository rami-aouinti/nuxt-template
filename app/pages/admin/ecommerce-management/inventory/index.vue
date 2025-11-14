<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createNumberFormatter, formatNumberValue } from '~/utils/formatters'
import {
  getArray,
  getBoolean,
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.inventory',
  icon: 'mdi-warehouse',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.inventory.table.product'),
    key: 'product',
    minWidth: 240,
  },
  {
    title: t('admin.ecommerce.inventory.table.variant'),
    key: 'variant',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.inventory.table.sku'),
    key: 'sku',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.inventory.table.onHand'),
    key: 'onHand',
    align: 'end',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.inventory.table.allocated'),
    key: 'onHold',
    align: 'end',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.inventory.table.available'),
    key: 'available',
    align: 'end',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.inventory.table.tracked'),
    key: 'tracked',
    align: 'center',
    width: 120,
  },
])

const search = ref('')
const numberFormatter = createNumberFormatter(locale)

const {
  data: rawProducts,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/products', {
  key: 'admin-ecommerce-inventory',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawProducts.value)

  return entries.flatMap((entry, index) => {
    const record = toRecord(entry)
    const productName =
      resolveLocalizedString(record, locale, ['name', 'title']) ??
      getString(record, ['code']) ??
      `product-${index + 1}`

    const variants = getArray(record, ['variants', 'variant'])
    if (!variants.length) {
      const onHand = getNumber(record, ['onHand', 'stock'])
      const onHold = getNumber(record, ['onHold', 'on_hold'])
      const available = Math.max(onHand - onHold, 0)

      return [
        {
          product: productName,
          variant: t('admin.ecommerce.inventory.table.defaultVariant'),
          sku: getString(record, ['code']) ?? `SKU-${index + 1}`,
          onHand: formatNumberValue(onHand, numberFormatter.value),
          onHold: formatNumberValue(onHold, numberFormatter.value),
          available: formatNumberValue(available, numberFormatter.value),
          tracked: getBoolean(record, ['tracked', 'isTracked'], true),
        },
      ]
    }

    return variants.map((variant, variantIndex) => {
      const variantRecord = toRecord(variant)
      const onHand = getNumber(variantRecord, ['onHand'])
      const onHold = getNumber(variantRecord, ['onHold'])
      const available = Math.max(onHand - onHold, 0)

      const variantName =
        resolveLocalizedString(variantRecord, locale, ['name']) ??
        getString(variantRecord, ['descriptor']) ??
        getString(variantRecord, ['code']) ??
        `${productName} #${variantIndex + 1}`

      return {
        product: productName,
        variant: variantName,
        sku: getString(variantRecord, ['code']) ?? variantName,
        onHand: formatNumberValue(onHand, numberFormatter.value),
        onHold: formatNumberValue(onHold, numberFormatter.value),
        available: formatNumberValue(available, numberFormatter.value),
        tracked: getBoolean(variantRecord, ['tracked'], true),
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
    [row.product, row.variant, row.sku]
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
    :title="t('admin.ecommerce.inventory.title')"
    :subtitle="t('admin.ecommerce.inventory.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #item.tracked="{ item }">
      <v-chip :color="item.tracked ? 'success' : 'warning'" variant="tonal">
        {{ item.tracked ? t('common.labels.yes') : t('common.labels.no') }}
      </v-chip>
    </template>
  </AdminDataTable>
</template>
