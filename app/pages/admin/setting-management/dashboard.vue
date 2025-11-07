<script setup lang="ts">
import {computed} from "vue";

definePageMeta({
  icon: 'mdi-monitor-dashboard',
  title: 'navigation.dashboard',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
const { t } = useI18n()

const headers = import.meta.server ? useRequestHeaders(['cookie', 'authorization']) : undefined;

const extractCount = (d: any): number => {
  if (typeof d === 'number') return d;
  if (!d || typeof d !== 'object') return 0;
  if (typeof d.count === 'number') return d.count;
  if (typeof d.total === 'number') return d.total;
  if (typeof d["hydra:totalItems"] === 'number') return d["hydra:totalItems"];
// Sometimes wrapped e.g. { data: { count: 5 } }
  if (d.data) return extractCount(d.data);
  return 0;
};

const fetchCount = (url: string, key: string) =>
  useFetch<number>(url, {
    key,
    headers,
    credentials: 'include',
    transform: extractCount,
  });

const [
  { data: userCount },
  { data: userGroupCount },
  { data: workplaceCount },
  { data: roleCount },
  { data: apiKeyCount },
] = await Promise.all([
  fetchCount('/api/v1/user/count', 'user-count'),
  fetchCount('/api/v1/user_group/count', 'user-group-count'),
  fetchCount('/api/v1/workplace/count', 'workplace-count'),
  fetchCount('/api/v1/role/count', 'role-count'),
  fetchCount('/api/v1/api_key/count', 'api-key-count'),
]);

const stats = computed(() => [
  {
    icon: 'mdi-account-multiple-outline',
    title: t('navigation.users'),
    value: userCount.value ?? 0,
    url: '/admin/user-management/users',
    color: 'primary',
    caption: t('admin.metrics.users'),
  },
  {
    icon: 'mdi-shield-key-outline',
    title: t('navigation.roles'),
    value: roleCount.value ?? 0,
    url: '/admin/user-management/roles',
    color: 'primary',
    caption: t('admin.metrics.roles'),
  },
  {
    icon: 'mdi-account-group-outline',
    title: t('navigation.userGroups'),
    value: userGroupCount.value ?? 0,
    url: '/admin/user-management/user-groups',
    color: 'primary',
    caption: t('admin.metrics.groups'),
  },
  {
    icon: 'mdi-office-building',
    title: t('navigation.workplaces'),
    value: workplaceCount.value ?? 0,
    url: '/admin/user-management/workplaces',
    color: 'primary',
    caption: t('admin.metrics.workplaces'),
  },
  {
    icon: 'mdi-key-outline',
    title: t('navigation.apiKeys'),
    value: apiKeyCount.value ?? 0,
    url: '/admin/user-management/api-keys',
    color: 'primary',
    caption: t('admin.metrics.apiKeys'),
  }
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
