import { useI18n } from '#imports'

export type TranslateWithFallback = (
  key: string | null | undefined,
  fallback?: string,
) => string

export function useTranslateWithFallback(): TranslateWithFallback {
  const { t } = useI18n()

  return (key, fallback) => {
    if (!key) return fallback ?? ''

    const value = t(key)
    return value && value !== key ? value : (fallback ?? key ?? '')
  }
}
