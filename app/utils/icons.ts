import type { IconValue } from 'vuetify/lib/composables/icons'

export type IconInput = IconValue | false | null | undefined
export type IconProp = IconInput | true

export const normalizeIconValue = (value: IconInput): IconValue | undefined => {
  if (value === false || value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  return value
}

export const normalizeIconProp = (
  value: IconProp,
): IconValue | true | undefined => {
  if (value === true) {
    return true
  }

  return normalizeIconValue(value)
}
