<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const router = useRouter()
const routes = router.getRoutes().filter((r) => r.path.lastIndexOf('/') === 0)
const drawerState = useState('drawer', () => true)

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

const availableRoutes = computed(() => routes.filter((route) => hasRouteAccess(route)))

drawerState.value = lgAndUp.value && width.value >= 1280

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
  >
    <template #prepend>
      <v-list>
        <v-list-item class="pa-1" :to="home">
          <template #prepend>
            <v-icon
              icon="custom:vitify-nuxt"
              size="x-large"
              class="drawer-header-icon"
              color="primary"
            />
          </template>
          <v-list-item-title
            class="text-h5 font-weight-bold"
            style="line-height: 2rem"
          >
            <span>{{ brandTitleParts.before }}</span>
            <span v-if="brandTitleParts.highlight" class="text-primary">
              {{ brandTitleParts.highlight }}
            </span>
            <span>{{ brandTitleParts.after }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
    <v-list nav density="compact">
      <AppDrawerItem
        v-for="route in availableRoutes"
        :key="localePath(route.name)"
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
.v-navigation-drawer {
  transition-property:
    box-shadow, transform, visibility, width, height, left, right, top, bottom,
    border-radius !important;
  overflow: hidden;
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
        height: 1em !important;
        width: 1em !important;
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
    transition: all 0.2s;
    min-height: 30px;
  }
  .drawer-header-icon {
    opacity: 1 !important;
    height: 1.2em !important;
    width: 1.2em !important;
    transition: all 0.2s;
    margin-right: -10px;
  }
  .v-list-group {
    --prepend-width: 10px;
  }
  .v-list-item {
    transition: all 0.2s;
  }
}
</style>
