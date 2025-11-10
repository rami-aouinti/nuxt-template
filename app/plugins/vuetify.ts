import type { IconProps } from 'vuetify'
import { Icon } from '#components'
import { useStorage } from '@vueuse/core'
import { aliases } from 'vuetify/iconsets/mdi'
import { watch } from 'vue'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n as useVueI18n } from 'vue-i18n'
import type { NuxtApp } from 'nuxt/app'
import { useThemePreferences } from '~/composables/useThemePreferences'

type VueI18nInstance = Parameters<typeof createVueI18nAdapter>[0]['i18n']

const resolveVueI18nInstance = (
  nuxtApp: NuxtApp,
): VueI18nInstance | undefined =>
  (nuxtApp as NuxtApp & { _nuxtI18n?: { vueI18n?: VueI18nInstance } })._nuxtI18n
    ?.vueI18n

const vuetifyLocaleLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  ar: async () => (await import('vuetify/lib/locale/ar')).default,
  de: async () => (await import('vuetify/lib/locale/de')).default,
  en: async () => (await import('vuetify/lib/locale/en')).default,
  es: async () => (await import('vuetify/lib/locale/es')).default,
  fr: async () => (await import('vuetify/lib/locale/fr')).default,
  it: async () => (await import('vuetify/lib/locale/it')).default,
  ru: async () => (await import('vuetify/lib/locale/ru')).default,
  'zh-cn': async () => (await import('vuetify/lib/locale/zh-Hans')).default,
}

const vuetifyLocaleCache = new Map<string, Record<string, unknown>>()

async function resolveVuetifyLocale(locale: string) {
  const normalizedLocale = locale.toLowerCase()
  if (vuetifyLocaleCache.has(normalizedLocale)) {
    return vuetifyLocaleCache.get(normalizedLocale)
  }

  const loader = vuetifyLocaleLoaders[normalizedLocale]
  if (!loader) {
    return undefined
  }

  const messages = await loader()
  vuetifyLocaleCache.set(normalizedLocale, messages)
  return messages
}

const mergeVuetifyLocaleMessages = async (
  i18n: ReturnType<typeof useNuxtApp>['$i18n'],
  locale: string,
) => {
  if (!i18n) return

  const normalizedLocale = locale.toLowerCase()
  const vuetifyMessages = await resolveVuetifyLocale(normalizedLocale)

  if (!vuetifyMessages) return

  const existingMessages = (i18n.getLocaleMessage(locale) ?? {}) as Record<
    string,
    unknown
  >
  const currentVuetifyMessages =
    (existingMessages['$vuetify'] as Record<string, unknown> | undefined) ?? {}

  i18n.setLocaleMessage(locale, {
    ...existingMessages,
    $vuetify: {
      ...currentVuetifyMessages,
      ...vuetifyMessages,
    },
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  useThemePreferences()

  const i18n = nuxtApp.$i18n

  if (i18n) {
    watch(
      i18n.locale,
      (newLocale) => {
        if (typeof newLocale === 'string') {
          void mergeVuetifyLocaleMessages(i18n, newLocale)
        }
      },
      { immediate: true },
    )

    nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
      if (typeof newLocale === 'string') {
        void mergeVuetifyLocaleMessages(i18n, newLocale)
      }
    })
  }

  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: 'nuxtIcon',
      sets: {
        nuxtIcon: {
          component: ({ icon, tag, ...rest }: IconProps) =>
            h(tag, rest, [
              h(Icon, { name: (aliases[icon as string] as string) ?? icon }),
            ]),
        },
      },
      aliases,
    }
    const primary = useStorage('theme-primary', '#1697f6').value
    vuetifyOptions.theme = {
      themes: {
        light: { colors: { primary } },
        dark: { colors: { primary } },
      },
    }

    const vueI18n = resolveVueI18nInstance(nuxtApp)

    if (vueI18n) {
      vuetifyOptions.locale = {
        adapter: createVueI18nAdapter({
          i18n: vueI18n,
          useI18n: useVueI18n,
        }),
      }
    }
  })
})
