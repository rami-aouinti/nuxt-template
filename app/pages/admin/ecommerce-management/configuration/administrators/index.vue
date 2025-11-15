<script setup lang="ts">
import { computed, ref } from 'vue'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getArray,
  getBoolean,
  getString,
  normalizeHydraCollection,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.configuration.navigation.administrators',
  icon: 'mdi-account-tie-outline',
  drawerIndex: 9,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.administrators.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.administrators.table.email'),
    key: 'email',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.administrators.table.username'),
    key: 'username',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.configuration.administrators.table.locale'),
    key: 'locale',
    minWidth: 120,
  },
  {
    title: t('admin.ecommerce.configuration.administrators.table.roles'),
    key: 'roles',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.administrators.table.lastLogin'),
    key: 'lastLogin',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.configuration.administrators.table.enabled'),
    key: 'enabled',
    align: 'center',
    width: 140,
  },
])

const search = ref('')

const dateFormatter = createDateFormatter(locale)

const {
  data: rawAdministrators,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/administrators', {
  key: 'admin-ecommerce-configuration-administrators',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawAdministrators.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const email =
      getString(record, ['email']) ?? `admin-${index + 1}@example.com`
    const firstName = getString(record, ['firstName', 'first_name'])
    const lastName = getString(record, ['lastName', 'last_name'])
    const username = getString(record, ['username']) ?? email
    const name =
      [firstName, lastName].filter(Boolean).join(' ').trim() || username
    const localeCode =
      getString(record, ['localeCode', 'locale_code', 'locale']) ??
      t('admin.ecommerce.configuration.administrators.fallback.locale')
    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)
    const roles = getArray(record, ['roles']).filter(
      (role): role is string => typeof role === 'string',
    )
    const lastLoginRaw = safeDate(record?.lastLogin ?? record?.last_login)
    const lastLogin = lastLoginRaw
      ? formatDateValue(lastLoginRaw, dateFormatter.value, '')
      : t('admin.ecommerce.configuration.administrators.fallback.lastLogin')

    return {
      email,
      username,
      name,
      locale: localeCode,
      enabled,
      roles:
        roles.join(', ') ||
        t('admin.ecommerce.configuration.administrators.fallback.roles'),
      lastLogin,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.toLowerCase().trim()
  return rows.value.filter((row) =>
    [row.name, row.email, row.username, row.locale, row.roles, row.lastLogin]
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
    :title="t('admin.ecommerce.configuration.administrators.title')"
    :subtitle="t('admin.ecommerce.configuration.administrators.subtitle')"
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
