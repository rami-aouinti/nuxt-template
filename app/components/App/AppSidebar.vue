<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const router = useRouter()
const { mobile, lgAndUp, width } = useDisplay()
const drawerState = useState('drawer', () => true)
const { session } = useUserSession()
const { t } = useI18n()

const drawer = computed({
  get() {
    return drawerState.value || !mobile.value
  },
  set(val: boolean) {
    drawerState.value = val
  },
})

drawerState.value = lgAndUp.value && width.value >= 1280

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

const cloneRoute = (routeRecord: RouteRecordRaw): RouteRecordRaw => ({
  ...routeRecord,
  children: routeRecord.children
    ? routeRecord.children.map((child) => cloneRoute(child as RouteRecordRaw))
    : undefined,
  meta: routeRecord.meta ? { ...routeRecord.meta } : undefined,
})

const adminRoute = computed(() =>
  router
    .getRoutes()
    .find((routeRecord) => routeRecord.name === 'admin') as
    | RouteRecordRaw
    | undefined,
)

const rootLink = computed(() => {
  if (!adminRoute.value || !hasRouteAccess(adminRoute.value)) {
    return null
  }

  const clone = cloneRoute(adminRoute.value)
  clone.children = undefined
  return clone
})

const adminChildren = computed(() => {
  if (!adminRoute.value) {
    return [] as RouteRecordRaw[]
  }

  const children = (adminRoute.value.children ?? []) as RouteRecordRaw[]

  return children
    .filter((child) => hasRouteAccess(child))
    .map((child) => cloneRoute(child))
    .sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98))
})

const sidebarItems = computed(() => {
  const items: RouteRecordRaw[] = []
  if (rootLink.value) {
    items.push(rootLink.value)
  }
  items.push(...adminChildren.value)
  return items
})

const title = computed(() => t('navigation.admin'))
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    floating
    class="app-sidebar"
    :temporary="mobile"
    width="300"
  >
    <v-list class="py-6" density="compact" nav>
      <v-list-item
        class="app-sidebar__title text-h6 font-weight-semibold mb-4"
        :title="title"
        prepend-icon="mdi-shield-account"
      />
      <AppSidebarItem
        v-for="item in sidebarItems"
        :key="item.path"
        :item="item"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.app-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
}

.app-sidebar__title :deep(.v-list-item__prepend) {
  margin-inline-end: 12px;
}
</style>
