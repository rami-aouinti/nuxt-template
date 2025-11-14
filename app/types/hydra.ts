export type HydraContext =
  | string
  | {
      '@vocab'?: string
      hydra?: 'http://www.w3.org/ns/hydra/core#'
      [key: string]: unknown
    }
