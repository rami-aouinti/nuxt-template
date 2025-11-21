<script setup lang="ts">
import { computed } from 'vue'
import CrmResourcePage from './components/CrmResourcePage.vue'
import type { AdminCreateField } from '~/components/Admin/AdminDataTable.vue'
import type { CrmLanguage } from '~/types/crm'
import { buildCrmAdminResourceActionLinks } from '~/utils/crm/admin'

definePageMeta({
  title: 'navigation.crmLanguages',
  icon: 'mdi-translate',
  drawerIndex: 6,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: 80 },
  { title: t('common.labels.name'), key: 'name', minWidth: 200 },
  { title: t('common.labels.code'), key: 'code', width: 160 },
  { title: t('common.labels.createdAt'), key: 'createdAt', width: 180 },
  { title: '', key: 'actions', sortable: false, width: 140 },
])

const createFields = computed<AdminCreateField[]>(() => [
  {
    key: 'name',
    label: t('common.labels.name'),
    icon: 'mdi-form-textbox',
    required: true,
  },
  {
    key: 'code',
    label: t('common.labels.code'),
    icon: 'mdi-translate',
    required: true,
  },
])

const mapItem = (item: CrmLanguage) => ({
  id: item.id,
  name: item.name,
  code: item.code,
  createdAt: item.createdAt,
  actions: buildCrmAdminResourceActionLinks(
    item['@id'] ?? `/languages/${item.id}`,
  ),
})
</script>

<template>
  <CrmResourcePage
    :title="t('navigation.crmLanguages')"
    endpoint="/languages"
    :headers="headers"
    :map-item="mapItem"
    :search-fields="['name', 'code']"
    :create-fields="createFields"
  />
</template>
