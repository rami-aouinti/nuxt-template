import { aliases } from 'vuetify/iconsets/mdi'
import { defineNuxtConfig } from 'nuxt/config'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { splitVendorChunkPlugin } from 'vite'

const projectRoot = fileURLToPath(new URL('./', import.meta.url))
const localeDirectory = resolve(projectRoot, 'app/i18n/locales')

const DEFAULT_MERCURE_URL = 'http://bro-world.org:3000/.well-known/mercure'
const DEFAULT_MERCURE_PUBLIC_URL = 'http://bro-world.org/.well-known/mercure'
const DEFAULT_MESSENGER_API_BASE = 'https://bro-world.org/api/v1/messenger'
const DEFAULT_MESSENGER_NOTIFICATION_TOPIC =
  '/notifications/3d2abda8-bdb9-11f0-8da8-9d776028aeca'

const mercureUrl = process.env.MERCURE_URL || DEFAULT_MERCURE_URL
const mercurePublicUrl =
  process.env.MERCURE_PUBLIC_URL ||
  process.env.NUXT_PUBLIC_MESSENGER_HUB_URL ||
  DEFAULT_MERCURE_PUBLIC_URL
const mercureJwtSecret = process.env.MERCURE_JWT_SECRET || ''

function createOAuthConfig() {
  return { clientId: '', clientSecret: '' }
}

function resolveSessionPassword() {
  const rawPassword =
    process.env.NUXT_SESSION_PASSWORD ||
    process.env.SESSION_PASSWORD ||
    process.env.SESSION_SECRET ||
    ''

  if (!rawPassword) {
    return 'nuxt-template-development-session-secret-change-me'
  }

  return rawPassword.length >= 32
    ? rawPassword
    : createHash('sha256').update(rawPassword).digest('hex')
}

function toPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
    'nuxt-auth-utils',
    'nuxt-echarts',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
  ],
  css: ['~/assets/styles/index.css', '~/assets/styles/flag-icons.scss'],
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
    plugins: [splitVendorChunkPlugin()],
    resolve: {
      alias: {
        i18n: projectRoot,
      },
    },
    build: {
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined
            }

            if (id.includes('vuetify')) {
              return 'vendor-vuetify'
            }

            if (id.includes('echarts')) {
              return 'vendor-echarts'
            }

            if (id.includes('vue-i18n') || id.includes('@intlify')) {
              return 'vendor-i18n'
            }

            return undefined
          },
        },
      },
    },
  },
  nitro: {
    alias: {
      i18n: projectRoot,
    },
  },
  i18n: {
    lazy: true,
    langDir: localeDirectory,
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        icon: 'fi-gb gb',
        file: 'en.json',
      },
      {
        code: 'de',
        name: 'Deutsch',
        iso: 'de-DE',
        icon: 'fi-de de',
        file: 'de.json',
      },
      {
        code: 'fr',
        name: 'French',
        iso: 'fr-FR',
        icon: 'fi-fr fr',
        file: 'fr.json',
      },
      {
        code: 'ar',
        name: 'Arabic',
        iso: 'tn-TN',
        icon: 'fi-tn tn',
        file: 'ar.json',
      },
      {
        code: 'it',
        name: 'Italian',
        iso: 'it-IT',
        icon: 'fi-it it',
        file: 'it.json',
      },
      {
        code: 'es',
        name: 'Spanish',
        iso: 'es-ES',
        icon: 'fi-es es',
        file: 'es.json',
      },
      {
        code: 'ru',
        name: 'Russian',
        iso: 'ru-RU',
        icon: 'fi-ru ru',
        file: 'ru.json',
      },
      {
        code: 'zh-cn',
        name: '简体中文',
        iso: 'zh-CN',
        icon: 'fi-cn cn',
        file: 'zh-cn.json',
      },
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },
    vueI18n: './app/i18n/i18n.config.ts',
  },
  runtimeConfig: {
    mercure: {
      url: mercureUrl,
      publicUrl: mercurePublicUrl,
      jwtSecret: mercureJwtSecret,
    },
    oauth: {
      github: createOAuthConfig(),
      google: createOAuthConfig(),
      facebook: createOAuthConfig(),
    },
    session: {
      name: 'nuxt-session',
      password: resolveSessionPassword(),
    },
    redis: {
      url: process.env.REDIS_URL || '',
      profileTtl: toPositiveInteger(process.env.REDIS_PROFILE_TTL, 60 * 60),
      adminTtl: toPositiveInteger(process.env.REDIS_ADMIN_TTL, 60),
      blogTtl: toPositiveInteger(process.env.REDIS_BLOG_TTL, 60),
      profileEventsTtl: toPositiveInteger(
        process.env.REDIS_PROFILE_EVENTS_TTL,
        60,
      ),
      profilePluginsTtl: toPositiveInteger(
        process.env.REDIS_PROFILE_PLUGINS_TTL,
        60,
      ),
      profilePostsTtl: toPositiveInteger(
        process.env.REDIS_PROFILE_POSTS_TTL,
        60,
      ),
      profilePublicTtl: toPositiveInteger(
        process.env.REDIS_PROFILE_PUBLIC_TTL,
        60,
      ),
      workspaceTtl: toPositiveInteger(process.env.REDIS_WORKSPACE_TTL, 60),
    },
    profileCookie: {
      name: process.env.PROFILE_COOKIE_NAME || 'bro_profile',
      maxAge: toPositiveInteger(
        process.env.PROFILE_COOKIE_MAX_AGE,
        60 * 60 * 24 * 30,
      ),
    },
    public: {
      mercure: {
        hubUrl: mercurePublicUrl,
      },
      messenger: {
        apiBase:
          process.env.NUXT_PUBLIC_MESSENGER_API_BASE ||
          DEFAULT_MESSENGER_API_BASE,
        mercureHubUrl:
          process.env.NUXT_PUBLIC_MESSENGER_HUB_URL || mercurePublicUrl,
        notificationTopic:
          process.env.NUXT_PUBLIC_MESSENGER_NOTIFICATION_TOPIC ||
          DEFAULT_MESSENGER_NOTIFICATION_TOPIC,
        notificationReconnectDelay: toPositiveInteger(
          process.env.NUXT_PUBLIC_MESSENGER_NOTIFICATION_RECONNECT_DELAY,
          5000,
        ),
        subscription: {
          hubUrl:
            process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_HUB_URL ||
            process.env.NUXT_PUBLIC_MESSENGER_HUB_URL ||
            mercurePublicUrl,
          topics: process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_TOPICS || '',
          token: process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_TOKEN || '',
          withCredentials:
            process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_WITH_CREDENTIALS ||
            '',
          retry: process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_RETRY || '',
        },
      },
    },
  },
  compatibilityDate: '2024-08-05',
})
