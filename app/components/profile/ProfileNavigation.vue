<script setup lang="ts">
import { computed } from 'vue'

import { useProfilePluginsStore } from '~/stores/profile-plugins'

const { t } = useI18n()
const translate = (key: string, fallback: string) => {
  const value = t(key)
  return value && value !== key ? value : fallback
}
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
    match: (path) => path.startsWith('/profile/settings'),
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
} catch {
  // Ignore plugin navigation loading errors here; they are handled in dedicated pages.
}

const items = computed<NavigationItem[]>(() => [
  ...baseItems.value,
  ...pluginItems.value,
])

</script>

<template>
  <div class="animated-badge mb-4">
    <span class="animated-badge__pulse" />
    {{ t('blog.sidebar.mySection') }}
  </div>
  <p class="text-body-2 text-medium-emphasis mb-4">
    {{
      translate(
        'blog.sidebar.intro',
        "Retrouvez vos espaces d'écriture et créez un nouvel article.",
      )
    }}
  </p>
  <div v-for="section in items" :key="section.value" class="w-100">
    <NuxtLink class="text-decoration-none text-primary" :to="section.to">
      <div class="stat-card d-flex align-center gap-3 mb-3 w-100 px-3">
        <v-icon :icon="section.icon" size="24" />
        {{ section.label }}
      </div>
    </NuxtLink>
  </div>
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
