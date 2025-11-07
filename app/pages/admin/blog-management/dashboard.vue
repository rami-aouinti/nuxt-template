<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  icon: 'mdi-monitor-dashboard',
  title: 'navigation.dashboard',
  drawerIndex: 0,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})
const { t } = useI18n()

const headers = import.meta.server
  ? useRequestHeaders(['cookie', 'authorization'])
  : undefined

const extractCount = (d: any): number => {
  if (typeof d === 'number') return d
  if (typeof d === 'string') {
    const parsed = Number(d)
    return Number.isFinite(parsed) ? parsed : 0
  }
  if (!d || typeof d !== 'object') return 0
  if (typeof d.count === 'number') return d.count
  if (typeof d.count === 'string') {
    const parsed = Number(d.count)
    if (Number.isFinite(parsed)) return parsed
  }
  if (typeof d.total === 'number') return d.total
  if (typeof d.total === 'string') {
    const parsed = Number(d.total)
    if (Number.isFinite(parsed)) return parsed
  }
  if (typeof d['hydra:totalItems'] === 'number') return d['hydra:totalItems']
  if (typeof d['hydra:totalItems'] === 'string') {
    const parsed = Number(d['hydra:totalItems'])
    if (Number.isFinite(parsed)) return parsed
  }
  if (d.data) return extractCount(d.data)
  return 0
}

const fetchCount = (url: string, key: string) =>
  useFetch<number>(url, {
    key,
    headers,
    credentials: 'include',
    transform: extractCount,
  })

const [
  { data: blogCount },
  { data: postCount },
  { data: commentCount },
  { data: tagCount },
] = await Promise.all([
  fetchCount('/api/blog/v1/blog/count', 'blog-count'),
  fetchCount('/api/blog/v1/post/count', 'post-count'),
  fetchCount('/api/blog/v1/comment/count', 'comment-count'),
  fetchCount('/api/blog/v1/tag/count', 'tag-count'),
])

const stats = computed(() => [
  {
    icon: 'mdi-notebook-outline',
    title: t('navigation.blogs'),
    value: blogCount.value ?? 0,
    url: '/admin/blog-management/blog-management',
    color: 'primary',
    caption: t('admin.metrics.blogs'),
  },
  {
    icon: 'mdi-post-outline',
    title: t('navigation.posts'),
    value: postCount.value ?? 0,
    url: '/admin/blog-management/post-management',
    color: 'primary',
    caption: t('admin.metrics.posts'),
  },
  {
    icon: 'mdi-comment-text-outline',
    title: t('navigation.comments'),
    value: commentCount.value ?? 0,
    url: '/admin/blog-management/comment-management',
    color: 'primary',
    caption: t('admin.metrics.comments'),
  },
  {
    icon: 'mdi-tag-multiple-outline',
    title: t('navigation.tags'),
    value: tagCount.value ?? 0,
    url: '/admin/blog-management/tag-management',
    color: 'primary',
    caption: t('admin.metrics.tags'),
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
