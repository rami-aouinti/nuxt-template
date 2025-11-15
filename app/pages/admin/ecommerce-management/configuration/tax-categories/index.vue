<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import {
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.taxCategories',
  icon: 'mdi-file-tree',
  drawerIndex: 7,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.taxCategories.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.taxCategories.table.code'),
    key: 'code',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.configuration.taxCategories.table.description'),
    key: 'description',
    minWidth: 280,
  },
])

const search = ref('')

const {
  data: rawCategories,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/tax-categories', {
  key: 'admin-ecommerce-configuration-tax-categories',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawCategories.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code =
      getString(record, ['code', 'id', '@id']) ?? `tax-category-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name']) ??
      getString(record, ['name']) ??
      code
    const description =
      resolveLocalizedString(record, locale, ['description']) ??
      getString(record, ['description']) ??
      t('admin.ecommerce.common.none')

    return {
      code,
      name,
      description,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.name, row.code, row.description]
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
    :title="t('admin.ecommerce.configuration.taxCategories.title')"
    :subtitle="t('admin.ecommerce.configuration.taxCategories.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
