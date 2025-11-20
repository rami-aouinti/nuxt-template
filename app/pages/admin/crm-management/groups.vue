<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmGroup } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmGroups',
  icon: 'mdi-account-multiple-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.name'), key: 'name', minWidth: 220 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: t('common.labels.updatedAt'), key: 'updatedAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmGroup) => ({
  id: item.id,
  name: item.name,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  actions: buildCrmAdminResourceActionLinks(item['@id'] ?? `/groups/${item.id}`),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmGroups')"
    endpoint="/groups"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['name']"
  />
</template>
