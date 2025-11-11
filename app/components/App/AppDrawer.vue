<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const router = useRouter()
const routes = router.getRoutes().filter((r) => r.path.lastIndexOf('/') === 0)
const drawerState = useState('drawer', () => false)
const appBarReady = useState('appBarReady', () => false)

const { mobile, lgAndUp, width } = useDisplay()
const { t } = useI18n()
const drawer = computed({
  get() {
    return drawerState.value || !mobile.value
  },
  set(val: boolean) {
    drawerState.value = val
  },
})
const rail = computed(() => !drawerState.value && !mobile.value)
routes.sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98))

const { session } = useUserSession()
const localePath = useLocalePath()
const home = computed(() => localePath('home') ?? '/')

const drawerRouteKey = (route: RouteRecordRaw) =>
  `${String(route.name ?? '')}::${route.path ?? ''}`

const normalizeRole = (role: string) =>
  role
    .replace(/^ROLE_/i, '')
    .trim()
    .toUpperCase()

const userRoles = computed(() => {
  const profile = session.value?.profile
  if (!profile || typeof profile !== 'object') {
    return [] as string[]
  }

  const rawRoles = (profile as Record<string, unknown>).roles
  if (!Array.isArray(rawRoles)) {
    return [] as string[]
  }

  const normalizedRoles = rawRoles
    .filter(
      (role): role is string =>
        typeof role === 'string' && role.trim().length > 0,
    )
    .map((role) => normalizeRole(role))
    .filter((role) => role.length > 0)

  return Array.from(new Set(normalizedRoles))
})

const hasRouteAccess = (route: RouteRecordRaw) => {
  const rawRoles = (route.meta as Record<string, unknown> | undefined)?.roles
  if (!Array.isArray(rawRoles)) {
    return true
  }

  const requiredRoles = rawRoles
    .filter(
      (role): role is string =>
        typeof role === 'string' && role.trim().length > 0,
    )
    .map((role) => normalizeRole(role))
    .filter((role) => role.length > 0)

  if (requiredRoles.length === 0) {
    return true
  }

  return requiredRoles.some((role) => userRoles.value.includes(role))
}

const availableRoutes = computed(() =>
  routes.filter((route) => hasRouteAccess(route)),
)

const toPositiveInteger = (value?: string | string[]) => {
  const candidate = Array.isArray(value) ? value[0] : value
  const parsed = Number.parseInt(candidate ?? '', 10)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const resolveViewportWidth = () => {
  if (import.meta.server) {
    const event = useRequestEvent()
    if (!event) {
      return undefined
    }

    const header =
      event.node.req.headers['sec-ch-viewport-width'] ??
      event.node.req.headers['viewport-width']

    return toPositiveInteger(header)
  }

  if (import.meta.client && typeof window !== 'undefined') {
    return window.innerWidth
  }

  return undefined
}

const ensureInitialDrawerState = () => {
  const viewportWidth = resolveViewportWidth()
  const shouldExpand =
    typeof viewportWidth === 'number'
      ? viewportWidth >= 1280
      : lgAndUp.value && width.value >= 1280

  if (drawerState.value !== shouldExpand) {
    drawerState.value = shouldExpand
  }
}

ensureInitialDrawerState()

const brandTitle = computed(() => t('app.brand.name'))
const brandHighlight = computed(() => t('app.brand.highlight'))
const brandTitleParts = computed(() => {
  const title = brandTitle.value
  const highlight = brandHighlight.value

  if (!highlight) {
    return { before: title, highlight: '', after: '' }
  }

  const index = title.indexOf(highlight)
  if (index === -1) {
    return { before: title, highlight: '', after: '' }
  }

  return {
    before: title.slice(0, index),
    highlight,
    after: title.slice(index + highlight.length),
  }
})

const footerCopyright = computed(() =>
  t('app.footer.copyright', { year: new Date().getFullYear() }),
)
const footerBrand = computed(() => t('app.footer.craftedBy'))
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    floating
    :class="{ 'app-drawer--hydrating': !appBarReady }"
  >
    <template #prepend>
      <NuxtLink
        :to="home"
        style="color: rgba(var(--v-theme-on-surface), 0.92)"
        class="text-decoration-none my-2 d-flex align-center"
      >
        <v-icon
          icon="mdi-earth"
          size="x-large"
          class="drawer-header-icon mx-4"
          color="primary"
        />
        <span class="text-h4 text-decoration-none brand-title--italic">{{
          brandTitleParts.before
        }}</span>
        <span
          v-if="brandTitleParts.highlight"
          class="text-h4 text-primary text-decoration-none brand-title--italic"
        >
          {{ brandTitleParts.highlight }}
        </span>
        <span class="brand-title--italic">{{ brandTitleParts.after }}</span>
      </NuxtLink>
    </template>
    <v-list nav density="compact">
      <AppDrawerItem
        v-for="route in availableRoutes"
        :key="drawerRouteKey(route)"
        :item="route"
      />
    </v-list>
    <v-spacer />
    <template #append>
      <v-list-item class="drawer-footer px-0 d-flex flex-column justify-center">
        <div class="text-caption pt-6 pt-md-0 text-center text-no-wrap">
          {{ footerCopyright }}
          <a
            href="https://github.com/rami-aouinti"
            class="font-weight-bold text-primary"
            target="_blank"
            >{{ footerBrand }}</a
          >
        </div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<style>
.brand-title--italic {
  font-style: italic;
}

.v-navigation-drawer {
  transition-property: box-shadow, transform, opacity, border-radius !important;
  overflow: hidden;
  &.app-drawer--hydrating {
    visibility: hidden;
    pointer-events: none;
  }
  &.v-navigation-drawer--rail {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    &.v-navigation-drawer--is-hovering {
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
      box-shadow:
        0px 1px 2px 0px rgb(0 0 0 / 30%),
        0px 1px 3px 1px rgb(0 0 0 / 15%);
    }
    &:not(.v-navigation-drawer--is-hovering) {
      .drawer-footer {
        transform: translateX(-160px);
      }
      .drawer-header-icon {
        transform: scale(0.83);
      }
      .v-list-group {
        --list-indent-size: 0px;
        --prepend-width: 0px;
      }
    }
  }
  .v-navigation-drawer__content {
    overflow-y: hidden;
    @supports (scrollbar-gutter: stable) {
      scrollbar-gutter: stable;
      > .v-list--nav {
        padding-right: 0;
      }
    }
    &:hover {
      overflow-y: overlay;
    }
  }
  .drawer-footer {
    transition: transform 0.2s ease, opacity 0.2s ease;
    min-height: 30px;
  }
  .drawer-header-icon {
    opacity: 1 !important;
    height: 1.2em !important;
    width: 1.2em !important;
    transform: scale(1);
    transition: transform 0.2s ease, opacity 0.2s ease;
    margin-right: -10px;
  }
  .v-list-group {
    --prepend-width: 10px;
  }
  .v-list-item {
    transition: background-color 0.2s ease, color 0.2s ease,
      transform 0.2s ease;
  }
}
</style>
