export function getField(state: any, path?: string) {
  if (!path) return undefined
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], state)
}

export function updateField(state: any, field: { path?: string; value: any }) {
  if (!field?.path) return
  const segments = field.path.split('.')
  let target = state
  while (segments.length > 1) {
    const key = segments.shift() as string
    target[key] = target[key] ?? {}
    target = target[key]
  }
  target[segments[0] as string] = field.value
}

export function mapFields(fields: any) {
  const normalized = Array.isArray(fields)
    ? fields.map((key) => ({ key, path: key }))
    : Object.keys(fields || {}).map((key) => ({
        key,
        path: (fields as any)[key],
      }))

  return normalized.reduce(
    (acc, { key, path }) => {
      acc[key] = {
        get(this: any) {
          return getField(this?.$store?.state ?? {}, path)
        },
        set(this: any, value: any) {
          updateField(this?.$store?.state ?? {}, { path, value })
        },
      }
      return acc
    },
    {} as Record<string, any>,
  )
}

export default { getField, updateField, mapFields }
