<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { CrmAddress } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmAddresses',
  icon: 'mdi-home-map-marker',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.city'), key: 'city', minWidth: 180 },
  { title: t('common.labels.country'), key: 'country', minWidth: 180 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const mapItem = (item: CrmAddress) => ({
  id: item.id,
  city: item.city,
  country: item.country?.name,
  createdAt: item.createdAt,
  actions: buildCrmAdminResourceActionLinks(
    item['@id'] ?? `/addresses/${item.id}`,
  ),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmAddresses')"
    endpoint="/addresses"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['city', 'country']"
  />
</template>
