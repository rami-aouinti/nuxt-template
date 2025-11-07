<script setup lang="ts">
import { computed, ref, toRefs, useAttrs, useSlots, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'

type ItemsPerPageOption = number | { title: string; value: number }

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    headers: DataTableHeader[]
    items: unknown[]
    loading?: boolean
    error?: string | null
    search?: string
    searchPlaceholder?: string
    showSearch?: boolean
    refreshable?: boolean
    color?: string
    dense?: boolean
    itemsPerPageOptions?: ItemsPerPageOption[]
  }>(),
  {
    title: '',
    subtitle: '',
    loading: false,
    error: null,
    search: '',
    searchPlaceholder: '',
    showSearch: true,
    refreshable: true,
    color: 'primary',
    dense: false,
    itemsPerPageOptions: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:search', value: string): void
  (event: 'refresh'): void
}>()

const slots = useSlots()
const attrs = useAttrs()
const { t } = useI18n()

const {
  headers,
  items,
  loading,
  showSearch,
  refreshable,
  searchPlaceholder,
  title,
  subtitle,
  color,
} = toRefs(props)

const localSearch = ref(props.search ?? '')

watch(
  () => props.search,
  (value) => {
    if (value == null) {
      localSearch.value = ''
      return
    }
    if (value !== localSearch.value) {
      localSearch.value = value
    }
  },
  { immediate: true },
)

watch(localSearch, (value) => {
  if (value !== props.search) {
    emit('update:search', value)
  }
})

const computedError = computed(() => props.error?.toString().trim() ?? '')
const hasError = computed(() => computedError.value.length > 0)

const dataTableDensity = computed(() => (props.dense ? 'compact' : 'comfortable'))

const defaultItemsPerPageOptions = computed<ItemsPerPageOption[]>(() => [
  10,
  25,
  50,
  {
    title: t('common.labels.all'),
    value: -1,
  },
])

const computedItemsPerPageOptions = computed<ItemsPerPageOption[]>(
  () => props.itemsPerPageOptions ?? defaultItemsPerPageOptions.value,
)

const skeletonRowCount = computed(() => {
  if (!loading.value) {
    return 0
  }

  const itemCount = Array.isArray(items.value) ? items.value.length : 0
  if (itemCount > 0) {
    return Math.min(itemCount, 6)
  }

  const firstPositiveOption = computedItemsPerPageOptions.value.find((option) => {
    const value = typeof option === 'number' ? option : option.value
    return typeof value === 'number' && value > 0
  })

  const fallbackValue =
    typeof firstPositiveOption === 'number'
      ? firstPositiveOption
      : firstPositiveOption?.value

  const safeFallback =
    typeof fallbackValue === 'number' && fallbackValue > 0 ? fallbackValue : 6

  return Math.min(safeFallback, 6)
})

function getHeaderKey(header: DataTableHeader, index: number) {
  const possibleKey =
    (header as Record<string, unknown>).key ??
    (header as Record<string, unknown>).value ??
    (typeof (header as Record<string, unknown>).title === 'string'
      ? (header as Record<string, unknown>).title
      : undefined)

  if (typeof possibleKey === 'string' || typeof possibleKey === 'number') {
    return possibleKey
  }

  return `col-${index}`
}

const toolbarStyle = computed(() => ({
  '--admin-table-color': `var(--v-theme-${props.color})`,
}))

const hasToolbarContent = computed(
  () =>
    Boolean(props.title) ||
    Boolean(props.subtitle) ||
    Boolean(slots['header-actions']),
)

const dataTableSlots = computed(() => {
  const reserved = new Set(['default', 'header-actions', 'toolbar', 'footer'])
  return Object.keys(slots).filter((slot) => !reserved.has(slot))
})

const computedSearchPlaceholder = computed(
  () => searchPlaceholder.value || t('common.labels.search'),
)

function refresh() {
  if (props.refreshable !== false) {
    emit('refresh')
  }
}
</script>

<template>
  <v-card
    class="admin-data-table"
    rounded="xl"
    :elevation="2"
  >
    <v-progress-linear
      v-if="loading"
      class="admin-data-table__loader"
      :color="color"
      height="3"
      indeterminate
    />

    <div
      v-if="hasToolbarContent"
      class="admin-data-table__toolbar"
      :style="toolbarStyle"
    >
      <div class="admin-data-table__titles">
        <p v-if="subtitle" class="admin-data-table__subtitle text-caption mb-1">
          {{ subtitle }}
        </p>
        <h2 v-if="title" class="admin-data-table__title">
          {{ title }}
        </h2>
      </div>
      <div class="admin-data-table__toolbar-actions">
        <slot name="header-actions" />
        <v-btn
          v-if="refreshable"
          class="admin-data-table__refresh"
          :disabled="loading"
          icon="mdi-refresh"
          variant="tonal"
          :color="color"
          @click="refresh"
        />
      </div>
    </div>

    <slot name="toolbar" />

    <client-only v-if="showSearch">
      <teleport to="#app-bar">
        <v-text-field
          v-model="localSearch"
          class="mr-2"
          prepend-inner-icon="mdi-magnify"
          :label="computedSearchPlaceholder"
          single-line
          hide-details
          density="compact"
          rounded="xl"
          flat
          icon-color
          glow
          variant="solo"
          style="width: 250px"
        />
      </teleport>
    </client-only>

    <v-expand-transition>
      <v-alert
        v-if="hasError"
        class="mx-6 mt-4"
        type="error"
        variant="tonal"
      >
        {{ computedError }}
      </v-alert>
    </v-expand-transition>

    <v-data-table
      v-bind="attrs"
      :headers="headers"
      :items="items"
      :loading="loading"
      :density="dataTableDensity"
      :search="showSearch ? localSearch : undefined"
      :items-per-page-options="computedItemsPerPageOptions"
      class="admin-data-table__table"
      hover
      rounded="0"
    >
      <template #loading="{ isActive }">
        <tbody v-if="isActive" class="admin-data-table__skeleton-body">
          <tr v-for="rowIndex in skeletonRowCount" :key="`skeleton-row-${rowIndex}`">
            <td
              v-for="(header, headerIndex) in headers"
              :key="`skeleton-cell-${rowIndex}-${getHeaderKey(header, headerIndex)}`"
            >
              <v-skeleton-loader class="admin-data-table__skeleton" type="text" />
            </td>
          </tr>
        </tbody>
      </template>

      <template
        v-for="slotName in dataTableSlots"
        #[slotName]="slotProps"
      >
        <slot
          :name="slotName"
          v-bind="slotProps"
        />
      </template>
    </v-data-table>

    <div v-if="$slots.footer" class="admin-data-table__footer">
      <slot name="footer" />
    </div>
  </v-card>
</template>

<style scoped>
.admin-data-table {
  position: relative;
  overflow: hidden;
  background: color-mix(in srgb, var(--v-theme-surface) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--v-theme-outline-variant) 60%, transparent);
  box-shadow: 0 24px 48px -28px rgb(15 23 42 / 45%);
}

.admin-data-table__loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.admin-data-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--admin-table-color) 85%, #0000 15%),
    color-mix(in srgb, var(--admin-table-color) 55%, var(--v-theme-surface) 45%)
  );
  color: color-mix(in srgb, #fff 93%, var(--admin-table-color) 7%);
}

.admin-data-table__titles {
  flex: 1 1 220px;
  min-width: 200px;
}

.admin-data-table__title {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: 0.0125em;
  margin: 0;
}

.admin-data-table__subtitle {
  opacity: 0.85;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-data-table__toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.admin-data-table__refresh {
  box-shadow: none;
}

.admin-data-table__table {
  border-radius: 24px 24px 0 0;
}

.admin-data-table__footer {
  padding: 16px 24px 24px;
  border-top: 1px solid color-mix(in srgb, var(--v-theme-outline-variant) 50%, transparent);
  background: color-mix(in srgb, var(--v-theme-surface) 96%, transparent);
}

:deep(.v-data-table__th) {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
}

:deep(.v-data-table__tr:hover) {
  background: color-mix(in srgb, var(--v-theme-primary) 8%, transparent);
}

:deep(.v-data-table-footer) {
  border-top: 1px solid color-mix(in srgb, var(--v-theme-outline-variant) 55%, transparent);
  padding: 16px 24px;
}

:deep(.v-data-table__wrapper) {
  padding: 0 16px 8px;
}

.admin-data-table__skeleton-body td {
  padding: 16px;
}

.admin-data-table__skeleton-body tr:not(:last-child) td {
  border-bottom: 1px solid
    color-mix(in srgb, var(--v-theme-outline-variant) 55%, transparent);
}

.admin-data-table__skeleton {
  display: block;
  width: 100%;
  height: 18px;
  border-radius: 999px;
}

@media (max-width: 600px) {
  .admin-data-table__toolbar {
    padding: 16px;
  }

  .admin-data-table__toolbar-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .admin-data-table__search {
    flex: 1 1 100%;
    max-width: none;
    min-width: 0;
  }
}
</style>
