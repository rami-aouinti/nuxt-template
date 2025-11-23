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
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ActionCell from '../../../components/education/ActionCell.vue'
import Toolbar from '../../../components/education/Toolbar.vue'
import courseService from '~/services/courseService'
import api from '~/config/api'

const route = useRoute()
const router = useRouter()

const options = ref({
  sortBy: [],
  sortDesc: false,
  page: 1,
  itemsPerPage: 5,
})

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
const items = ref<Record<string, any>[]>([])
const isLoading = ref(false)
const totalItems = ref(0)

const fetchCourses = async (payload: Record<string, any> = {}) => {
  isLoading.value = true

  const { page, itemsPerPage, sortBy, sortDesc } = {
    ...options.value,
    ...payload,
  }

  const params: Record<string, any> = {
    page,
    itemsPerPage,
  }

  if (sortBy) {
    params[`order[${sortBy}]`] = sortDesc ? 'desc' : 'asc'
  }

  try {
    const { totalItems: count, items: courseItems } = await courseService.listAll(params)

    items.value = courseItems ?? []
    totalItems.value = count ?? items.value.length
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch courses', error)
    items.value = []
    totalItems.value = 0
  } finally {
    isLoading.value = false
  }
}

const handleUpdateOptions = (payload: Record<string, any> = {}) => {
  const { page, itemsPerPage, sortBy } = payload
  const primarySort = Array.isArray(sortBy) && sortBy.length > 0 ? sortBy[0] : null
  const sortKey = primarySort && typeof primarySort === 'object' ? primarySort.key : primarySort
  const sortDesc =
    primarySort && typeof primarySort === 'object' ? primarySort.order === 'desc' : false

  options.value = { ...options.value, page, itemsPerPage, sortBy: sortKey, sortDesc }

  fetchCourses(options.value)
}

const addHandler = () => {
  router.push({
    name: 'CourseCreate',
    query: route.query,
  })
}

const showHandler = (item: Record<string, any>) => {
  router.push({
    name: 'CourseShow',
    params: route.query,
    query: { ...route.query, id: item['@id'] },
  })
}

const editHandler = (item: Record<string, any>) => {
  router.push({
    name: 'CourseUpdate',
    params: { id: item['@id'] },
    query: {
      ...route.query,
      id: item['@id'],
      page: options.value.page,
      itemsPerPage: options.value.itemsPerPage,
    },
  })
}

const deleteHandler = async (item: Record<string, any>) => {
  isLoading.value = true

  try {
    await api.delete(item['@id'])
    await fetchCourses(options.value)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete course', error)
  } finally {
    isLoading.value = false
  }
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

  fetchCourses(options.value)
})
</script>
