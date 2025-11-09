<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  layout: 'admin',
  icon: 'mdi-monitor-dashboard',
  title: 'navigation.dashboard',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
const adminStore = useAdminStore()

await adminStore.fetchAllCounts()

const stats = computed(() => [
  {
    icon: 'mdi-account-multiple-outline',
    title: t('navigation.users'),
    value: adminStore.userCount.value ?? 0,
    url: '/admin/user-management/users',
    color: 'primary',
    caption: t('admin.metrics.users'),
  },
  {
    icon: 'mdi-shield-key-outline',
    title: t('navigation.roles'),
    value: adminStore.roleCount.value ?? 0,
    url: '/admin/user-management/roles',
    color: 'primary',
    caption: t('admin.metrics.roles'),
  },
  {
    icon: 'mdi-account-group-outline',
    title: t('navigation.userGroups'),
    value: adminStore.userGroupCount.value ?? 0,
    url: '/admin/user-management/user-groups',
    color: 'primary',
    caption: t('admin.metrics.groups'),
  },
  {
    icon: 'mdi-office-building',
    title: t('navigation.workplaces'),
    value: adminStore.workplaceCount.value ?? 0,
    url: '/admin/user-management/workplaces',
    color: 'primary',
    caption: t('admin.metrics.workplaces'),
  },
  {
    icon: 'mdi-key-outline',
    title: t('navigation.apiKeys'),
    value: adminStore.apiKeyCount.value ?? 0,
    url: '/admin/user-management/api-keys',
    color: 'primary',
    caption: t('admin.metrics.apiKeys'),
  },
])
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <StatsCard
          :title="stat.title"
          :unit="stat.unit"
          :color="stat.color"
          :icon="stat.icon"
          :value="stat.value"
          :url="stat.url"
        >
          <template #footer>
            {{ stat.caption }}
          </template>
        </StatsCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="12">
        <v-card class="pa-2">
          <ChartLine />
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-2">
          <ChartRadar />
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-2">
          <ChartPie />
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-2">
          <ChartBar />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card:not(.stats-card) {
  height: 340px;
}
</style>
