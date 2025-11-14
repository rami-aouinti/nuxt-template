<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  getArray,
  getBoolean,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.shippingMethods',
  icon: 'mdi-truck-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  { title: t('admin.ecommerce.configuration.shippingMethods.table.name'), key: 'name', minWidth: 220 },
  { title: t('admin.ecommerce.configuration.shippingMethods.table.code'), key: 'code', minWidth: 140 },
  { title: t('admin.ecommerce.configuration.shippingMethods.table.zone'), key: 'zone', minWidth: 200 },
  { title: t('admin.ecommerce.configuration.shippingMethods.table.channels'), key: 'channels', minWidth: 220 },
  {
    title: t('admin.ecommerce.configuration.shippingMethods.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 140,
  },
])

const search = ref('')

const {
  data: rawShippingMethods,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/shipping-methods', {
  key: 'admin-ecommerce-configuration-shipping-methods',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawShippingMethods.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code = getString(record, ['code', 'id', '@id']) ?? `shipping-method-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name']) ??
      getString(record, ['name']) ??
      code

    const zoneRecord = toRecord(record?.zone)
    const zone =
      resolveLocalizedString(zoneRecord, locale, ['name']) ??
      getString(zoneRecord, ['code']) ??
      t('admin.ecommerce.configuration.shippingMethods.fallback.zone')

    const channels = getArray(record, ['channels']).map((channel) => {
      const channelRecord = toRecord(channel)
      return (
        resolveLocalizedString(channelRecord, locale, ['name']) ??
        getString(channelRecord, ['code']) ??
        null
      )
    })

    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)

    return {
      code,
      name,
      zone,
      channels: channels.filter(Boolean).join(', ') || t('admin.ecommerce.common.none'),
      enabled,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.name, row.code, row.zone, row.channels]
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
    :title="t('admin.ecommerce.configuration.shippingMethods.title')"
    :subtitle="t('admin.ecommerce.configuration.shippingMethods.subtitle')"
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
