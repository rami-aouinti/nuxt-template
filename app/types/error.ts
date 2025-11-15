import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ErrorAttributes {
  title?: string | null
  detail?: string | null
  status?: number
  instance?: string | null
  type?: string
}

export type ErrorSchema = ErrorAttributes

export interface ErrorJsonld extends ErrorAttributes, JsonLdResource {
  description?: string | null
}

export interface ErrorJsonldNoId extends ErrorAttributes {
  '@context'?: HydraContext
  '@type'?: string
  description?: string | null
}

export type ErrorJsonldSyliusAdmin = ErrorJsonld

export type ErrorJsonldSyliusShop = ErrorJsonld

export type ErrorSchemaSyliusAdmin = ErrorSchema

export type ErrorSchemaSyliusShop = ErrorSchema
