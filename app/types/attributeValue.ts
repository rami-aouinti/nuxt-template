import type { HydraContext } from './hydra'

interface JsonLdResource {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface AttributeValueInterface {
  subject: string
  attribute: string
  value: unknown
  code?: string | null
  name?: string | null
  type?: string | null
  localeCode: string | null
  id: number
}

export interface AttributeValueInterfaceJsonLd
  extends AttributeValueInterface,
    JsonLdResource {}
