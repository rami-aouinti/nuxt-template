<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmProject } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmProjects',
  icon: 'mdi-briefcase-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.name'), key: 'name', minWidth: 220 },
  { title: t('navigation.crmClients'), key: 'client', minWidth: 200 },
  { title: t('common.labels.status'), key: 'status', minWidth: 160 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmProject) => ({
  id: item.id,
  name: item.name,
  client: item.client?.name,
  status: item.status?.name,
  createdAt: item.createdAt,
  actions: buildCrmAdminResourceActionLinks(item['@id'] ?? `/projects/${item.id}`),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmProjects')"
    endpoint="/projects"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['name', 'client', 'status']"
  />
</template>
