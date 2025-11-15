<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  getArray,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.zones',
  icon: 'mdi-map-marker-radius',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.zones.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.zones.table.code'),
    key: 'code',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.configuration.zones.table.type'),
    key: 'type',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.configuration.zones.table.members'),
    key: 'members',
    minWidth: 160,
  },
])

const search = ref('')

const {
  data: rawZones,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/zones', {
  key: 'admin-ecommerce-configuration-zones',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawZones.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code = getString(record, ['code', 'id', '@id']) ?? `zone-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name']) ??
      getString(record, ['name']) ??
      code

    const type =
      getString(record, ['type', 'scope']) ??
      t('admin.ecommerce.configuration.zones.fallback.type')

    const members = getArray(record, ['members', 'member'])

    return {
      code,
      name,
      type,
      members: members.length,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.name, row.code, row.type]
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
    :title="t('admin.ecommerce.configuration.zones.title')"
    :subtitle="t('admin.ecommerce.configuration.zones.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
