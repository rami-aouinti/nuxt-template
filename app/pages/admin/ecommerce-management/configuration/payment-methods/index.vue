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
  title: 'admin.ecommerce.configuration.navigation.paymentMethods',
  icon: 'mdi-credit-card-outline',
  drawerIndex: 5,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.paymentMethods.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.paymentMethods.table.code'),
    key: 'code',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.configuration.paymentMethods.table.gateway'),
    key: 'gateway',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.configuration.paymentMethods.table.channels'),
    key: 'channels',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.paymentMethods.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 140,
  },
])

const search = ref('')

const {
  data: rawPaymentMethods,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/payment-methods', {
  key: 'admin-ecommerce-configuration-payment-methods',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawPaymentMethods.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code =
      getString(record, ['code', 'id', '@id']) ?? `payment-method-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name']) ??
      getString(record, ['name']) ??
      code
    const gateway =
      getString(record, ['gatewayName', 'gateway', 'factoryName']) ??
      t('admin.ecommerce.configuration.paymentMethods.fallback.gateway')

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
      gateway,
      channels:
        channels.filter(Boolean).join(', ') || t('admin.ecommerce.common.none'),
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
    [row.name, row.code, row.gateway, row.channels]
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
    :title="t('admin.ecommerce.configuration.paymentMethods.title')"
    :subtitle="t('admin.ecommerce.configuration.paymentMethods.subtitle')"
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
