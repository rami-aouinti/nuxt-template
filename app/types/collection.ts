import type { HydraContext } from './hydra'

export interface Collection {
  readonly empty?: unknown
  readonly keys?: unknown
  readonly values?: unknown
  readonly iterator?: unknown
}

export type CollectionSyliusShopProductIndex = Collection

export type CollectionSyliusShopProductShow = Collection

export interface CollectionJsonld extends Collection {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type CollectionJsonldSyliusShopProductIndex = CollectionJsonld

export type CollectionJsonldSyliusShopProductShow = CollectionJsonld

export interface CollectionJsonldNoid extends Collection {
  '@context'?: HydraContext
  '@type'?: string
}

export type CollectionNoid = Collection
