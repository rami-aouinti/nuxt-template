<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getBoolean,
  getString,
  normalizeHydraCollection,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.customers',
  icon: 'mdi-account-multiple-outline',
  drawerIndex: 9,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.customers.table.email'),
    key: 'email',
    minWidth: 240,
  },
  {
    title: t('admin.ecommerce.customers.table.lastName'),
    key: 'lastName',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.customers.table.firstName'),
    key: 'firstName',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.customers.table.registrationDate'),
    key: 'registrationDate',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.customers.table.enabled'),
    key: 'enabled',
    width: 140,
    align: 'center',
  },
  {
    title: t('admin.ecommerce.customers.table.verified'),
    key: 'verified',
    width: 140,
    align: 'center',
  },
])

const dateFormatter = createDateFormatter(locale)

const search = ref('')

const {
  data: rawCustomers,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/customers', {
  key: 'admin-ecommerce-customers-list',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawCustomers.value)

  return entries.map((entry, index) => {
    const record = toRecord(entry)

    if (!record) {
      return {
        email: t('admin.ecommerce.common.unknownCustomer'),
        lastName: '-',
        firstName: '-',
        registrationDate: t('admin.ecommerce.common.none'),
        enabled: false,
        verified: false,
      }
    }

    const userRecord = toRecord(record.user)

    const email =
      getString(record, ['email']) ??
      getString(userRecord, ['email']) ??
      `${t('admin.ecommerce.common.unknownCustomer')} #${index + 1}`

    const firstName =
      getString(record, ['firstName', 'first_name']) ??
      getString(userRecord, ['firstName', 'first_name']) ??
      '-'

    const lastName =
      getString(record, ['lastName', 'last_name']) ??
      getString(userRecord, ['lastName', 'last_name']) ??
      '-'

    const registrationDate = formatDateValue(
      safeDate(getString(record, ['createdAt', 'created_at'])) ??
        safeDate(getString(userRecord, ['createdAt', 'created_at'])),
      dateFormatter.value,
      t('admin.ecommerce.common.none'),
    )

    const enabled = getBoolean(userRecord ?? record, [
      'enabled',
      'isEnabled',
      'active',
    ])

    const verified = getBoolean(userRecord ?? record, [
      'verified',
      'isVerified',
      'emailVerified',
      'email_verified',
    ])

    return {
      email,
      firstName,
      lastName,
      registrationDate,
      enabled,
      verified,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.trim().toLowerCase()

  return rows.value.filter((row) =>
    [row.email, row.firstName, row.lastName]
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
    :title="t('admin.ecommerce.customers.title')"
    :subtitle="t('admin.ecommerce.customers.subtitle')"
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

    <template #item.verified="{ item }">
      <v-chip :color="item.verified ? 'primary' : 'warning'" variant="tonal">
        {{
          item.verified
            ? t('admin.ecommerce.common.enabled')
            : t('admin.ecommerce.common.disabled')
        }}
      </v-chip>
    </template>
  </AdminDataTable>
</template>
