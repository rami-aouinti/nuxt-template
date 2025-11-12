<script setup lang="ts">
import { computed } from 'vue'

import AppNavigationList, {
  type AppNavigationListItem,
} from '~/components/AppNavigationList.vue'
import { useTranslateWithFallback } from '~/composables/useTranslateWithFallback'
import { useProfilePluginsStore } from '~/stores/profile-plugins'

const { t } = useI18n()
const translate = useTranslateWithFallback()

interface NavigationItem extends AppNavigationListItem {
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

const navigationTitle = computed(() => t('blog.sidebar.mySection'))

const navigationDescription = computed(() =>
  translate(
    'blog.sidebar.intro',
    "Retrouvez vos espaces d'écriture et créez un nouvel article.",
  ),
)
</script>

<template>
  <AppNavigationList
    class="profile-navigation"
    :items="items"
    :title="navigationTitle"
    :description="navigationDescription"
  />
</template>

<style scoped>
.profile-navigation {
  background-color: transparent !important;
  padding: 8px;
}

@media (min-width: 960px) {
  .profile-navigation {
    padding: 12px 16px;
  }
}
</style>
