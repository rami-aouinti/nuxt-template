<script setup lang="ts">
import { computed } from 'vue'

const drawerState = useState('drawerRight', () => false)
const appBarReady = useState('appBarReady', () => false)

const { mobile, lgAndUp, width } = useDisplay()
const drawer = computed({
  get() {
    return drawerState.value || !mobile.value
  },
  set(val: boolean) {
    drawerState.value = val
  },
})
const rail = computed(() => !drawerState.value && !mobile.value)

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
</script>

<template>
  <v-navigation-drawer
    class="app-navigation-drawer"
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    location="right"
    width="320"
    floating
    :class="{ 'app-drawer--hydrating': !appBarReady }"
    elevation="0"
  >
    <v-card class="drawer-nav mt-5" variant="text">
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
  border-radius: var(--app-rounded, 18px);
  box-shadow: var(--app-shadow, 0 10px 26px rgba(15, 23, 42, 0.14));
}

.v-navigation-drawer.app-navigation-drawer {
  background-color: transparent !important;
  box-shadow: none;
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
