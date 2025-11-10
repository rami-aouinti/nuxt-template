<script setup lang="ts">
import { computed } from 'vue'

const router = useRouter()
const routes = router.getRoutes().filter((r) => r.path.lastIndexOf('/') === 0)
const drawerState = useState('drawer', () => true)
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

const localePath = useLocalePath()
const home = computed(() => localePath('home') ?? '/')

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
    v-if="appBarReady"
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    width="320"
    floating
  >
    <template #prepend>
      <NuxtLink
        :to="home"
        style="color: rgba(var(--v-theme-on-surface), 0.92);"
        class="text-decoration-none my-2 d-flex align-center"
      >
        <v-icon
          icon="mdi-earth"
          size="x-large"
          class="drawer-header-icon mx-4"
          color="primary"
        />
        <span class="text-h4 text-decoration-none">{{
          brandTitleParts.before
        }}</span>
        <span
          v-if="brandTitleParts.highlight"
          class="text-h4 text-primary text-decoration-none"
        >
          {{ brandTitleParts.highlight }}
        </span>
        <span>{{ brandTitleParts.after }}</span>
      </NuxtLink>
    </template>
    <v-card class="drawer-nav mt-5" elevation="20" rounded="xl">
      <div id="app-drawer" />
    </v-card>
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
