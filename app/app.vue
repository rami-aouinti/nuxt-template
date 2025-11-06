<script setup lang="ts">
const theme = useTheme()
const { t, locale } = useI18n()
const routeLoading = useRouteLoading()
provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined)),
)
const route = useRoute()
const pageTitle = computed(() => {
  const rawTitle = route.meta?.title || route.matched[0]?.meta?.title
  if (!rawTitle) {
    return ''
  }

  const translated = t(String(rawTitle))
  return translated || String(rawTitle)
})

const defaultTitle = computed(() => t('app.title'))

useHead(() => ({
  title: pageTitle.value || defaultTitle.value,
  titleTemplate: (titleChunk?: string) =>
    titleChunk && titleChunk !== defaultTitle.value
      ? `${titleChunk} | ${defaultTitle.value}`
      : defaultTitle.value,
  htmlAttrs: { lang: locale.value },
  link: [{ rel: 'icon', href: '/favicon.ico' }],
}))

useSeoMeta(() => ({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  description: t('app.description'),
  ogTitle: pageTitle.value || defaultTitle.value,
  twitterTitle: pageTitle.value || defaultTitle.value,
  ogDescription: t('app.description'),
  twitterDescription: t('app.description'),
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image',
}))
</script>

<template>
  <v-app>
    <AppDrawer />
    <AppBar />
    <v-main>
      <div class="route-container">
        <NuxtPage
          v-show="!routeLoading"
          :key="route.fullPath"
          class="route-container__page"
        />
        <AppRouteLoader v-if="routeLoading" class="route-container__loader" />
      </div>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<style scoped>
/* replace padding with margin to limit scrollbar in v-main */
.v-main {
  padding-top: 0;
  padding-bottom: 0;
  /* https://github.com/vuetifyjs/vuetify/issues/15202 */
  margin-top: 64px;
  margin-bottom: 32px;
  height: calc(100vh - 64px - 32px);
  /* margin-top: var(--v-layout-top);
  margin-bottom: var(--v-layout-bottom);
  height: calc(100vh - var(--v-layout-top) - var(--v-layout-bottom)); */
  overflow-y: auto;
  transition-property: padding;
}

.route-container {
  position: relative;
  display: flex;
  height: 100%;
}

.route-container__page {
  flex: 1;
}

.route-container__loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* reuse transition defined in AppRouteLoader */
</style>
