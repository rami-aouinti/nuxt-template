import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ImageInterfaceAttributes {
  type?: string | null
  file?: string | null
  path?: string | null
  owner?: unknown
}

export interface ImageInterface extends ImageInterfaceAttributes {
  id?: unknown
}

export interface ImageInterfaceNoId extends ImageInterfaceAttributes {}

export interface ImageInterfaceJsonld extends ImageInterface, JsonLdResource {}

export interface ImageInterfaceJsonldNoId
  extends ImageInterfaceAttributes,
    JsonLdResource {}

export type ImageInterfaceJsonldNoIdAlias = ImageInterfaceJsonldNoId
