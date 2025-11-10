import { computed, unref } from 'vue'
import type { MaybeRef } from 'vue'

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
