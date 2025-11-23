<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    :items-length="itemsLength"
    :items-per-page="rowsModel"
    :page="page"
    :loading="loading"
    :show-select="showSelect"
    :sort-by="sortBy"
    class="text-body-2"
    density="comfortable"
    @update:page="onPage"
    @update:items-per-page="onRowsChange"
    @update:sort-by="onSort"
  >
    <template
      v-for="col in columns"
      :key="col.key"
      #[`item.${col.key}`]="slotProps"
    >
      <span :class="col.bodyClass">
        <component
          v-if="col.body"
          :is="col.body"
          v-bind="slotProps"
        />
        <template v-else>
          {{ slotProps.item?.[col.key] }}
        </template>
      </span>
    </template>

    <template
      v-if="$slots.header"
      #top
    >
      <slot name="header" />
    </template>
    <template
      v-if="$slots.footer"
      #bottom
    >
      <slot name="footer" />
    </template>
    <template
      v-if="$slots.empty"
      #no-data
    >
      <slot name="empty" />
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, provide, ref } from "vue"

const props = defineProps({
  value: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  totalRecords: { type: Number, default: 0 },
  rows: { type: Number, default: 10 },
  loading: { type: Boolean, default: false },
  dataKey: { type: String, default: null },
  selection: { type: [Array, Object], default: () => [] },
})

const emit = defineEmits([
  "update:selection",
  "update:rows",
  "update:sort-field",
  "update:sort-order",
  "sort",
  "page",
])

const registeredColumns = ref([])
const showSelect = computed(() => registeredColumns.value.some(col => col.selectionMode))
const columns = computed(() =>
  registeredColumns.value.map(col => ({
    key: col.field || col.header || `col-${Math.random()}`,
    title: col.header || col.field,
    sortable: col.sortable,
    body: col.body,
    bodyClass: col.bodyClass,
    selectionMode: col.selectionMode,
  })),
)
const headers = computed(() =>
  columns.value.map(col => ({
    key: col.key,
    title: col.title,
    sortable: col.sortable,
  })),
)
provide("primevue-register-column", column => {
  registeredColumns.value.push(column)
  return () => {
    registeredColumns.value = registeredColumns.value.filter(c => c !== column)
  }
})

const items = computed(() => props.value?.length ? props.value : props.values)
const itemsLength = computed(() => (props.totalRecords || items.value.length))

const selected = computed({
  get: () => props.selection,
  set: value => emit("update:selection", value),
})

const rowsModel = computed({
  get: () => props.rows,
  set: value => emit("update:rows", value),
})

const page = ref(1)
const sortBy = ref([])

function onPage(pageInfo) {
  page.value = Array.isArray(pageInfo) ? pageInfo[0] : Number(pageInfo) || 1
  emit("page", { page: page.value })
}

function onRowsChange(value) {
  rowsModel.value = value
}

function onSort(value) {
  sortBy.value = value
  const first = Array.isArray(value) && value[0] ? value[0] : null
  if (first) {
    emit("update:sort-field", first.key)
    emit("update:sort-order", first.order === "desc" ? -1 : 1)
  }
  emit("sort", value)
}
</script>
