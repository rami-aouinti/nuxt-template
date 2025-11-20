<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmTask } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmTasks',
  icon: 'mdi-format-list-checkbox',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.name'), key: 'name', minWidth: 220 },
  { title: t('navigation.crmProjects'), key: 'project', minWidth: 180 },
  { title: t('common.labels.status'), key: 'status', minWidth: 160 },
  { title: t('common.labels.assignee'), key: 'assignee', minWidth: 180 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmTask) => ({
  id: item.id,
  name: item.name,
  project: item.project?.name,
  status: item.status?.name,
  assignee: item.assignee?.name,
  createdAt: item.createdAt,
  actions: buildCrmAdminResourceActionLinks(item['@id'] ?? `/tasks/${item.id}`),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmTasks')"
    endpoint="/tasks"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['name', 'project', 'status', 'assignee']"
  />
</template>
