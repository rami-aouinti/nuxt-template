<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmHistory } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmHistories',
  icon: 'mdi-history',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.action'), key: 'action', minWidth: 160 },
  { title: t('common.labels.user'), key: 'username', minWidth: 160 },
  { title: t('common.labels.createdAt'), key: 'loggedAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmHistory) => ({
  id: item.id,
  action: item.action,
  username: item.username,
  loggedAt: item.loggedAt,
  actions: buildCrmAdminResourceActionLinks(
    item['@id'] ?? `/histories/${item.id}`,
  ),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmHistories')"
    endpoint="/histories"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['action', 'username']"
  />
</template>
