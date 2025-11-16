<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.productAssociationTypes',
  icon: 'mdi-vector-link',
  drawerIndex: 5,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.productAssociationTypes.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.productAssociationTypes.table.code'),
    key: 'code',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.productAssociationTypes.table.description'),
    key: 'description',
    minWidth: 280,
  },
  {
    title: t('admin.ecommerce.productAssociationTypes.table.updatedAt'),
    key: 'updatedAt',
    minWidth: 200,
  },
])

const search = ref('')
const dateFormatter = createDateFormatter(locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const {
  data: rawAssociations,
  pending,
  error,
  refresh,
} = await useFetch<unknown>(
  '/api/ecommerce/v2/admin/product-association-types',
  {
    key: 'admin-ecommerce-association-types',
    credentials: 'include',
    query: {
      itemsPerPage: 100,
      page: 1,
    },
  },
)

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawAssociations.value)
  return entries.map((entry, index) => {
    const record = toRecord(entry)
    const code =
      getString(record, ['code', '@id', 'id']) ?? `association-${index + 1}`
    const translation = resolveLocalizedString(record, locale, [
      'name',
      'title',
    ])
    const description =
      resolveLocalizedString(record, locale, ['description']) ||
      getString(record, ['description']) ||
      t('admin.ecommerce.common.none')
    const updatedAt = formatDateValue(
      safeDate(record?.updatedAt) ?? safeDate(record?.updated_at),
      dateFormatter.value,
      '—',
    )

    return {
      code,
      name: translation ?? code,
      description,
      updatedAt,
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
    :title="t('admin.ecommerce.productAssociationTypes.title')"
    :subtitle="t('admin.ecommerce.productAssociationTypes.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  />
</template>
