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

export type ImageInterfaceNoId = ImageInterfaceAttributes

export type ImageInterfaceJsonld = ImageInterface & JsonLdResource

export type ImageInterfaceJsonldNoId = ImageInterfaceAttributes & JsonLdResource

export type ImageInterfaceJsonldNoIdAlias = ImageInterfaceJsonldNoId
