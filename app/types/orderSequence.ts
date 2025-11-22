import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface OrderSequence {
  idx: number
  id?: number
  version?: number
}

export type OrderSequenceSyliusAdminOrderSequenceIndex = OrderSequence

export type OrderSequenceSyliusAdminOrderSequenceShow = OrderSequence

export interface OrderSequenceJsonld extends OrderSequence, JsonLdResource {}

export type OrderSequenceJsonldSyliusAdminOrderSequenceIndex = OrderSequenceJsonld

export type OrderSequenceJsonldSyliusAdminOrderSequenceShow =
  OrderSequenceJsonldSyliusAdminOrderSequenceIndex
