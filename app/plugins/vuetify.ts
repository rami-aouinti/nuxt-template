import type { IconProps } from 'vuetify'
import { Icon } from '#components'
import { useStorage } from '@vueuse/core'
import { aliases } from 'vuetify/iconsets/mdi'
import { watch } from 'vue'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { ar, de, en, es, fr, it, ru, zhHans } from 'vuetify/locale'

const vuetifyLocales: Record<string, Record<string, unknown>> = {
  ar,
  de,
  en,
  es,
  fr,
  it,
  ru,
  'zh-cn': zhHans,
}

const mergeVuetifyLocaleMessages = (
  i18n: ReturnType<typeof useNuxtApp>['$i18n'],
  locale: string,
) => {
  if (!i18n) return

  const normalizedLocale = locale.toLowerCase()
  const vuetifyMessages = vuetifyLocales[normalizedLocale]

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
  const i18n = nuxtApp.$i18n

  if (i18n) {
    Object.keys(vuetifyLocales).forEach((locale) =>
      mergeVuetifyLocaleMessages(i18n, locale),
    )

    watch(
      i18n.locale,
      (newLocale) => {
        if (typeof newLocale === 'string') {
          mergeVuetifyLocaleMessages(i18n, newLocale)
        }
      },
      { immediate: true },
    )

    nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
      if (typeof newLocale === 'string') {
        mergeVuetifyLocaleMessages(i18n, newLocale)
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

    if (i18n) {
      vuetifyOptions.locale = {
        adapter: createVueI18nAdapter({ i18n }),
      }
    }
  })
})
