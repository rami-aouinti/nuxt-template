<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmContact } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmContacts',
  icon: 'mdi-card-account-phone-outline',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.value'), key: 'value', minWidth: 220 },
  { title: t('navigation.crmClients'), key: 'client', minWidth: 200 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmContact) => ({
  id: item.id,
  value: item.value,
  client: item.client?.name,
  createdAt: item.createdAt,
  actions: buildCrmAdminResourceActionLinks(item['@id'] ?? `/contacts/${item.id}`),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmContacts')"
    endpoint="/contacts"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['value', 'client']"
  />
</template>
