<script setup lang="ts">
import { computed } from 'vue'

import { useProfilePluginsStore } from '~/stores/profile-plugins'

const { t } = useI18n()
const route = useRoute()

interface NavigationItem {
  value: string
  to: string
  label: string
  icon: string
  match?: (path: string) => boolean
}

const pluginsStore = useProfilePluginsStore()

function resolvePluginPath(key: string) {
  if (!key) {
    return '/profile/plugins'
  }

  return `/plugin/${encodeURIComponent(key)}`
}

const baseItems = computed<NavigationItem[]>(() => [
  {
    value: 'profile',
    to: '/profile',
    label: t('navigation.profile'),
    icon: 'mdi-account-circle',
    match: (path) => path === '/profile',
  },
  {
    value: 'post',
    to: '/profile/post',
    label: t('navigation.posts'),
    icon: 'mdi-blogger',
    match: (path) => path.startsWith('/profile/post'),
  },
  {
    value: 'calendar',
    to: '/profile/calendar',
    label: t('navigation.profileCalendar'),
    icon: 'mdi-calendar',
    match: (path) => path.startsWith('/profile/calendar'),
  },
  {
    value: 'workspace',
    to: '/profile/workspace',
    label: t('navigation.profileWorkspace'),
    icon: 'mdi-folder-account',
    match: (path) => path.startsWith('/profile/workspace'),
  },
  {
    value: 'plugins',
    to: '/profile/plugins',
    label: t('profile.sections.plugins.title'),
    icon: 'mdi-puzzle',
    match: (path) => path.startsWith('/profile/plugins'),
  },
  {
    value: 'settings',
    to: '/profile/settings',
    label: t('navigation.settings'),
    icon: 'mdi-cog',
    match: (path) => path.startsWith('/settings'),
  },
])

const pluginItems = computed<NavigationItem[]>(() =>
  pluginsStore.activePlugins.map((plugin) => {
    const path = resolvePluginPath(plugin.key)

    return {
      value: `plugin-${plugin.key}`,
      to: path,
      label: plugin.name,
      icon: plugin.icon || 'mdi-puzzle',
      match: (currentPath) => currentPath.startsWith(path),
    }
  }),
)

try {
  await pluginsStore.load()
} catch (error) {
  // Ignore plugin navigation loading errors here; they are handled in dedicated pages.
}

const items = computed<NavigationItem[]>(() => [
  ...baseItems.value,
  ...pluginItems.value,
])

function normalizePath(path: string) {
  if (path === '/') {
    return path
  }

  return path.replace(/\/+$/, '') || '/'
}

const activeValue = computed(() => {
  const currentPath = normalizePath(route.path)
  const match = items.value.find((item) => item.match?.(currentPath))

  if (match) {
    return match.value
  }

  return items.value[0]?.value ?? null
})
</script>

<template>
  <v-sheet color="transparent" class="profile-navigation" rounded="xl">
    <v-tabs
      :model-value="activeValue"
      color="primary"
      density="comfortable"
      grow
      stacked
    >
      <v-tab
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :to="item.to"
        :prepend-icon="item.icon"
        rounded="xl"
      >
        {{ item.label }}
      </v-tab>
    </v-tabs>
  </v-sheet>
</template>

<style scoped>
.profile-navigation {
  background-color: rgb(var(--v-theme-surface)) !important;
  padding: 8px;
}

@media (min-width: 960px) {
  .profile-navigation {
    padding: 12px 16px;
  }
}
</style>
