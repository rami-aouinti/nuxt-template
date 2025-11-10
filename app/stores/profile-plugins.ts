import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { ProfilePlugin } from '~/types/plugin'

function normalizePlugin(value: unknown): ProfilePlugin | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const raw = value as Record<string, unknown>
  const key = typeof raw.key === 'string' ? raw.key.trim() : ''
  if (!key) {
    return null
  }

  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!name) {
    return null
  }

  const subTitle =
    typeof raw.subTitle === 'string' && raw.subTitle.trim().length > 0
      ? raw.subTitle.trim()
      : null
  const description =
    typeof raw.description === 'string' && raw.description.trim().length > 0
      ? raw.description.trim()
      : null
  const logo =
    typeof raw.logo === 'string' && raw.logo.trim().length > 0
      ? raw.logo.trim()
      : null
  const icon =
    typeof raw.icon === 'string' && raw.icon.trim().length > 0
      ? raw.icon.trim()
      : null
  const link =
    typeof raw.link === 'string' && raw.link.trim().length > 0
      ? raw.link.trim()
      : null
  const pricing =
    typeof raw.pricing === 'string' && raw.pricing.trim().length > 0
      ? raw.pricing.trim()
      : null
  const action =
    typeof raw.action === 'string' && raw.action.trim().length > 0
      ? raw.action.trim()
      : null
  const id =
    typeof raw.id === 'string' && raw.id.trim().length > 0
      ? raw.id.trim()
      : null

  return {
    key,
    name,
    subTitle,
    description,
    logo,
    icon,
    installed: Boolean(raw.installed),
    link,
    pricing,
    action,
    active: Boolean(raw.active),
    id,
  }
}

export const useProfilePluginsStore = defineStore('profilePlugins', () => {
  const plugins = ref<ProfilePlugin[]>([])
  const isLoading = ref(false)
  const isLoaded = ref(false)

  const activePlugins = computed(() =>
    plugins.value.filter((plugin) => plugin.active),
  )

  function setPlugins(items: unknown) {
    if (!Array.isArray(items)) {
      plugins.value = []
      return
    }

    const normalized: ProfilePlugin[] = []
    for (const item of items) {
      const plugin = normalizePlugin(item)
      if (plugin) {
        normalized.push(plugin)
      }
    }

    plugins.value = normalized
  }

  async function load(force = false) {
    if (isLoading.value && !force) {
      return
    }

    if (isLoaded.value && !force) {
      return
    }

    isLoading.value = true

    try {
      const response = await $fetch<ProfilePlugin[]>('/api/profile/plugins')
      setPlugins(response)
      isLoaded.value = true
    } catch (error) {
      if (!force && !plugins.value.length) {
        isLoaded.value = false
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function updatePlugin(key: string, patch: Partial<ProfilePlugin>) {
    const index = plugins.value.findIndex((plugin) => plugin.key === key)

    if (index === -1) {
      return
    }

    const current = plugins.value[index]
    plugins.value = plugins.value.map((plugin, pluginIndex) =>
      pluginIndex === index ? { ...current, ...patch } : plugin,
    )
  }

  function findByKey(key: string) {
    return plugins.value.find((plugin) => plugin.key === key) ?? null
  }

  return {
    plugins,
    isLoading,
    isLoaded,
    activePlugins,
    setPlugins,
    load,
    updatePlugin,
    findByKey,
  }
})
