<script setup lang="ts">
import { computed, useSlots } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import AdminCrmResourceActions from '~/components/Admin/AdminCrmResourceActions.vue'
import { useCrmAdminResource } from '~/composables/useCrmAdminResource'
import type { DataTableHeader } from 'vuetify'

type MapItemFn = (item: any, index: number) => Record<string, any>

type Props = {
  title: string
  subtitle?: string
  endpoint: string
  headers: DataTableHeader[]
  mapItem: MapItemFn
  searchFields?: string[]
  itemsPerPageOptions?: (number | { title: string; value: number })[]
}

const props = defineProps<Props>()

const slots = useSlots()

const {
  search,
  filteredRows,
  pending,
  errorMessage,
  refresh,
} = await useCrmAdminResource(props.endpoint, props.mapItem, {
  searchFields: props.searchFields,
})

const tableHeaders = computed(() => props.headers)
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :title="title"
    :subtitle="subtitle"
    :headers="tableHeaders"
    :items="filteredRows"
    :loading="pending"
    :error="errorMessage"
    :items-per-page-options="itemsPerPageOptions"
    @refresh="refresh"
  >
    <template v-for="(_, slotName) in slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
    <template #item.actions="{ item }">
      <AdminCrmResourceActions
        :show-url="item.actions?.show"
        :edit-url="item.actions?.edit"
        :delete-url="item.actions?.delete"
      />
    </template>
  </AdminDataTable>
</template>
