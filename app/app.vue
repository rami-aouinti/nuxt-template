<script setup lang="ts">
const theme = useTheme()
const { t, locale } = useI18n()
const route = useRoute()
const requestURL = useRequestURL()
const siteOrigin = `${requestURL.protocol}//${requestURL.host}`

const canonicalUrl = computed(() => `${siteOrigin}${route.path}`)

const DEFAULT_APP_DESCRIPTION =
  'Vuetify 3 + Nuxt 3, Opinionated Admin Starter Template'

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

const metaDescription = computed(() => {
  const translated = t('app.description')
  if (
    typeof translated === 'string' &&
    translated.trim().length > 0 &&
    translated !== 'app.description'
  ) {
    return translated
  }

  return DEFAULT_APP_DESCRIPTION
})

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
  meta: [
    {
      name: 'description',
      content: metaDescription.value,
    },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
}))

useSeoMeta(() => ({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  description: metaDescription.value,
  ogTitle: pageTitle.value || defaultTitle.value,
  twitterTitle: pageTitle.value || defaultTitle.value,
  ogDescription: metaDescription.value,
  twitterDescription: metaDescription.value,
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
