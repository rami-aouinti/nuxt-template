import en from './locales/en.json'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '~/utils/i18n/locales'

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  availableLocales: [...SUPPORTED_LOCALES],
  messages: {
    [DEFAULT_LOCALE]: en,
  },
}))
