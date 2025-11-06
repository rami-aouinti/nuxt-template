<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const { item } = defineProps<{
  item: RouteRecordRaw
}>()
const { session } = useUserSession()

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
      (role): role is string => typeof role === 'string' && role.trim().length > 0,
    )
    .map((role) => role.trim())
})

const hasRouteAccess = (route: RouteRecordRaw) => {
  const rawRoles = (route.meta as Record<string, unknown> | undefined)?.roles
  if (!Array.isArray(rawRoles)) {
    return true
  }

  const requiredRoles = rawRoles.filter(
    (role): role is string => typeof role === 'string' && role.trim().length > 0,
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
const isItem = computed(() => !item.children || visibleChildrenNum.value <= 1)
const isVisible = computed(() => hasRouteAccess(item))
const title = toRef(() => item.meta?.title)
const icon = toRef(() => item.meta?.icon)
// @ts-expect-error unknown type miss match
const to = computed<RouteRecordRaw>(() => ({
  name: item.name || visibleChildren.value?.[0]?.name,
}))
const hasTarget = computed(() => Boolean(to.value?.name))
const route = useRoute()
const isActive = computed(() => {
  return route.path.startsWith(item.path)
})
</script>

<template>
  <v-list-item
    v-if="isVisible && isItem && icon && hasTarget"
    :to="to"
    :prepend-icon="icon"
    active-class="text-primary"
    :title="title"
  />
  <v-list-group
    v-else-if="isVisible && icon"
    :prepend-icon="icon"
    color="primary"
  >
    <template #activator="{ props: vProps }">
      <v-list-item :title="title" v-bind="vProps" :active="isActive" />
    </template>
    <AppDrawerItem
      v-for="child in visibleChildren"
      :key="child.name"
      :item="child"
    />
  </v-list-group>
</template>
