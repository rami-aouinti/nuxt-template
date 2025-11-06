import { aliases } from 'vuetify/iconsets/mdi'
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('./', import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
    'nuxt-auth-utils',
    'nuxt-echarts',
    "@nuxtjs/i18n",
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],
  css: ['~/assets/styles/index.css'],
  experimental: { typedPages: true },
  typescript: {
    shim: false,
    strict: true,
    tsConfig: {
      include: ['../test/**/*.ts'],
      compilerOptions: { types: ['vuetify-nuxt-module'] },
    },
    nodeTsConfig: {
      include: ['../*.config.*'],
    },
  },
  vue: { propsDestructure: true },
  vueuse: { ssrHandlers: true },
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        viewportSize: true,
        prefersColorScheme: true,
        prefersColorSchemeOptions: {},
        reloadOnFirstRequest: true,
      },
    },
  },
  icon: {
    clientBundle: {
      icons: Object.values(aliases).map((v) =>
        (v as string).replace(/^mdi-/, 'mdi:'),
      ),
      scan: true,
    },
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },
  echarts: {
    charts: ['LineChart', 'BarChart', 'PieChart', 'RadarChart'],
    renderer: 'svg',
    components: [
      'DataZoomComponent',
      'LegendComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'GridComponent',
      'TitleComponent',
      'DatasetComponent',
      'VisualMapComponent',
    ],
  },
  vite: {
    resolve: {
      alias: {
        i18n: projectRoot,
      },
    },
    build: { sourcemap: false },
  },
  nitro: {
    alias: {
      i18n: projectRoot,
    },
  },
  i18n: {
    lazy: true,
    langDir: "app/i18n/locales/",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: false,
      fallbackLocale: "en",
    },
    locales: [
      { code: "en", name: "English", iso: "en-US", icon: "fi-gb gb", file: "en.json" },
      { code: "de", name: "Deutsch", iso: "de-DE", icon: "fi-de de", file: "de.json" },
      { code: "fr", name: "French", iso: "fr-FR", icon: "fi-fr fr", file: "fr.json" },
      { code: "ar", name: "Arabic", iso: "tn-TN", icon: "fi-tn tn", file: "ar.json" },
      { code: "it", name: "Italian", iso: "it-IT", icon: "fi-it it", file: "it.json" },
      { code: "es", name: "Spanish", iso: "es-ES", icon: "fi-es es", file: "es.json" },
      { code: "ru", name: "Russian", iso: "ru-RU", icon: "fi-ru ru", file: "ru.json" },
      {
        code: "zh-cn",
        name: "简体中文",
        iso: "zh-CN",
        icon: "fi-cn cn",
        file: "zh-cn.json",
      },
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },
    vueI18n: "./app/i18n/i18n.config.ts",
  },
  runtimeConfig: {
    github: {
      clientId: '',
      clientSecret: '',
    },
    session: {
      name: 'nuxt-session',
      password: '',
    },
  },
  compatibilityDate: '2024-08-05',
})
