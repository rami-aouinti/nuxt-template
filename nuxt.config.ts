import { defineNuxtConfig } from 'nuxt/config'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { assertRequiredEnv } from './server/utils/assertRequiredEnv'

const projectRoot = fileURLToPath(new URL('./', import.meta.url))
const localeDirectory = resolve(projectRoot, 'app/i18n/locales')

const DEFAULT_MERCURE_URL = 'http://bro-world.org:3000/.well-known/mercure'
const DEFAULT_MERCURE_PUBLIC_URL =
  'http://bro-world.org:3000/.well-known/mercure'
const DEFAULT_MESSENGER_API_BASE = 'https://bro-world.org/api/v1/messenger'
const DEFAULT_MESSENGER_NOTIFICATION_TOPIC =
  'https://bro-world.org/notifications/'
const DEFAULT_MESSENGER_NOTIFICATION_TOPICS = [
  DEFAULT_MESSENGER_NOTIFICATION_TOPIC,
  '/notifications',
]
const DEFAULT_MESSENGER_SUBSCRIPTION_TOPIC =
  '/messages/{userId}/{conversationId}'

assertRequiredEnv([
  {
    key: 'EDUCATION_API_BASE_URL',
    aliases: ['NUXT_EDUCATION_API_BASE_URL'],
  },
  {
    key: 'EDUCATION_API_USERNAME',
    aliases: ['NUXT_EDUCATION_API_USERNAME'],
  },
  {
    key: 'EDUCATION_API_PASSWORD',
    aliases: ['NUXT_EDUCATION_API_PASSWORD'],
  },
  {
    key: 'ECOMMERCE_ADMIN_EMAIL',
    aliases: ['NUXT_ECOMMERCE_ADMIN_EMAIL'],
  },
  {
    key: 'ECOMMERCE_ADMIN_PASSWORD',
    aliases: ['NUXT_ECOMMERCE_ADMIN_PASSWORD'],
  },
  {
    key: 'ECOMMERCE_SHOP_EMAIL',
    aliases: ['NUXT_ECOMMERCE_SHOP_EMAIL'],
  },
  {
    key: 'ECOMMERCE_SHOP_PASSWORD',
    aliases: ['NUXT_ECOMMERCE_SHOP_PASSWORD'],
  },
])

const educationApiBaseUrl =
  process.env.NUXT_EDUCATION_API_BASE_URL ||
  process.env.EDUCATION_API_BASE_URL ||
  ''

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
const ICON_BUNDLE_ALLOWLIST = [
  'mdi:alert-circle',
  'mdi:arrow-down',
  'mdi:arrow-left',
  'mdi:arrow-right',
  'mdi:arrow-up',
  'mdi:calendar',
  'mdi:check',
  'mdi:check-circle',
  'mdi:chevron-down',
  'mdi:chevron-left',
  'mdi:chevron-right',
  'mdi:chevron-up',
  'mdi:circle',
  'mdi:close',
  'mdi:close-circle',
  'mdi:cloud-upload',
  'mdi:information',
  'mdi:menu-down',
  'mdi:minus',
  'mdi:paperclip',
  'mdi:pencil',
  'mdi:plus',
  'mdi:star',
  'mdi:star-outline',
]

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
    'nuxt-auth-utils',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@nuxtjs/apollo'
  ],
  css: ['~/assets/styles/index.css'],
  experimental: { typedPages: true, inlineSSRStyles: true },
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
      icons: ICON_BUNDLE_ALLOWLIST,
      scan: true,
    },
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        i18n: projectRoot,
        '@apollo/client/core/index.js': resolve(
          projectRoot,
          'app/utils/apolloErrorShim.js',
        ),
      },
    },
    build: {
      sourcemap: false,
      cssCodeSplit: process.env.NUXT_CSS_CODE_SPLIT !== 'false',
    },
  },
  nitro: {
    alias: {
      i18n: projectRoot,
      '@apollo/client/core/index.js': resolve(
        projectRoot,
        'app/utils/apolloErrorShim.js',
      ),
    },
  },
  apollo: {
    authType: 'Bearer',
    authHeader: 'Authorization',
    clients: {
      default: {
        httpEndpoint: `${educationApiBaseUrl}/api/graphql`,
        httpLinkOptions: {
          credentials: 'include',
        },
      },
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
    educationApiBaseUrl,
    educationApiAuth: {
      token: process.env.EDUCATION_API_AUTH_TOKEN || '',
      username:
        process.env.NUXT_EDUCATION_API_USERNAME ||
        process.env.EDUCATION_API_USERNAME ||
        '',
      password:
        process.env.NUXT_EDUCATION_API_PASSWORD ||
        process.env.EDUCATION_API_PASSWORD ||
        '',
    },
    mercure: {
      url: mercureUrl,
      publicUrl: mercurePublicUrl,
      jwtSecret: mercureJwtSecret,
    },
    broWorld: {
      ecommerce: {
        admin: {
          email:
            process.env.NUXT_ECOMMERCE_ADMIN_EMAIL ||
            process.env.ECOMMERCE_ADMIN_EMAIL ||
            '',
          password:
            process.env.NUXT_ECOMMERCE_ADMIN_PASSWORD ||
            process.env.ECOMMERCE_ADMIN_PASSWORD ||
            '',
        },
        shop: {
          email:
            process.env.NUXT_ECOMMERCE_SHOP_EMAIL ||
            process.env.ECOMMERCE_SHOP_EMAIL ||
            '',
          password:
            process.env.NUXT_ECOMMERCE_SHOP_PASSWORD ||
            process.env.ECOMMERCE_SHOP_PASSWORD ||
            '',
        },
      },
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
      workplaceTtl: toPositiveInteger(process.env.REDIS_WORKPLACE_TTL, 60),
      ecommerceTtl: toPositiveInteger(process.env.REDIS_ECOMMERCE_TTL, 60),
    },
    profileCookie: {
      name: process.env.PROFILE_COOKIE_NAME || 'bro_profile',
      maxAge: toPositiveInteger(
        process.env.PROFILE_COOKIE_MAX_AGE,
        60 * 60 * 24 * 30,
      ),
    },
    public: {
      educationApiBaseUrl:
        process.env.NUXT_PUBLIC_EDUCATION_API_BASE_URL || '',
      educationApiProxyBaseUrl:
        process.env.NUXT_PUBLIC_EDUCATION_API_PROXY_BASE_URL ||
        '/api/education',
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
        notificationTopics:
          process.env.NUXT_PUBLIC_MESSENGER_NOTIFICATION_TOPICS ||
          DEFAULT_MESSENGER_NOTIFICATION_TOPICS,
        notificationReconnectDelay: toPositiveInteger(
          process.env.NUXT_PUBLIC_MESSENGER_NOTIFICATION_RECONNECT_DELAY,
          5000,
        ),
        notificationWithCredentials:
          process.env.NUXT_PUBLIC_MESSENGER_NOTIFICATION_WITH_CREDENTIALS || '',
        subscription: {
          hubUrl:
            process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_HUB_URL ||
            process.env.NUXT_PUBLIC_MESSENGER_HUB_URL ||
            mercurePublicUrl,
          topics:
            process.env.NUXT_PUBLIC_MESSENGER_SUBSCRIPTION_TOPICS ||
            DEFAULT_MESSENGER_SUBSCRIPTION_TOPIC,
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
