<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

defineOptions({ name: 'AppSidebarItem' })

const { item } = defineProps<{
  item: RouteRecordRaw
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { session } = useUserSession()
const route = useRoute()

const userRoles = computed(() => {
  const profile = session.value?.profile
  if (!profile || typeof profile !== 'object') {
    return [] as string[]
  }

  const rawRoles = (profile as Record<string, unknown>).roles
  if (!Array.isArray(rawRoles)) {
    return [] as string[]
  }

  return rawRoles
    .filter(
      (role): role is string =>
        typeof role === 'string' && role.trim().length > 0,
    )
    .map((role) => role.trim())
})

const hasRouteAccess = (routeRecord: RouteRecordRaw) => {
  const rawRoles = (routeRecord.meta as Record<string, unknown> | undefined)?.roles
  if (!Array.isArray(rawRoles)) {
    return true
  }

  const requiredRoles = rawRoles.filter(
    (role): role is string =>
      typeof role === 'string' && role.trim().length > 0,
  )

  if (requiredRoles.length === 0) {
    return true
  }

  return requiredRoles.some((role) => userRoles.value.includes(role))
}

const visibleChildren = computed(() =>
  item.children
    ?.filter((child) => child.meta?.icon && hasRouteAccess(child))
    .sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98)),
)

const visibleChildrenNum = computed(() => visibleChildren.value?.length || 0)
const isLeaf = computed(
  () => !item.children || visibleChildrenNum.value === 0,
)
const titleKey = computed(() => item.meta?.title)
const translatedTitle = computed(() => {
  const key = titleKey.value
  if (!key) {
    return ''
  }

  return t(String(key))
})

const icon = computed(() => item.meta?.icon)

const to = computed(() => ({
  name: item.name,
}))

const hasTarget = computed(() => Boolean(to.value?.name))

const isActive = computed(() => route.path.startsWith(item.path))
</script>

<template>
  <v-list-item
    v-if="isLeaf && icon && hasTarget"
    :to="localePath(to)"
    :title="translatedTitle"
    :prepend-icon="icon"
    active-class="text-primary"
    rounded="lg"
  />
  <v-list-group
    v-else-if="icon"
    :value="isActive"
    :prepend-icon="icon"
    color="primary"
    class="app-sidebar-item__group"
  >
    <template #activator="{ props: activatorProps }">
      <v-list-item :title="translatedTitle" v-bind="activatorProps" rounded="lg" />
    </template>
    <AppSidebarItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
    />
  </v-list-group>
</template>

<style scoped>
.app-sidebar-item__group :deep(.v-list-item) {
  border-radius: 12px;
}
</style>
