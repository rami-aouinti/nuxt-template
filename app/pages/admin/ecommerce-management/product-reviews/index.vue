<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  title: 'admin.ecommerce.navigation.productReviews',
  icon: 'mdi-star-circle-outline',
  drawerIndex: 13,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const headers = computed(() => [
  {
    title: t('admin.ecommerce.configuration.productReviews.table.rating'),
    key: 'rating',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.configuration.productReviews.table.title'),
    key: 'title',
    minWidth: 220,
  },
  {
    title: t('admin.ecommerce.configuration.productReviews.table.product'),
    key: 'product',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.configuration.productReviews.table.customer'),
    key: 'customer',
    minWidth: 200,
  },
  {
    title: t('admin.ecommerce.configuration.productReviews.table.state'),
    key: 'state',
    width: 160,
    align: 'center',
  },
  {
    title: t('admin.ecommerce.configuration.productReviews.table.createdAt'),
    key: 'createdAt',
    minWidth: 200,
  },
])

const dateFormatter = createDateFormatter(locale)
const search = ref('')

const {
  data: rawReviews,
  pending,
  error,
  refresh,
} = await useFetch<unknown>('/api/ecommerce/v2/admin/product-reviews', {
  key: 'admin-ecommerce-product-reviews-list',
  credentials: 'include',
  query: {
    itemsPerPage: 100,
    page: 1,
  },
})

const rows = computed(() => {
  const entries = normalizeHydraCollection(rawReviews.value)

  return entries.map((entry, index) => {
    const record = toRecord(entry)

    const productRecord = toRecord(record?.product)
    const customerRecord = toRecord(record?.customer)

    const ratingValue = getNumber(record, ['rating', 'ratingValue'])
    const ratingMax = Math.max(getNumber(record, ['ratingScale', 'rating_scale'], 5), 1)

    const ratingDisplay = `${ratingValue} / ${ratingMax}`

    const title =
      getString(record, ['title', 'summary']) ||
      `${t('admin.ecommerce.configuration.productReviews.noTitle')} #${index + 1}`

    const product =
      resolveLocalizedString(productRecord, locale, ['name', 'title']) ??
      getString(productRecord, ['code', 'slug']) ??
      t('admin.ecommerce.common.none')

    const customer =
      getString(customerRecord, ['email', 'username', 'fullName', 'full_name']) ??
      t('admin.ecommerce.configuration.productReviews.anonymous')

    const state = getString(record, ['status', 'state']) ?? 'pending'
    const normalizedState = state.toLowerCase()

    const stateLabelMap: Record<string, string> = {
      accepted: t('admin.ecommerce.configuration.productReviews.states.accepted'),
      rejected: t('admin.ecommerce.configuration.productReviews.states.rejected'),
      pending: t('admin.ecommerce.configuration.productReviews.states.pending'),
      new: t('admin.ecommerce.configuration.productReviews.states.pending'),
    }

    const stateLabel =
      stateLabelMap[normalizedState] ??
      state.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

    const stateColor =
      normalizedState === 'accepted'
        ? 'success'
        : normalizedState === 'rejected'
          ? 'error'
          : 'warning'

    const createdAt = formatDateValue(
      safeDate(getString(record, ['createdAt', 'created_at'])),
      dateFormatter.value,
      t('admin.ecommerce.common.none'),
    )

    return {
      title,
      product,
      customer,
      ratingValue,
      ratingMax,
      ratingDisplay,
      stateLabel,
      stateColor,
      createdAt,
    }
  })
})

const filteredRows = computed(() => {
  if (!search.value) {
    return rows.value
  }

  const term = search.value.trim().toLowerCase()

  return rows.value.filter((row) =>
    [row.title, row.product, row.customer, row.stateLabel]
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
    :title="t('admin.ecommerce.configuration.productReviews.title')"
    :subtitle="t('admin.ecommerce.configuration.productReviews.subtitle')"
    :headers="headers"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :search-placeholder="t('common.labels.search')"
    @refresh="refresh"
  >
    <template #item.rating="{ item }">
      <div class="d-flex align-center">
        <v-rating
          :model-value="item.ratingValue"
          :length="item.ratingMax"
          density="compact"
          color="warning"
          readonly
          class="me-2"
        />
        <span class="text-caption text-medium-emphasis">{{ item.ratingDisplay }}</span>
      </div>
    </template>

    <template #item.state="{ item }">
      <v-chip :color="item.stateColor" variant="tonal">
        {{ item.stateLabel }}
      </v-chip>
    </template>
  </AdminDataTable>
</template>
