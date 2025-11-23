import { useStore } from './vuex'

function resolvePath(obj: Record<string, any>, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

export function getField(state: Record<string, any>, path: string) {
  return resolvePath(state, path)
}

export function updateField(
  state: Record<string, any>,
  { path, value }: { path: string; value: any },
) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return
  const target = keys.reduce(
    (acc, key) => {
      if (!(key in acc)) acc[key] = {}
      return acc[key]
    },
    state as Record<string, any>,
  )
  target[lastKey] = value
}

export function mapFields(fields: string[] | Record<string, string>) {
  const store = useStore()
  const mapping = Array.isArray(fields)
    ? Object.fromEntries(fields.map((field) => [field, field]))
    : fields

  return Object.fromEntries(
    Object.entries(mapping).map(([key, path]) => [
      key,
      {
        get() {
          return getField(store.state, path)
        },
        set(value: any) {
          updateField(store.state, { path, value })
        },
      },
    ]),
  )
}

export function createHelpers() {
  return { mapFields }
}

export default { getField, updateField, mapFields, createHelpers }
