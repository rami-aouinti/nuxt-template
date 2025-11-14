import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface AvatarImage {
  id: number
  type?: string | null
  file?: string | null
  path: string
  owner: string
}

export type AvatarImageAdminShow = Pick<AvatarImage, 'id' | 'path' | 'owner'>

export interface AvatarImageJsonLd extends AvatarImage, JsonLdResource {}

export interface AvatarImageAdminShowJsonLd
  extends AvatarImageAdminShow,
    JsonLdResource {}
