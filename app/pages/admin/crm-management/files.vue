<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmFile } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmFiles',
  icon: 'mdi-file-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.name'), key: 'originalName', minWidth: 220 },
  { title: t('common.labels.type'), key: 'mimeType', minWidth: 160 },
  { title: t('common.labels.size'), key: 'size', minWidth: 120 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmFile) => ({
  id: item.id,
  originalName: item.originalName,
  mimeType: item.mimeType,
  size: item.size,
  createdAt: item.createdAt,
  actions: buildCrmAdminResourceActionLinks(item['@id'] ?? `/files/${item.id}`),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmFiles')"
    endpoint="/files"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['originalName', 'mimeType']"
  />
</template>
