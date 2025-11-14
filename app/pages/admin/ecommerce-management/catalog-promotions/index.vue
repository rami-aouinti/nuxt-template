<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
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
  title: 'admin.ecommerce.navigation.catalogPromotions',
  icon: 'mdi-sale-outline',
  drawerIndex: 12,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.catalogPromotions.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.catalogPromotions.table.code'),
    key: 'code',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.catalogPromotions.table.channels'),
    key: 'channels',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.catalogPromotions.table.startDate'),
    key: 'startDate',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.catalogPromotions.table.endDate'),
    key: 'endDate',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.catalogPromotions.table.state'),
    key: 'state',
    width: 140,
    align: 'center',
  },
])

const dateFormatter = createDateFormatter(locale)
const search = ref('')

const {
  data: rawCatalogPromotions,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/catalog-promotions', {
  key: 'admin-ecommerce-catalog-promotions-list',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawCatalogPromotions.value)

  return entries.map((entry, index) => {
    const record = toRecord(entry)

    const code =
      getString(record, ['code', 'id', '@id']) ?? `catalog-promotion-${index + 1}`

    const name =
      resolveLocalizedString(record, locale, ['name', 'title']) ?? code

    const channelEntries = getArray(record, ['channels', 'channel'])

    const channels = channelEntries
      .map((channel) => {
        const channelRecord = toRecord(channel)
        return (
          resolveLocalizedString(channelRecord, locale, ['name', 'title']) ??
          getString(channelRecord, ['code'])
        )
      })
      .filter((value): value is string => Boolean(value))
      .join(', ')

    const startDate = formatDateValue(
      safeDate(getString(record, ['startsAt', 'starts_at'])),
      dateFormatter.value,
      t('admin.ecommerce.common.none'),
    )

    const endDate = formatDateValue(
      safeDate(getString(record, ['endsAt', 'ends_at'])),
      dateFormatter.value,
      t('admin.ecommerce.common.none'),
    )

    const state = getString(record, ['state', 'status'])
    const isActive =
      getBoolean(record, ['enabled', 'isEnabled', 'active'], true) ||
      (state ? ['active', 'enabled', 'published'].includes(state.toLowerCase()) : false)

    const stateLabel = state
      ? state
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : isActive
        ? t('admin.ecommerce.catalogPromotions.table.active')
        : t('admin.ecommerce.catalogPromotions.table.inactive')

    return {
      code,
      name,
      channels:
        channels || t('admin.ecommerce.catalogPromotions.table.noChannels'),
      startDate,
      endDate,
      stateLabel,
      active: isActive,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.trim().toLowerCase()

  return rows.value.filter((row) =>
    [row.name, row.code, row.channels]
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
    :title="t('admin.ecommerce.catalogPromotions.title')"
    :subtitle="t('admin.ecommerce.catalogPromotions.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #item.state="{ item }">
      <v-chip :color="item.active ? 'success' : 'error'" variant="tonal">
        {{ item.stateLabel }}
      </v-chip>
    </template>
  </AdminDataTable>
</template>
