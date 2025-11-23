<template>
  <div class="page-list">
    <Toolbar :handle-add="addHandler" />

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <v-data-table-server
              v-model:selected="selected"
              v-model:items-per-page="options.itemsPerPage"
              v-model:page="options.page"
              :headers="headers"
              :items="tableItems"
              :items-length="totalItems"
              :loading="isLoading"
              :loading-text="t('Loading')"
              class="elevation-1"
              item-value="@id"
              show-select
              @update:options="handleUpdateOptions"
            >
              <template #item.title="{ value }">
                <div class="text-body-1 font-weight-medium">{{ value }}</div>
              </template>

              <template #item.localeLabel="{ value }">
                <v-chip color="primary" size="small" variant="tonal">
                  {{ value }}
                </v-chip>
              </template>

              <template #item.enabled="{ value }">
                <v-chip
                  :color="value ? 'success' : 'error'"
                  size="small"
                  variant="flat"
                  class="text-uppercase"
                >
                  {{ value ? t('Yes') : t('No') }}
                </v-chip>
              </template>

              <template #item.action="{ item }">
                <ActionCell
                  :handle-delete="() => deleteHandler(item.raw)"
                  :handle-edit="() => editHandler(item.raw)"
                  :handle-show="() => showHandler(item.raw)"
                />
              </template>
            </v-data-table-server>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <ConfirmDelete
      :show="showConfirmDialog"
      :handle-delete="confirmDelete"
      :handle-cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import ConfirmDelete from '../../../components/education/ConfirmDelete.vue'
import ActionCell from '../../../components/education/ActionCell.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import { useDatatableList } from '~/composables/education/datatableList'
import { useLocale } from '~/composables/education/locale'

const { t } = useI18n()
const store = useStore()
const route = useRoute()

const { onUpdateOptions, goToAddItem, goToEditItem, onShowItem, deleteItem, options } =
  useDatatableList('Page')
const { getLanguageName, fetchLanguageNameFromApi } = useLocale()

const headers = [
  { title: t('Title'), key: 'title' },
  { title: t('Language'), key: 'localeLabel' },
  { title: t('Category'), key: 'categoryTitle' },
  { title: t('Enabled'), key: 'enabled' },
  {
    title: t('Actions'),
    key: 'action',
    sortable: false,
    width: '140px',
  },
]

const selected = ref<string[]>([])
const pendingDelete = ref<Record<string, any> | null>(null)
const showConfirmDialog = ref(false)

const rawItems = computed(() => store.state['page']?.recents ?? [])
const isLoading = computed(() => store.state['page']?.isLoading ?? false)
const totalItems = computed(() => store.state['page']?.totalItems ?? 0)

const languageCache = ref<Record<string, string>>({})

const ensureLanguageName = (iso?: string) => {
  if (!iso) return t('Unknown')
  if (!languageCache.value[iso]) {
    languageCache.value[iso] = getLanguageName(iso)
    fetchLanguageNameFromApi(iso)
      .then((name) => {
        if (name) languageCache.value[iso] = name
      })
      .catch(() => {})
  }
  return languageCache.value[iso]
}

const tableItems = computed(() =>
  rawItems.value.map((item: Record<string, any>) => ({
    ...item,
    localeLabel: ensureLanguageName(item?.locale),
    categoryTitle: item?.category?.title ?? '-',
  })),
)

const handleUpdateOptions = (payload: Record<string, any> = {}) => {
  const { page, itemsPerPage, sortBy } = payload
  const primarySort = Array.isArray(sortBy) && sortBy.length > 0 ? sortBy[0] : null
  const sortKey = primarySort && typeof primarySort === 'object' ? primarySort.key : primarySort
  const sortDesc =
    primarySort && typeof primarySort === 'object' ? primarySort.order === 'desc' : false

  onUpdateOptions({
    page,
    itemsPerPage,
    sortBy: sortKey,
    sortDesc,
  })
}

const addHandler = () => {
  goToAddItem()
}

const showHandler = (item: Record<string, any>) => {
  onShowItem(item)
}

const editHandler = (item: Record<string, any>) => {
  goToEditItem(item)
}

const deleteHandler = (item: Record<string, any>) => {
  pendingDelete.value = item
  showConfirmDialog.value = true
}

const confirmDelete = () => {
  if (pendingDelete.value) {
    deleteItem(ref(pendingDelete.value))
  }
  showConfirmDialog.value = false
  pendingDelete.value = null
}

const cancelDelete = () => {
  showConfirmDialog.value = false
  pendingDelete.value = null
}

onMounted(() => {
  const { page, itemsPerPage } = route.query

  if (page) {
    const parsed = Number.parseInt(page as string, 10)
    if (Number.isFinite(parsed)) options.value.page = parsed
  }

  if (itemsPerPage) {
    const parsed = Number.parseInt(itemsPerPage as string, 10)
    if (Number.isFinite(parsed)) options.value.itemsPerPage = parsed
  }

  onUpdateOptions(options.value)
})
</script>
