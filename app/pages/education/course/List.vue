<template>
  <div class="course-list">
    <Toolbar :handle-add="addHandler" />

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-data-table-server
            v-model:selected="selected"
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :headers="headers"
            :items="items"
            :items-length="totalItems"
            :loading="isLoading"
            :loading-text="$t('Loading')"
            class="elevation-1"
            item-value="@id"
            show-select
            @update:options="handleUpdateOptions"
          >
            <template #item.visibility="{ value }">
              {{ value }}
            </template>

            <template #item.expirationDate="{ value }">
              {{ value }}
            </template>

            <template #item.action="{ item }">
              <ActionCell
                :handle-delete="() => deleteHandler(item.raw)"
                :handle-edit="() => editHandler(item.raw)"
                :handle-show="() => showHandler(item.raw)"
              />
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import ActionCell from '../../../components/education/ActionCell.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import { useDatatableList } from '~/composables/education/datatableList'

const store = useStore()
const route = useRoute()
const { onUpdateOptions, goToAddItem, goToEditItem, onShowItem, deleteItem, options } =
  useDatatableList('Course')

const headers = [
  { title: 'title', key: 'title' },
  { title: 'code', key: 'code' },
  { title: 'courseLanguage', key: 'Language' },
  { title: 'visibility', key: 'visibility' },
  {
    title: 'Actions',
    key: 'action',
    sortable: false,
  },
]

const selected = ref<string[]>([])

const items = computed(() => store.state['course']?.recents ?? [])
const isLoading = computed(() => store.state['course']?.isLoading ?? false)
const totalItems = computed(() => store.state['course']?.totalItems ?? 0)

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
  deleteItem(ref(item))
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
