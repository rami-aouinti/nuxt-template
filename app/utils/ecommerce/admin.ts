import type { Ref } from 'vue'

import { normalizeCollection } from '~/utils/collections'

type UnknownRecord = Record<string, unknown>

export const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value))

export const toRecord = (value: unknown): UnknownRecord | null =>
  isRecord(value) ? value : null

export function getString(
  source: UnknownRecord | null | undefined,
  keys: string | string[],
  fallback: string | null = null,
): string | null {
  if (!source) {
    return fallback
  }

  const keyList = Array.isArray(keys) ? keys : [keys]

  for (const key of keyList) {
    const value = source[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
  }

  return fallback
}

export function getNumber(
  source: UnknownRecord | null | undefined,
  keys: string | string[],
  fallback = 0,
): number {
  if (!source) {
    return fallback
  }

  const keyList = Array.isArray(keys) ? keys : [keys]

  for (const key of keyList) {
    const value = source[key]

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return fallback
}

export function getBoolean(
  source: UnknownRecord | null | undefined,
  keys: string | string[],
  fallback = false,
): boolean {
  if (!source) {
    return fallback
  }

  const keyList = Array.isArray(keys) ? keys : [keys]

  for (const key of keyList) {
    const value = source[key]

    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'number') {
      return value !== 0
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase()
      if (normalized === 'true') {
        return true
      }

      if (normalized === 'false') {
        return false
      }
    }
  }

  return fallback
}

export function normalizeHydraCollection<T>(value: unknown): T[] {
  if (!value) {
    return []
  }

  const direct = normalizeCollection<T>(value)
  if (direct.length > 0) {
    return direct
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is T => Boolean(item))
  }

  return []
}

const TRANSLATION_KEYS = ['translations', 'translation']

export function resolveTranslationRecord(
  source: UnknownRecord | null | undefined,
  locale: Ref<string> | string,
): UnknownRecord | null {
  if (!source) {
    return null
  }

  const localeCode = typeof locale === 'string' ? locale : locale.value
  const translations = TRANSLATION_KEYS.flatMap((key) => {
    const value = source[key]
    if (!value) {
      return []
    }

    if (Array.isArray(value)) {
      return value
    }

    if (isRecord(value)) {
      return Object.values(value)
    }

    return []
  })

  const formatted = translations
    .map((entry) => toRecord(entry))
    .filter((entry): entry is UnknownRecord => Boolean(entry))

  const exactLocale = formatted.find((entry) => {
    const entryLocale = getString(entry, ['locale', 'code'])
    return entryLocale === localeCode
  })

  if (exactLocale) {
    return exactLocale
  }

  return (
    formatted.find((entry) => Boolean(getString(entry, ['name', 'title']))) ??
    null
  )
}

export function resolveLocalizedString(
  source: UnknownRecord | null | undefined,
  locale: Ref<string> | string,
  keys: string | string[],
  fallback: string | null = null,
): string | null {
  const translation = resolveTranslationRecord(source, locale)
  if (translation) {
    const translated = getString(translation, keys, undefined)
    if (translated) {
      return translated
    }
  }

  return getString(source ?? null, keys, fallback)
}

export function getArray(
  source: UnknownRecord | null | undefined,
  keys: string | string[],
): unknown[] {
  if (!source) {
    return []
  }

  const keyList = Array.isArray(keys) ? keys : [keys]

  for (const key of keyList) {
    const value = source[key]
    if (Array.isArray(value)) {
      return value
    }
  }

  return []
}

export function safeDate(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }

  return null
}
