<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, createNumberFormatter, formatDateValue, formatNumberValue } from '~/utils/formatters'
import {
  getBoolean,
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.cartPromotions',
  icon: 'mdi-ticket-percent-outline',
  drawerIndex: 11,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.cartPromotions.table.name'),
    key: 'name',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.cartPromotions.table.code'),
    key: 'code',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.cartPromotions.table.coupons'),
    key: 'coupons',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.cartPromotions.table.startsAt'),
    key: 'startsAt',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.cartPromotions.table.endsAt'),
    key: 'endsAt',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.cartPromotions.table.enabled'),
    key: 'enabled',
    width: 140,
    align: 'center',
  },
])

const dateFormatter = createDateFormatter(locale)
const numberFormatter = createNumberFormatter(locale)
const search = ref('')

const {
  data: rawPromotions,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/promotions', {
  key: 'admin-ecommerce-cart-promotions-list',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawPromotions.value)

  return entries.map((entry, index) => {
    const record = toRecord(entry)

    const code =
      getString(record, ['code', 'id', '@id']) ?? `promotion-${index + 1}`

    const name =
      resolveLocalizedString(record, locale, ['name', 'title']) ?? code

    const couponBased = getBoolean(record, ['couponBased', 'coupon_based'])
    const usageLimit = getNumber(record, ['usageLimit', 'usage_limit'])
    const couponsUsed = getNumber(record, [
      'used',
      'usedCoupons',
      'used_coupons',
    ])

    let couponsLabel: string

    if (!couponBased) {
      couponsLabel = t('admin.ecommerce.cartPromotions.table.noCoupons')
    } else if (usageLimit > 0) {
      couponsLabel = `${formatNumberValue(
        couponsUsed,
        numberFormatter.value,
      )} / ${formatNumberValue(usageLimit, numberFormatter.value)}`
    } else {
      couponsLabel = t('admin.ecommerce.cartPromotions.table.unlimited')
    }

    const startsAt = formatDateValue(
      safeDate(getString(record, ['startsAt', 'starts_at'])),
      dateFormatter.value,
      t('admin.ecommerce.common.none'),
    )

    const endsAt = formatDateValue(
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
        ? t('admin.ecommerce.common.enabled')
        : t('admin.ecommerce.common.disabled')

    return {
      code,
      name,
      coupons: couponsLabel,
      startsAt,
      endsAt,
      enabled: isActive,
      stateLabel,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.trim().toLowerCase()

  return rows.value.filter((row) =>
    [row.name, row.code, row.coupons]
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
    :title="t('admin.ecommerce.cartPromotions.title')"
    :subtitle="t('admin.ecommerce.cartPromotions.subtitle')"
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
