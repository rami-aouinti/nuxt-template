<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createNumberFormatter, formatNumberValue } from '~/utils/formatters'
import {
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.customerGroups',
  icon: 'mdi-account-group-outline',
  drawerIndex: 10,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.customerGroups.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.customerGroups.table.code'),
    key: 'code',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.configuration.customerGroups.table.members'),
    key: 'members',
    align: 'end',
    width: 160,
  },
])

const numberFormatter = createNumberFormatter(locale)
const search = ref('')

const {
  data: rawCustomerGroups,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/customer-groups', {
  key: 'admin-ecommerce-customer-groups-list',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawCustomerGroups.value)

  return entries.map((entry, index) => {
    const record = toRecord(entry)

    const code =
      getString(record, ['code', 'id', '@id']) ?? `customer-group-${index + 1}`

    const name =
      resolveLocalizedString(record, locale, ['name', 'title']) ?? code

    const members = formatNumberValue(
      getNumber(record, [
        'membersCount',
        'members_count',
        'customerCount',
        'customer_count',
        'customers',
      ]),
      numberFormatter.value,
    )

    return {
      code,
      name,
      members,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.trim().toLowerCase()

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
    :title="t('admin.ecommerce.configuration.customerGroups.title')"
    :subtitle="t('admin.ecommerce.configuration.customerGroups.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
