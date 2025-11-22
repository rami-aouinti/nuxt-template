export type SnakeToCamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Lowercase<Head>}${Capitalize<SnakeToCamelCase<Tail>>}`
  : S

export type Camelize<T> = T extends (infer U)[]
  ? Camelize<U>[]
  : T extends Record<string, unknown>
    ? { [K in keyof T as SnakeToCamelCase<K & string>]: Camelize<T[K]> }
    : T

const toCamelCase = (value: string) =>
  value.replace(/[_-](\w)/g, (_, char: string) => char.toUpperCase())

export function camelizeKeys<T>(input: T): Camelize<T> {
  if (Array.isArray(input)) {
    return input.map((item) => camelizeKeys(item)) as Camelize<T>
  }

  if (input && typeof input === 'object') {
    return Object.entries(input as Record<string, unknown>).reduce(
      (acc, [key, value]) => {
        acc[toCamelCase(key)] = camelizeKeys(value)
        return acc
      },
      {} as Record<string, unknown>,
    ) as Camelize<T>
  }

  return input as Camelize<T>
}
