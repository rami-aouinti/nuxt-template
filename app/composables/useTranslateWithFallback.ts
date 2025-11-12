import { useI18n } from '#imports'

export type TranslateWithFallback = (key: string, fallback: string) => string

export function useTranslateWithFallback(): TranslateWithFallback {
  const { t } = useI18n()

  return (key, fallback) => {
    const value = t(key)
    return value && value !== key ? value : fallback
  }
}
