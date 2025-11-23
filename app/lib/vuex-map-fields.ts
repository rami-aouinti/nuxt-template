import { computed } from 'vue'
import { useStore } from './vuex'

type FieldMapping = Record<string, string> | string[]

type FieldPayload = {
  path: string
  value: unknown
}

const getFromPath = (state: any, path: string) => {
  return path
    .split('.')
    .reduce((acc, key) => (acc ? acc[key] : undefined), state)
}

const setByPath = (state: any, path: string, value: unknown) => {
  const keys = path.split('.')
  const last = keys.pop()
  if (!last) return
  const target = keys.reduce((acc: any, key) => {
    if (!acc[key]) acc[key] = {}
    return acc[key]
  }, state)
  target[last] = value
}

export const getField = (state: any, path: string) => getFromPath(state, path)

export const updateField = (state: any, payload: FieldPayload) => {
  setByPath(state, payload.path, payload.value)
}

const resolveStore = (ctx?: any) => ctx?.$store ?? useStore()

export const mapFields = (
  namespaceOrFields: string | FieldMapping,
  fields?: FieldMapping,
  getterType = 'getField',
  mutationType = 'updateField',
) => {
  const hasNamespace = typeof namespaceOrFields === 'string'
  const fieldMap = hasNamespace
    ? fields || {}
    : (namespaceOrFields as FieldMapping)
  const namespace = hasNamespace ? (namespaceOrFields as string) : ''

  const normalizedEntries = Array.isArray(fieldMap)
    ? (fieldMap as string[]).map((field) => [field, field])
    : Object.entries(fieldMap)

  return normalizedEntries.reduce(
    (acc, [key, field]) => {
      const path = field as string
      const getterKey = namespace ? `${namespace}/${getterType}` : getterType
      const mutationKey = namespace
        ? `${namespace}/${mutationType}`
        : mutationType

      acc[key] = {
        get(this: any) {
          const store = resolveStore(this)
          const state = namespace ? store?.state?.[namespace] : store?.state
          return (
            store?.getters?.[getterKey]?.(state, path) ??
            getFromPath(state, path)
          )
        },
        set(this: any, value: unknown) {
          const store = resolveStore(this)
          if (store?.commit) {
            store.commit(mutationKey, { path, value })
            return
          }
          const state = namespace ? store?.state?.[namespace] : store?.state
          setByPath(state, path, value)
        },
      }

      return acc
    },
    {} as Record<string, any>,
  )
}

export const createHelpers = (options?: {
  getterType?: string
  mutationType?: string
  namespace?: string
}) => {
  const getterType = options?.getterType || 'getField'
  const mutationType = options?.mutationType || 'updateField'
  const namespace = options?.namespace || ''

  return {
    getField,
    updateField,
    mapFields: (fields: FieldMapping) =>
      mapFields(namespace || '', fields, getterType, mutationType),
  }
}
