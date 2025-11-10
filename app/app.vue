<script setup lang="ts">
const theme = useTheme()
const { t, locale } = useI18n()
const route = useRoute()

provide(
  THEME_KEY,
  computed(() => (theme.current.value.dark ? 'dark' : undefined)),
)

const pageTitle = computed(() => {
  const rawTitle = route.meta?.title || route.matched[0]?.meta?.title
  if (!rawTitle) {
    return ''
  }

  const translated = t(String(rawTitle))
  return translated || String(rawTitle)
})

const defaultTitle = computed(() => t('app.title'))

const layoutName = computed(() => {
  const metaLayout = route.meta?.layout
  if (metaLayout === false) {
    return false
  }

  if (typeof metaLayout === 'string') {
    return metaLayout
  }

  return route.path.startsWith('/admin') ? 'admin' : 'default'
})

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
  <NuxtLayout v-if="layoutName" :name="layoutName">
    <NuxtPage :key="route.fullPath" />
  </NuxtLayout>
  <NuxtPage v-else :key="route.fullPath" />
</template>
