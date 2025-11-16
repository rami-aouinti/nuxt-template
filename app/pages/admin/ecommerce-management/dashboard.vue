<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import AppCard from '~/components/ui/AppCard.vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import StatsCard from '~/components/StatsCard.vue'
import { createDateFormatter, formatDateValue } from '~/utils/formatters'
import {
  getArray,
  getBoolean,
  getNumber,
  getString,
  normalizeHydraCollection,
  resolveLocalizedString,
  safeDate,
  toRecord,
} from '~/utils/ecommerce/admin'

definePageMeta({
  icon: 'mdi-monitor-dashboard',
  title: 'navigation.dashboard',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t, locale } = useI18n()

const currencyFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
)

const headers = computed(() => [
  {
    title: t('admin.ecommerce.dashboard.orders.table.number'),
    key: 'number',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.customer'),
    key: 'customer',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.channel'),
    key: 'channel',
    minWidth: 180,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.state'),
    key: 'state',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.paymentState'),
    key: 'paymentState',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.shippingState'),
    key: 'shippingState',
    minWidth: 160,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.total'),
    key: 'total',
    align: 'end',
    minWidth: 140,
  },
  {
    title: t('admin.ecommerce.dashboard.orders.table.placedAt'),
    key: 'placedAt',
    minWidth: 180,
  },
])

const now = new Date()
const createDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startOfYear = new Date(now.getFullYear(), 0, 1)
const endOfYear = new Date(now.getFullYear(), 11, 31)

const selectedChannel = ref<string | null>(null)
const interval = ref<'day' | 'week' | 'month'>('month')
const startDateInput = ref(createDateInput(startOfYear))
const endDateInput = ref(createDateInput(endOfYear))

const buildDateTime = (value: string | null | undefined, type: 'start' | 'end') => {
  if (!value) {
    return undefined
  }

  return `${value}T${type === 'start' ? '00:00:00' : '23:59:59'}`
}

const startDateParam = computed(() => buildDateTime(startDateInput.value, 'start'))
const endDateParam = computed(() => buildDateTime(endDateInput.value, 'end'))

const isDateRangeValid = computed(() => {
  if (!startDateInput.value || !endDateInput.value) {
    return true
  }

  return startDateInput.value <= endDateInput.value
})

const statisticsQuery = computed(() => {
  const query: Record<string, string> = {
    interval: interval.value,
  }

  if (selectedChannel.value) {
    query.channelCode = selectedChannel.value
  }

  if (isDateRangeValid.value) {
    if (startDateParam.value) {
      query.startDate = startDateParam.value
    }

    if (endDateParam.value) {
      query.endDate = endDateParam.value
    }
  }

  return query
})

const { data: statistics } = await useFetch<Record<string, unknown>>(
  '/api/ecommerce/v2/admin/statistics',
  {
    key: 'admin-ecommerce-statistics',
    credentials: 'include',
    query: statisticsQuery,
    watch: [statisticsQuery],
  },
)

const { data: rawOrders } = await useFetch<unknown>(
  '/api/ecommerce/v2/admin/orders',
  {
    key: 'admin-ecommerce-orders',
    credentials: 'include',
    query: {
      itemsPerPage: 20,
      page: 1,
      'order[createdAt]': 'desc',
    },
  },
)

const { data: rawShipments } = await useFetch<unknown>(
  '/api/ecommerce/v2/admin/shipments',
  {
    key: 'admin-ecommerce-shipments',
    credentials: 'include',
    query: {
      itemsPerPage: 50,
      page: 1,
    },
  },
)

const { data: rawProducts } = await useFetch<unknown>(
  '/api/ecommerce/v2/admin/products',
  {
    key: 'admin-ecommerce-products',
    credentials: 'include',
    query: {
      itemsPerPage: 50,
      page: 1,
    },
  },
)

const { data: rawCustomers } = await useFetch<unknown>(
  '/api/ecommerce/v2/admin/customers',
  {
    key: 'admin-ecommerce-customers',
    credentials: 'include',
    query: {
      itemsPerPage: 50,
      page: 1,
    },
  },
)

const { data: rawChannels } = await useFetch<unknown>(
  '/api/ecommerce/v2/shop/channels',
  {
    key: 'admin-ecommerce-channels',
    credentials: 'include',
  },
)

const orders = computed(() => normalizeHydraCollection(rawOrders.value))
const shipments = computed(() => normalizeHydraCollection(rawShipments.value))
const products = computed(() => normalizeHydraCollection(rawProducts.value))
const customers = computed(() => normalizeHydraCollection(rawCustomers.value))
const channels = computed(() => normalizeHydraCollection(rawChannels.value))

const channelOptions = computed(() =>
  channels.value
    .map((entry) => {
      const record = toRecord(entry)
      const code = getString(record, ['code', 'codeValue'])
      if (!code) {
        return null
      }

      const label =
        resolveLocalizedString(record, locale, ['name', 'label']) ??
        code ??
        t('admin.ecommerce.common.defaultChannel')

      return {
        label,
        value: code,
      }
    })
    .filter((option): option is { label: string; value: string } => Boolean(option)),
)

watchEffect(() => {
  if (!selectedChannel.value && channelOptions.value.length) {
    selectedChannel.value = channelOptions.value[0].value
  }
})

const intervalOptions = computed(() => [
  {
    label: t('admin.ecommerce.dashboard.filters.intervalOptions.day'),
    value: 'day',
  },
  {
    label: t('admin.ecommerce.dashboard.filters.intervalOptions.week'),
    value: 'week',
  },
  {
    label: t('admin.ecommerce.dashboard.filters.intervalOptions.month'),
    value: 'month',
  },
])

const dateRangeError = computed(() => {
  if (isDateRangeValid.value) {
    return ''
  }

  return t('admin.ecommerce.dashboard.filters.errors.invalidRange')
})

const formatCurrency = (amount: number, currencyCode?: string | null) => {
  const code =
    currencyCode && currencyCode.trim().length > 0 ? currencyCode : 'USD'

  try {
    const formatter = new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: code,
    })
    return formatter.format(amount)
  } catch {
    return currencyFormatter.value.format(amount)
  }
}

const formatPercent = (value: number) => `${Math.round(value)}%`

const normalizePeriodDate = (value: unknown): string | null => {
  const raw = safeDate(value)
  if (typeof raw !== 'string') {
    return null
  }

  const trimmed = raw.trim()
  if (!trimmed) {
    return null
  }

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return `${trimmed}-01`
  }

  return trimmed
}

const stats = computed(() => {
  const statsRecord = toRecord(statistics.value)
  const summaryRecord = toRecord(statsRecord?.businessActivitySummary)
  const readSummaryNumber = (keys: string | string[]) => {
    if (!summaryRecord) {
      return null
    }

    const value = getNumber(summaryRecord, keys, Number.NaN)
    return Number.isNaN(value) ? null : value
  }

  const totalSales =
    readSummaryNumber(['totalSales', 'total_sales']) ??
    getNumber(statsRecord, ['total_sales', 'totalSales', 'sales'])
  const averageOrderValue =
    readSummaryNumber(['averageOrderValue', 'average_order_value']) ??
    getNumber(statsRecord, ['average_order_value', 'averageOrderValue', 'avgOrder'])
  const orderCount =
    readSummaryNumber(['paidOrdersCount', 'paid_orders_count']) ??
    getNumber(statsRecord, ['orders', 'order_count', 'orderCount'])
  const newCustomers =
    readSummaryNumber(['newCustomersCount', 'new_customers_count']) ??
    getNumber(statsRecord, ['new_customers', 'newCustomers', 'customers'])
  const currency =
    getString(summaryRecord, ['currencyCode', 'currency']) ??
    getString(statsRecord, 'currency', 'USD')
  const formatCurrencyValue = (value: number) => formatCurrency(value, currency)

  return [
    {
      icon: 'mdi-cash-multiple',
      title: t('admin.ecommerce.dashboard.metrics.sales'),
      value: totalSales,
      formatter: formatCurrencyValue,
      caption: t('admin.ecommerce.dashboard.metrics.salesCaption'),
      color: 'primary',
      url: '/admin/ecommerce-management/payments',
    },
    {
      icon: 'mdi-basket-outline',
      title: t('admin.ecommerce.dashboard.metrics.orders'),
      value: orderCount,
      caption: t('admin.ecommerce.dashboard.metrics.ordersCaption'),
      color: 'secondary',
      url: '/admin/ecommerce-management/orders',
    },
    {
      icon: 'mdi-account-plus-outline',
      title: t('admin.ecommerce.dashboard.metrics.customers'),
      value: newCustomers,
      caption: t('admin.ecommerce.dashboard.metrics.customersCaption'),
      color: 'success',
      url: '/admin/ecommerce-management/customers',
    },
    {
      icon: 'mdi-cart-percent',
      title: t('admin.ecommerce.dashboard.metrics.averageOrderValue'),
      value: averageOrderValue,
      formatter: formatCurrencyValue,
      caption: t('admin.ecommerce.dashboard.metrics.averageOrderValueCaption'),
      color: 'info',
      url: '/admin/ecommerce-management/orders',
    },
  ]
})

const pendingActions = computed(() => {
  const pendingOrders = orders.value.filter((entry) => {
    const record = toRecord(entry)
    const state = getString(record, ['state', 'status'])
    return state && ['new', 'pending', 'cart', 'processing'].includes(state)
  }).length

  const pendingPayments = orders.value.filter((entry) => {
    const record = toRecord(entry)
    const paymentState = getString(record, ['paymentState', 'payment_state'])
    return (
      paymentState &&
      !['paid', 'completed', 'authorized'].includes(paymentState)
    )
  }).length

  const pendingShipments = shipments.value.filter((entry) => {
    const record = toRecord(entry)
    const state = getString(record, ['state', 'status'])
    return state && ['ready', 'pending'].includes(state)
  }).length

  const lowStock = products.value.filter((entry) => {
    const record = toRecord(entry)
    const onHand = getNumber(record, ['onHand', 'stock'])
    const onHold = getNumber(record, ['onHold', 'on_hold'])
    return onHand - onHold <= 5
  }).length

  return [
    {
      title: t('admin.ecommerce.dashboard.pending.orders'),
      value: pendingOrders,
      icon: 'mdi-clipboard-list-outline',
    },
    {
      title: t('admin.ecommerce.dashboard.pending.shipments'),
      value: pendingShipments,
      icon: 'mdi-truck-delivery-outline',
    },
    {
      title: t('admin.ecommerce.dashboard.pending.payments'),
      value: pendingPayments,
      icon: 'mdi-credit-card-clock-outline',
    },
    {
      title: t('admin.ecommerce.dashboard.pending.lowStock'),
      value: lowStock,
      icon: 'mdi-package-variant',
    },
  ]
})

const dateFormatter = createDateFormatter(locale)

const recentOrders = computed(() =>
  orders.value.slice(0, 10).map((entry, index) => {
    const record = toRecord(entry)
    const number =
      getString(record, ['number', 'tokenValue', 'code']) ?? `#${index + 1}`
    const channelRecord = toRecord(record?.channel)
    const customerRecord = toRecord(record?.customer)
    const payments = getArray(record, ['payments'])
    const currency =
      getString(record, ['currencyCode', 'currency', 'currency_code']) ?? 'USD'

    const customerName =
      getString(customerRecord, [
        'fullName',
        'firstName',
        'username',
        'email',
      ]) ?? t('admin.ecommerce.common.unknownCustomer')

    const channelName =
      resolveLocalizedString(channelRecord, locale, ['name', 'code']) ??
      t('admin.ecommerce.common.defaultChannel')

    const state =
      getString(record, ['state', 'status']) ??
      t('admin.ecommerce.common.unknownState')

    const paymentState =
      getString(record, ['paymentState', 'payment_state']) ??
      t('admin.ecommerce.common.unknownState')

    const shippingState =
      getString(record, ['shippingState', 'shipping_state']) ??
      t('admin.ecommerce.common.unknownState')

    const total = formatCurrency(
      getNumber(record, ['total', 'totalAmount']),
      currency,
    )

    const placedAt = formatDateValue(
      safeDate(record?.createdAt) ?? safeDate(record?.created_at),
      dateFormatter.value,
      '—',
    )

    const paymentMethod = payments
      .map((payment) => {
        const paymentRecord = toRecord(payment)
        return (
          resolveLocalizedString(paymentRecord, locale, ['name', 'method']) ??
          getString(paymentRecord, ['method', 'state']) ??
          null
        )
      })
      .filter((value): value is string => Boolean(value))
      .join(', ')

    return {
      number,
      customer: customerName,
      channel: channelName,
      state,
      paymentState,
      shippingState,
      total,
      placedAt,
      paymentMethod,
    }
  }),
)

const salesTrend = computed(() => {
  const statsRecord = toRecord(statistics.value)
  const trendEntries = getArray(statsRecord, ['sales_trend', 'salesTrend'])
  const salesEntries = trendEntries.length
    ? trendEntries
    : getArray(statsRecord, ['sales'])
  if (!salesEntries.length) {
    return []
  }

  return salesEntries
    .map((entry) => {
      const record = toRecord(entry)
      if (!record) {
        return null
      }

      const date =
        normalizePeriodDate(record?.date) ?? normalizePeriodDate(record?.period)
      const total = getNumber(record, ['total', 'amount', 'value'])
      if (!date) {
        return null
      }

      return { date, total }
    })
    .filter((entry): entry is { date: string; total: number } => Boolean(entry))
})

const customersGrowth = computed(() => {
  const statsRecord = toRecord(statistics.value)
  const entries = getArray(statsRecord, ['customer_growth', 'customerGrowth'])
  if (!entries.length) {
    return []
  }

  return entries
    .map((entry) => {
      const record = toRecord(entry)
      if (!record) {
        return null
      }

      const period = safeDate(record?.period) ?? safeDate(record?.date)
      if (!period) {
        return null
      }

      return {
        label: period,
        value: getNumber(record, ['value', 'total', 'count']),
      }
    })
    .filter((entry): entry is { label: string; value: number } =>
      Boolean(entry),
    )
})

const inventoryHealth = computed(() => {
  if (!products.value.length) {
    return 100
  }

  const lowStock = products.value.filter((entry) => {
    const record = toRecord(entry)
    const onHand = getNumber(record, ['onHand', 'stock'])
    const onHold = getNumber(record, ['onHold', 'on_hold'])
    return onHand - onHold <= 5
  }).length

  return Math.max(0, 100 - (lowStock / products.value.length) * 100)
})

const returningCustomers = computed(() => {
  if (!customers.value.length) {
    return 0
  }

  const returning = customers.value.filter((entry) => {
    const record = toRecord(entry)
    return getBoolean(record, ['returning', 'isReturning', 'has_orders'])
  }).length

  return Math.round((returning / customers.value.length) * 100)
})
</script>

<template>
  <v-container fluid>
    <AppCard class="pa-4 mb-6 admin-dashboard__filters">
      <div
        class="d-flex flex-column flex-sm-row justify-space-between mb-4"
        style="gap: 12px"
      >
        <div>
          <h2 class="text-h6 text-medium-emphasis mb-1">
            {{ t('admin.ecommerce.dashboard.filters.title') }}
          </h2>
          <p class="text-body-2 text-disabled mb-0">
            {{ t('admin.ecommerce.dashboard.filters.subtitle') }}
          </p>
        </div>
        <p class="text-caption text-medium-emphasis mb-0">
          {{ t('admin.ecommerce.dashboard.filters.helper') }}
        </p>
      </div>
      <v-row class="g-4">
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedChannel"
            :items="channelOptions"
            item-title="label"
            item-value="value"
            :label="t('admin.ecommerce.dashboard.filters.channel')"
            :disabled="!channelOptions.length"
            density="comfortable"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="interval"
            :items="intervalOptions"
            item-title="label"
            item-value="value"
            :label="t('admin.ecommerce.dashboard.filters.interval')"
            density="comfortable"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="startDateInput"
            type="date"
            :label="t('admin.ecommerce.dashboard.filters.startDate')"
            density="comfortable"
            variant="outlined"
            :error="Boolean(dateRangeError)"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="endDateInput"
            type="date"
            :label="t('admin.ecommerce.dashboard.filters.endDate')"
            density="comfortable"
            variant="outlined"
            :error="Boolean(dateRangeError)"
          />
        </v-col>
      </v-row>
      <v-alert
        v-if="dateRangeError"
        type="warning"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        {{ dateRangeError }}
      </v-alert>
    </AppCard>
    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <StatsCard
          :title="stat.title"
          :icon="stat.icon"
          :value="stat.value"
          :color="stat.color"
          :url="stat.url"
        >
          <template #footer>
            {{ stat.caption }}
          </template>
        </StatsCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <AppCard class="pa-4 h-100">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h2 class="text-h6 text-medium-emphasis mb-1">
                {{ t('admin.ecommerce.dashboard.salesTrend.title') }}
              </h2>
              <p class="text-body-2 text-disabled mb-0">
                {{ t('admin.ecommerce.dashboard.salesTrend.subtitle') }}
              </p>
            </div>
            <v-chip color="primary" variant="flat">
              {{ formatPercent(inventoryHealth) }}
            </v-chip>
          </div>
          <ChartLine :items="salesTrend" />
        </AppCard>
      </v-col>
      <v-col cols="12" lg="4">
        <AppCard class="pa-4 h-100">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h2 class="text-h6 text-medium-emphasis mb-1">
                {{ t('admin.ecommerce.dashboard.customerGrowth.title') }}
              </h2>
              <p class="text-body-2 text-disabled mb-0">
                {{ t('admin.ecommerce.dashboard.customerGrowth.subtitle') }}
              </p>
            </div>
            <v-chip color="success" variant="tonal">
              {{ formatPercent(returningCustomers) }}
            </v-chip>
          </div>
          <ChartBar :items="customersGrowth" />
        </AppCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="4">
        <AppCard class="pa-0 h-100">
          <div class="pa-4 pb-2">
            <h2 class="text-h6 mb-1">
              {{ t('admin.ecommerce.dashboard.pending.title') }}
            </h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ t('admin.ecommerce.dashboard.pending.subtitle') }}
            </p>
          </div>
          <v-divider />
          <v-list lines="two" density="comfortable">
            <v-list-item v-for="item in pendingActions" :key="item.title">
              <template #prepend>
                <v-avatar color="primary" variant="tonal">
                  <v-icon :icon="item.icon" />
                </v-avatar>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{
                  t('admin.ecommerce.dashboard.pending.items', {
                    value: item.value,
                  })
                }}
              </v-list-item-subtitle>
              <template #append>
                <v-chip color="primary" variant="tonal">
                  {{ item.value }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </AppCard>
      </v-col>
      <v-col cols="12" lg="8">
        <AppCard class="pa-0">
          <AdminDataTable
            :headers="headers"
            :items="recentOrders"
            :show-search="false"
            :refreshable="false"
            dense
            class="admin-dashboard__orders"
            :title="t('admin.ecommerce.dashboard.orders.title')"
            :subtitle="t('admin.ecommerce.dashboard.orders.subtitle')"
          />
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.admin-dashboard__filters {
  position: sticky;
  top: 24px;
  z-index: 2;
}

.admin-dashboard__orders :deep(.admin-data-table__toolbar) {
  padding-inline: 16px;
  padding-block: 12px;
}

.admin-dashboard__orders :deep(.v-data-table__wrapper) {
  border-radius: 0;
}
</style>
