<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  getBoolean,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.channels',
  icon: 'mdi-source-branch',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  { title: t('admin.ecommerce.configuration.channels.table.name'), key: 'name', minWidth: 220 },
  { title: t('admin.ecommerce.configuration.channels.table.code'), key: 'code', minWidth: 140 },
  { title: t('admin.ecommerce.configuration.channels.table.currency'), key: 'currency', minWidth: 140 },
  { title: t('admin.ecommerce.configuration.channels.table.locale'), key: 'locale', minWidth: 140 },
  { title: t('admin.ecommerce.configuration.channels.table.hostname'), key: 'hostname', minWidth: 220 },
  {
    title: t('admin.ecommerce.configuration.channels.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 140,
  },
])

const search = ref('')

const {
  data: rawChannels,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/channels', {
  key: 'admin-ecommerce-configuration-channels',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawChannels.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code = getString(record, ['code', 'id', '@id']) ?? `channel-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name', 'label']) ??
      getString(record, ['name']) ??
      code

    const baseCurrencyRecord = toRecord(record?.baseCurrency)
    const currency =
      getString(baseCurrencyRecord, ['code', 'currencyCode']) ??
      getString(record, [
        'baseCurrency',
        'baseCurrencyCode',
        'defaultCurrency',
        'base_currency',
        'default_currency',
      ]) ??
      t('admin.ecommerce.common.none')

    const defaultLocaleRecord = toRecord(record?.defaultLocale)
    const localeCode =
      getString(defaultLocaleRecord, ['code', 'locale']) ??
      getString(record, ['defaultLocale', 'default_locale', 'locale']) ??
      t('admin.ecommerce.common.none')

    const hostname =
      getString(record, ['hostname', 'url', 'domain']) ??
      t('admin.ecommerce.common.none')

    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)

    return {
      code,
      name,
      currency,
      locale: localeCode,
      hostname,
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
    [row.name, row.code, row.currency, row.locale, row.hostname]
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
    :title="t('admin.ecommerce.configuration.channels.title')"
    :subtitle="t('admin.ecommerce.configuration.channels.subtitle')"
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
