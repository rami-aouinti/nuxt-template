<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import AdminCrmResourceActions from '~/components/Admin/AdminCrmResourceActions.vue'
import type { AdminCreateField } from '~/components/Admin/AdminDataTable.vue'
import { useCrmAdminResource } from '~/composables/useCrmAdminResource'
import { useCrmApi } from '~/composables/useCrmApi'
import { Notify } from '~/stores/notification'
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
  createFields?: AdminCreateField[]
}

const props = defineProps<Props>()

const slots = useSlots()
const requestFetch = useRequestFetch()
const { t } = useI18n()
const { withBase, jsonLdHeaders } = useCrmApi()
const createError = ref<string | null>(null)
const creating = ref(false)

const { search, filteredRows, pending, errorMessage, refresh } =
  await useCrmAdminResource(props.endpoint, props.mapItem, {
    searchFields: props.searchFields,
  })

const tableHeaders = computed(() => props.headers)
const combinedError = computed(() => createError.value || errorMessage.value)

function extractRequestError(error: unknown, fallback: string): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  if (error && typeof error === 'object') {
    const maybeMessage =
      (error as { data?: { message?: string }; message?: string }).data
        ?.message || (error as { message?: string }).message

    if (maybeMessage) {
      return maybeMessage
    }
  }

  return fallback
}

type CreatePayload = Record<string, string | null | undefined> & {
  type?: string | null
}

async function handleCreate(payload: CreatePayload) {
  if (creating.value) {
    return
  }

  const normalizedPayload = Object.entries(payload).reduce<
    Record<string, string>
  >((acc, [key, value]) => {
    if (key === 'type') {
      return acc
    }

    if (typeof value === 'string') {
      const normalized = value.trim()
      if (normalized.length > 0) {
        acc[key] = normalized
      }
    }

    return acc
  }, {})

  if (!normalizedPayload.name) {
    return
  }

  creating.value = true
  createError.value = null

  try {
    await requestFetch(withBase(props.endpoint), {
      method: 'POST',
      headers: jsonLdHeaders.value,
      body: normalizedPayload,
    })

    Notify.success(t('common.feedback.createSuccess'))
    await refresh()
  } catch (error) {
    createError.value = extractRequestError(
      error,
      t('common.unexpectedError'),
    )
    Notify.error(createError.value)
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <AdminDataTable
    v-model:search="search"
    :title="title"
    :subtitle="subtitle"
    :headers="tableHeaders"
    :items="filteredRows"
    :loading="pending || creating"
    :error="combinedError"
    :items-per-page-options="itemsPerPageOptions"
    :create-enabled="!creating"
    :create-fields="props.createFields"
    @refresh="refresh"
    @create="handleCreate"
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
