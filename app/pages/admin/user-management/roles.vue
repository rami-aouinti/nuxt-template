<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  title: 'navigation.roles',
  icon: 'mdi-shield-key-outline',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
const adminStore = useAdminStore()

await adminStore.fetchRoles()

const headers = computed<DataTableHeader[]>(() => [
  { title: t('userManagement.roles.table.id'), key: 'id' },
  { title: t('userManagement.roles.table.description'), key: 'description' },
])
const search = ref('')

const pending = adminStore.rolesPending
const error = adminStore.rolesError
const refresh = () => adminStore.refreshRoles()

const items = computed(() => adminStore.roles.value ?? [])
const tableError = computed(() =>
  error.value ? t('userManagement.roles.alerts.loadFailed') : null,
)
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <AdminDataTable
          v-model:search="search"
          :headers="headers"
          :items="items"
          :loading="pending"
          :error="tableError"
          :title="t('userManagement.roles.cardTitle')"
          :subtitle="t('navigation.userManagement')"
          item-value="id"
          @refresh="refresh()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
