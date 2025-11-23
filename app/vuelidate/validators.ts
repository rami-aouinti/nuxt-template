function withMessage<T extends (...args: any[]) => boolean>(validator: T, message: string) {
  ;(validator as any).$message = message
  return validator
}

export const required = withMessage((value: any) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}, 'This field is required')

export const url = withMessage((value: any) => {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}, 'Invalid URL')

export const minValue = (min: number) =>
  withMessage((value: any) => (value === undefined || value === null ? true : Number(value) >= min), `Minimum value is ${min}`)

export const maxValue = (max: number) =>
  withMessage((value: any) => (value === undefined || value === null ? true : Number(value) <= max), `Maximum value is ${max}`)
