<script setup lang="ts">
import { computed } from 'vue'
import { normalizeRequestHeaders } from '~/utils/headers'

definePageMeta({
  icon: 'mdi-monitor-dashboard',
  title: 'navigation.dashboard',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
const { t } = useI18n()

const headers = import.meta.server
  ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
  : undefined

const extractCount = (d: any): number => {
  if (typeof d === 'number') return d
  if (!d || typeof d !== 'object') return 0
  if (typeof d.count === 'number') return d.count
  if (typeof d.total === 'number') return d.total
  if (typeof d['hydra:totalItems'] === 'number') return d['hydra:totalItems']
  if (d.data) return extractCount(d.data)
  return 0
}

const { data: configurationCount } = await useFetch<number>(
  '/api/v1/configuration/count',
  {
    key: 'configuration-count',
    headers,
    credentials: 'include',
    transform: extractCount,
  },
)

const stats = computed(() => [
  {
    icon: 'mdi-cog-outline',
    title: t('configurationManagement.metrics.configurations'),
    value: configurationCount.value ?? 0,
    url: '/admin/setting-management/configuration-management',
    color: 'primary',
    caption: t('configurationManagement.metrics.configurationsCaption'),
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
        <AppCard class="pa-2">
          <ChartLine />
        </AppCard>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <AppCard class="pa-2">
          <ChartRadar />
        </AppCard>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <AppCard class="pa-2">
          <ChartPie />
        </AppCard>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <AppCard class="pa-2">
          <ChartBar />
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card:not(.stats-card) {
  height: 340px;
}
</style>
