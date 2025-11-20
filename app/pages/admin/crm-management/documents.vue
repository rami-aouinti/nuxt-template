<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmDocument } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmDocuments',
  icon: 'mdi-file-document-outline',
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

const mapItem = (item: CrmDocument) => ({
  id: item.id,
  name: item.name,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  actions: buildCrmAdminResourceActionLinks(item['@id'] ?? `/documents/${item.id}`),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmDocuments')"
    endpoint="/documents"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['name']"
  />
</template>
