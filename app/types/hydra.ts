export type HydraContext =
  | string
  | {
      '@vocab'?: string
      hydra?: 'http://www.w3.org/ns/hydra/core#'
      [key: string]: unknown
    }

export interface HydraView {
  '@id'?: string
  '@type'?: string
  'hydra:first'?: string
  'hydra:last'?: string
  'hydra:previous'?: string
  'hydra:next'?: string
}

export interface HydraMapping {
  '@type'?: string
  variable?: string
  property?: string | null
  required?: boolean
}

export interface HydraSearch {
  '@type'?: string
  'hydra:template'?: string
  'hydra:variableRepresentation'?: string
  'hydra:mapping'?: HydraMapping[]
}

export interface HydraCollectionBaseSchema {
  'hydra:totalItems'?: number
  'hydra:search'?: HydraSearch
  'hydra:view'?: HydraView
}

export interface HydraCollectionBaseSchemaNoPagination {
  'hydra:totalItems'?: number
  'hydra:search'?: HydraSearch
}

export interface HydraItemBaseSchema {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
  [key: string]: unknown
}

export interface HydraItemBaseSchemaWithoutId {
  '@context'?: HydraContext
  '@type'?: string
  [key: string]: unknown
}
