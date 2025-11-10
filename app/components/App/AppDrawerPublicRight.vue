<script setup lang="ts">
import { computed } from 'vue'

const router = useRouter()
const routes = router.getRoutes().filter((r) => r.path.lastIndexOf('/') === 0)
const drawerState = useState('drawerRight', () => true)

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

drawerState.value = lgAndUp.value && width.value >= 1280
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    location="right"
    width="320"
    floating
  >
    <v-card class="drawer-nav mt-5" elevation="20" rounded="xl">
      <div id="app-drawer-right" />
    </v-card>
  </v-navigation-drawer>
</template>

<style>
.drawer-nav {
  background: transparent;
  margin: 20px;
  padding: 16px;
  min-height: calc(100vh - 160px);
}

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
