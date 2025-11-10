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
    exportable?: boolean
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
    exportable: true,
  },
)

const emit = defineEmits<{
  (event: 'update:search', value: string): void
  (event: 'refresh'): void
}>()

const slots = useSlots()
const attrs = useAttrs()
const { t, locale } = useI18n()

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
  exportable,
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

const dataTableDensity = computed(() =>
  props.dense ? 'compact' : 'comfortable',
)

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

type NormalizedItemsPerPageOption = {
  value: number
  title: string
}

const numberFormatter = computed(() => new Intl.NumberFormat(locale.value))

const itemsPerPageSelectOptions = computed<NormalizedItemsPerPageOption[]>(() =>
  computedItemsPerPageOptions.value
    .map((option) => {
      const rawValue = typeof option === 'number' ? option : option.value

      if (typeof rawValue !== 'number' || Number.isNaN(rawValue)) {
        return null
      }

      const fallbackTitle =
        rawValue === -1
          ? t('common.labels.all')
          : numberFormatter.value.format(rawValue)

      const rawTitle =
        typeof option === 'number'
          ? undefined
          : typeof option.title === 'string'
            ? option.title
            : undefined

      const title = rawTitle && rawTitle.trim().length > 0 ? rawTitle : fallbackTitle

      return {
        value: rawValue,
        title,
      }
    })
    .filter((option): option is NormalizedItemsPerPageOption => option !== null),
)

const page = ref(1)
const itemsPerPage = ref<number>(10)

watch(
  itemsPerPageSelectOptions,
  (options) => {
    const fallback = options[0]?.value ?? 10

    if (!options.some((option) => option.value === itemsPerPage.value)) {
      itemsPerPage.value = fallback
    }
  },
  { immediate: true },
)

const itemCount = computed(() => (Array.isArray(items.value) ? items.value.length : 0))

const pageCount = computed(() => {
  if (itemCount.value === 0) {
    return 1
  }

  if (itemsPerPage.value <= 0 || itemsPerPage.value === -1) {
    return 1
  }

  return Math.max(1, Math.ceil(itemCount.value / itemsPerPage.value))
})

watch(
  [itemCount, pageCount],
  () => {
    if (page.value > pageCount.value) {
      page.value = pageCount.value
    }

    if (page.value < 1) {
      page.value = 1
    }
  },
  { immediate: true },
)

watch(itemsPerPage, () => {
  page.value = 1
})

const displayedStartIndex = computed(() => {
  if (itemCount.value === 0) {
    return 0
  }

  if (itemsPerPage.value <= 0 || itemsPerPage.value === -1) {
    return 1
  }

  return Math.min((page.value - 1) * itemsPerPage.value + 1, itemCount.value)
})

const displayedEndIndex = computed(() => {
  if (itemCount.value === 0) {
    return 0
  }

  if (itemsPerPage.value <= 0 || itemsPerPage.value === -1) {
    return itemCount.value
  }

  return Math.min(page.value * itemsPerPage.value, itemCount.value)
})

const paginationSummary = computed(() =>
  t('common.pagination.range', {
    start: numberFormatter.value.format(displayedStartIndex.value),
    end: numberFormatter.value.format(displayedEndIndex.value),
    total: numberFormatter.value.format(itemCount.value),
  }),
)

const showPaginationButtons = computed(() => pageCount.value > 1)
const showItemsPerPageSelect = computed(() => itemsPerPageSelectOptions.value.length > 1)

const canGoToPreviousPage = computed(() => page.value > 1 && itemCount.value > 0)
const canGoToNextPage = computed(
  () => page.value < pageCount.value && itemCount.value > 0,
)

const handleItemsPerPageUpdate = (value: number | string) => {
  const numericValue =
    typeof value === 'number' ? value : Number.parseInt(String(value), 10)

  if (Number.isNaN(numericValue)) {
    return
  }

  itemsPerPage.value = numericValue
}

const handleTablePageUpdate = (value: number | string) => {
  const numericValue =
    typeof value === 'number' ? value : Number.parseInt(String(value), 10)

  if (!Number.isFinite(numericValue)) {
    return
  }

  if (numericValue < 1) {
    page.value = 1
    return
  }

  page.value = Math.min(Math.round(numericValue), pageCount.value)
}

const goToPreviousPage = () => {
  if (canGoToPreviousPage.value) {
    page.value -= 1
  }
}

const goToNextPage = () => {
  if (canGoToNextPage.value) {
    page.value += 1
  }
}

const skeletonRowCount = computed(() => {
  if (!loading.value) {
    return 0
  }

  const itemCount = Array.isArray(items.value) ? items.value.length : 0
  if (itemCount > 0) {
    return Math.min(itemCount, 6)
  }

  const firstPositiveOption = computedItemsPerPageOptions.value.find(
    (option) => {
      const value = typeof option === 'number' ? option : option.value
      return typeof value === 'number' && value > 0
    },
  )

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

type NormalizedHeader = {
  title: string
  valuePath: string
}

const normalizedHeaders = computed<NormalizedHeader[]>(() =>
  headers.value
    .map((header, index) => {
      if ((header as Record<string, unknown>).exportable === false) {
        return null
      }

      const rawTitle = (header as Record<string, unknown>).title
      const title =
        typeof rawTitle === 'string' && rawTitle.trim().length > 0
          ? rawTitle
          : String(getHeaderKey(header, index))

      const valueKey =
        typeof (header as Record<string, unknown>).value === 'string'
          ? ((header as Record<string, unknown>).value as string)
          : typeof (header as Record<string, unknown>).key === 'string'
            ? ((header as Record<string, unknown>).key as string)
            : undefined

      if (!valueKey) {
        return null
      }

      return {
        title,
        valuePath: valueKey,
      }
    })
    .filter((value): value is NormalizedHeader => value !== null),
)

function getNestedValue(item: unknown, path: string) {
  if (item == null || typeof item !== 'object') {
    return ''
  }

  return path.split('.').reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== 'object') {
      return undefined
    }

    return (current as Record<string, unknown>)[segment]
  }, item)
}

const exportableItems = computed(() =>
  Array.isArray(items.value) ? [...items.value] : [],
)

const canExport = computed(
  () =>
    exportable.value !== false &&
    normalizedHeaders.value.length > 0 &&
    exportableItems.value.length > 0,
)

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const exportFileBaseName = computed(() => {
  const rawTitle = typeof title.value === 'string' ? title.value : ''
  const sanitized = sanitizeFileName(rawTitle)
  return sanitized.length > 0 ? sanitized : 'data-table'
})

function buildExportFileName(extension: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${exportFileBaseName.value}-${timestamp}.${extension}`
}

function formatItemValue(item: unknown, path: string) {
  const value = getNestedValue(item, path)

  if (value == null) {
    return ''
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      console.warn('Unable to stringify export value', error)
      return ''
    }
  }

  return String(value)
}

function createExportRows() {
  return exportableItems.value.map((item) =>
    normalizedHeaders.value.map((header) =>
      formatItemValue(item, header.valuePath),
    ),
  )
}

async function exportToExcel() {
  if (!import.meta.client || !canExport.value) {
    return
  }

  const [{ utils, writeFileXLSX }] = await Promise.all([import('xlsx')])

  const worksheetData = [
    normalizedHeaders.value.map((header) => header.title),
    ...createExportRows(),
  ]

  const workbook = utils.book_new()
  const worksheet = utils.aoa_to_sheet(worksheetData)
  utils.book_append_sheet(workbook, worksheet, 'Data')
  writeFileXLSX(workbook, buildExportFileName('xlsx'))
}

async function exportToPdf() {
  if (!import.meta.client || !canExport.value) {
    return
  }

  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF()
  autoTable(doc, {
    head: [normalizedHeaders.value.map((header) => header.title)],
    body: createExportRows(),
  })

  doc.save(buildExportFileName('pdf'))
}

function refresh() {
  if (props.refreshable !== false) {
    emit('refresh')
  }
}
</script>

<template>
  <v-card class="admin-data-table" rounded="xl" :elevation="2">
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
        <v-menu v-if="exportable" location="bottom end">
          <template #activator="{ props: menuProps }">
            <v-btn
              class="admin-data-table__export"
              v-bind="menuProps"
              :color="color"
              :disabled="!canExport || loading"
              prepend-icon="mdi-download"
              variant="tonal"
            >
              {{ t('common.labels.export') }}
            </v-btn>
          </template>
          <v-list min-width="220">
            <v-list-item
              :disabled="!canExport || loading"
              prepend-icon="mdi-file-excel"
              @click="exportToExcel"
            >
              <v-list-item-title>
                {{ t('common.labels.exportExcel') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="!canExport || loading"
              prepend-icon="mdi-file-pdf-box"
              @click="exportToPdf"
            >
              <v-list-item-title>
                {{ t('common.labels.exportPdf') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
          color="primary"
          variant="outlined"
          style="width: 250px"
        />
      </teleport>
    </client-only>

    <v-expand-transition>
      <v-alert v-if="hasError" class="mx-6 mt-4" type="error" variant="tonal">
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
      :items-per-page="itemsPerPage"
      :page="page"
      class="admin-data-table__table"
      hover
      hide-default-footer
      rounded="0"
      @update:items-per-page="handleItemsPerPageUpdate"
      @update:page="handleTablePageUpdate"
    >
      <template #loading="{ isActive }">
        <tbody v-if="isActive" class="admin-data-table__skeleton-body">
          <tr
            v-for="rowIndex in skeletonRowCount"
            :key="`skeleton-row-${rowIndex}`"
          >
            <td
              v-for="(header, headerIndex) in headers"
              :key="`skeleton-cell-${rowIndex}-${getHeaderKey(header, headerIndex)}`"
            >
              <v-skeleton-loader
                class="admin-data-table__skeleton"
                type="text"
              />
            </td>
          </tr>
        </tbody>
      </template>

      <template v-for="slotName in dataTableSlots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template #bottom>
        <div class="admin-data-table__pagination">
          <div class="admin-data-table__pagination-info">
            {{ paginationSummary }}
          </div>
          <div class="admin-data-table__pagination-controls">
            <v-select
              v-if="showItemsPerPageSelect"
              v-model="itemsPerPage"
              class="admin-data-table__pagination-select"
              :items="itemsPerPageSelectOptions"
              density="compact"
              hide-details
              item-title="title"
              item-value="value"
              :label="t('common.pagination.rowsPerPage')"
              variant="outlined"
            />
            <div
              v-if="showPaginationButtons"
              class="admin-data-table__pagination-buttons"
            >
              <v-btn
                icon="mdi-chevron-left"
                variant="tonal"
                size="small"
                :disabled="!canGoToPreviousPage"
                @click="goToPreviousPage"
              />
              <v-btn
                icon="mdi-chevron-right"
                variant="tonal"
                size="small"
                :disabled="!canGoToNextPage"
                @click="goToNextPage"
              />
            </div>
          </div>
        </div>
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
  background: color-mix(
    in srgb,
    rgba(var(--v-theme-surface), 92%),
    rgba(var(--v-theme-primary), 22%)
  );
  border: 1px solid
    color-mix(in srgb, var(--v-theme-outline-variant) 60%, transparent);
  box-shadow: 0 24px 48px -28px rgba(var(--v-theme-primary), 92%);
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

.admin-data-table__pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid
    color-mix(in srgb, var(--v-theme-outline-variant) 38%, transparent);
  background: color-mix(
    in srgb,
    rgba(var(--v-theme-surface), 0.96) 90%,
    rgba(var(--v-theme-primary), 0.12)
  );
}

.admin-data-table__pagination-info {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

.admin-data-table__pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-height: 40px;
}

.admin-data-table__pagination-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-data-table__pagination-select {
  min-width: 148px;
  max-width: 200px;
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
  border-top: 1px solid
    color-mix(in srgb, var(--v-theme-outline-variant) 50%, transparent);
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
  border-top: 1px solid
    color-mix(in srgb, var(--v-theme-outline-variant) 55%, transparent);
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
