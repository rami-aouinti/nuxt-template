<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getArray,
  getBoolean,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.taxons',
  icon: 'mdi-shape-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale, localePath } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.taxons.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.taxons.table.code'),
    key: 'code',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.taxons.table.parent'),
    key: 'parent',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.taxons.table.children'),
    key: 'children',
    align: 'end',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.taxons.table.enabled'),
    key: 'enabled',
    align: 'center',
    minWidth: 120,
  },
  {
    title: t('admin.ecommerce.taxons.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 180,
  },
])

const search = ref('')
const dateFormatter = createDateFormatter(locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const {
  data: rawTaxons,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/taxons', {
  key: 'admin-ecommerce-taxons',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const taxonRows = computed(() => {
  const entries = normalizeHydraCollection(rawTaxons.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code =
      getString(record, ['code', '@id', 'id']) ?? `taxon-${index + 1}`
    const name =
      resolveLocalizedString(record, locale, ['name', 'title']) ?? code
    const parentRecord = toRecord(record?.parent)
    const parentName = parentRecord
      ? resolveLocalizedString(parentRecord, locale, ['name', 'title']) ??
        getString(parentRecord, ['code'])
      : t('admin.ecommerce.common.none')
    const children = getArray(record, ['children', 'child'])
    const enabled = getBoolean(record, ['enabled', 'isEnabled'], true)
    const updatedAt = formatDateValue(
      safeDate(record?.updatedAt) ?? safeDate(record?.updated_at),
      dateFormatter.value,
      '—',
    )

    return {
      code,
      name,
      parent: parentName,
      children: children.length,
      enabled,
      updatedAt,
    }
  })
})

const filteredTaxons = computed(() => {
  if (!search.value) {
    return taxonRows.value
  }

  const term = search.value.trim().toLowerCase()
  return taxonRows.value.filter((taxon) =>
    [taxon.name, taxon.code, taxon.parent]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(term)),
  )
})

const errorMessage = computed(() => {
  if (!error.value) {
    return null
  }

  const err = error.value as { message?: string; data?: { message?: string } }
  return (
    err?.data?.message || err?.message || t('common.unexpectedError')
  )
})

const createTaxonPath = computed(() =>
  localePath({
    name: 'admin-ecommerce-management-taxons-new',
  }),
)
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :title="t('admin.ecommerce.taxons.title')"
    :subtitle="t('admin.ecommerce.taxons.subtitle')"
    :headers="headers"
    :items="filteredTaxons"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #actions>
      <AppButton :to="createTaxonPath" color="primary" prepend-icon="mdi-plus">
        {{ t('admin.ecommerce.taxons.create') }}
      </AppButton>
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
