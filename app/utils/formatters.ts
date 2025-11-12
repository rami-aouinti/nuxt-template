import { computed, unref } from 'vue'
import type { MaybeRef } from 'vue'

type MaybeLocale = string | null | undefined

const DEFAULT_RELATIVE_TIME_THRESHOLDS: Array<{
  unit: Intl.RelativeTimeFormatUnit
  seconds: number
}> = [
  { unit: 'year', seconds: 60 * 60 * 24 * 365 },
  { unit: 'month', seconds: 60 * 60 * 24 * 30 },
  { unit: 'week', seconds: 60 * 60 * 24 * 7 },
  { unit: 'day', seconds: 60 * 60 * 24 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
]

export type DateInput = string | number | Date | null | undefined

export const createDateFormatter = (
  locale: MaybeRef<string | undefined>,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  },
) => computed(() => new Intl.DateTimeFormat(unref(locale) ?? 'en', options))

export const formatDateValue = (
  value: DateInput,
  formatter: Intl.DateTimeFormat,
  emptyPlaceholder: string,
): string => {
  if (value == null) {
    return emptyPlaceholder
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : emptyPlaceholder
  }

  return formatter.format(date)
}

export const createNumberFormatter = (
  locale: MaybeRef<string | undefined>,
  options?: Intl.NumberFormatOptions,
) => computed(() => new Intl.NumberFormat(unref(locale) ?? 'en', options))

export const formatNumberValue = (
  value: number | string | null | undefined,
  formatter: Intl.NumberFormat,
): string => {
  if (value == null) {
    return formatter.format(0)
  }

  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return String(value)
  }

  return formatter.format(numeric)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}…`
}

export const formatPublishedAt = (
  publishedAt: string,
  locale: MaybeLocale,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: 'short',
  },
): string => {
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime())) {
    return publishedAt
  }

  const formatter = new Intl.DateTimeFormat(locale ?? 'en', options)
  return formatter.format(date)
}

export const formatRelativePublishedAt = (
  publishedAt: string,
  locale: MaybeLocale,
  options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' },
  now: number = Date.now(),
): string => {
  const target = new Date(publishedAt)
  if (Number.isNaN(target.getTime())) {
    return formatPublishedAt(publishedAt, locale)
  }

  const relativeFormatter = new Intl.RelativeTimeFormat(locale ?? 'en', options)
  const diffInSeconds = Math.round((target.getTime() - now) / 1000)

  for (const { unit, seconds } of DEFAULT_RELATIVE_TIME_THRESHOLDS) {
    if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
      if (unit === 'second' && Math.abs(diffInSeconds) < 45) {
        return relativeFormatter.format(0, 'second')
      }

      const value = Math.round(diffInSeconds / seconds)
      return relativeFormatter.format(value, unit)
    }
  }

  return formatPublishedAt(publishedAt, locale)
}
