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
  title: 'admin.ecommerce.configuration.navigation.countries',
  icon: 'mdi-earth',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  { title: t('admin.ecommerce.configuration.countries.table.name'), key: 'name', minWidth: 220 },
  { title: t('admin.ecommerce.configuration.countries.table.code'), key: 'code', minWidth: 140 },
  { title: t('admin.ecommerce.configuration.countries.table.provinces'), key: 'provinces', minWidth: 160 },
  {
    title: t('admin.ecommerce.configuration.countries.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 140,
  },
])

const search = ref('')

const {
  data: rawCountries,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/countries', {
  key: 'admin-ecommerce-configuration-countries',
  credentials: 'include',
  query: {
    itemsPerPage: 150,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawCountries.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code = getString(record, ['code', 'isoCode']) ?? `country-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name']) ??
      getString(record, ['name']) ??
      code

    const provinces = getArray(record, ['provinces', 'province'])
    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)

    return {
      code,
      name,
      provinces: provinces.length,
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
    :title="t('admin.ecommerce.configuration.countries.title')"
    :subtitle="t('admin.ecommerce.configuration.countries.subtitle')"
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
