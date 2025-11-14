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
  title: 'admin.ecommerce.navigation.products',
  icon: 'mdi-shopping',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: '',
    key: 'image',
    sortable: false,
    width: 96,
  },
  {
    title: t('admin.ecommerce.products.table.name'),
    key: 'name',
    minWidth: 240,
  },
  {
    title: t('admin.ecommerce.products.table.code'),
    key: 'code',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.products.table.mainTaxon'),
    key: 'mainTaxon',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.products.table.channels'),
    key: 'channels',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.products.table.inventory'),
    key: 'inventory',
    align: 'end',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.products.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 120,
  },
])

const numberFormatter = createNumberFormatter(locale)

const search = ref('')

const {
  data: rawProducts,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/products', {
  key: 'admin-ecommerce-products-table',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawProducts.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code =
      getString(record, ['code', 'id', '@id']) ?? `product-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name', 'title']) ?? code
    const mainTaxonRecord =
      toRecord(record?.mainTaxon) ?? toRecord(record?.main_taxon)
    const mainTaxon = mainTaxonRecord
      ? resolveLocalizedString(mainTaxonRecord, locale, ['name', 'title']) ??
        getString(mainTaxonRecord, ['code'])
      : t('admin.ecommerce.common.none')

    const channelEntries = getArray(record, ['channels', 'channel'])
    const channels = channelEntries
      .map((channel) => {
        const channelRecord = toRecord(channel)
        return (
          resolveLocalizedString(channelRecord, locale, ['name', 'code']) ??
          getString(channelRecord, ['code'])
        )
      })
      .filter((value): value is string => Boolean(value))
      .join(', ')

    const variants = getArray(record, ['variants', 'variant'])
    const firstVariant = toRecord(variants[0])
    const onHand = getNumber(firstVariant ?? record, ['onHand', 'stock'])
    const onHold = getNumber(firstVariant ?? record, ['onHold', 'on_hold'])
    const available = Math.max(onHand - onHold, 0)
    const inventory = `${formatNumberValue(
      available,
      numberFormatter.value,
    )} / ${formatNumberValue(onHand, numberFormatter.value)}`

    const imageEntries = getArray(record, ['images', 'image'])
    const image = toRecord(imageEntries[0])
    const imageUrl = image ? getString(image, ['path', 'url']) : null
    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)

    return {
      code,
      name,
      mainTaxon,
      channels,
      inventory,
      enabled,
      image: imageUrl,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.name, row.code, row.mainTaxon, row.channels]
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
    :title="t('admin.ecommerce.products.title')"
    :subtitle="t('admin.ecommerce.products.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #item.image="{ item }">
      <v-avatar size="48" variant="tonal">
        <v-img :src="item.image" :alt="item.name" cover />
      </v-avatar>
    </template>
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
