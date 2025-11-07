<script setup lang="ts">
definePageMeta({
  icon: 'mdi-monitor-dashboard',
  title: 'navigation.dashboard',
  drawerIndex: 0,
})
const { t } = useI18n()

const stats = computed(() => [
  {
    icon: 'mdi-web',
    title: t('admin.dashboard.stats.bandwidth.title'),
    value: 23,
    unit: 'GB',
    color: 'primary',
    caption: t('admin.dashboard.stats.bandwidth.caption', { up: 13, down: 10 }),
  },
  {
    icon: 'mdi-rss',
    title: t('admin.dashboard.stats.submissions.title'),
    value: 108,
    color: 'primary',
    caption: t('admin.dashboard.stats.submissions.caption'),
  },
  {
    icon: 'mdi-send',
    title: t('admin.dashboard.stats.requests.title'),
    value: 1238,
    color: 'warning',
    caption: t('admin.dashboard.stats.requests.caption', { limit: 1320 }),
  },
  {
    icon: 'mdi-bell',
    title: t('admin.dashboard.stats.messages.title'),
    value: 9042,
    color: 'primary',
    caption: t('admin.dashboard.stats.messages.caption', {
      warnings: 300,
      errors: 47,
    }),
  },
  {
    icon: 'mdi-github',
    title: t('admin.dashboard.stats.github.title'),
    value: NaN,
    color: 'grey',
    caption: t('admin.dashboard.stats.github.caption'),
  },
  {
    icon: 'mdi-currency-cny',
    title: t('admin.dashboard.stats.totalFee.title'),
    value: 2300,
    unit: '￥',
    color: 'error',
    caption: t('admin.dashboard.stats.totalFee.caption', { limit: '2000 ￥' }),
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
        lg="2"
      >
        <StatsCard
          :title="stat.title"
          :unit="stat.unit"
          :color="stat.color"
          :icon="stat.icon"
          :value="stat.value"
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
