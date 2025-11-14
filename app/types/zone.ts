import type { HydraContext } from './hydra'

export interface ZoneMemberSummary {
  belongsTo?: string | null
  id?: number
  code: string
}

export interface ZoneMember {
  id?: number
  code: string
  belongsTo?: string | null
  types?: unknown
  member?: ZoneMemberSummary[]
}

export interface ZoneMemberReference {
  code: string
}

export interface Zone {
  id?: number
  code: string
  name: string
  type: string
  scope?: string | null
  members?: ZoneMember[]
}

export interface ZoneCreatePayload {
  code: string
  name: string
  type: string
  scope?: string | null
  members?: ZoneMemberReference[]
}

export interface ZoneUpdatePayload {
  name: string
  members?: ZoneMemberReference[]
}

export type ZoneListItem = Zone
export type ZoneDetail = Zone

export interface ZoneJsonLd extends Zone {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export type ZoneJsonLdListItem = ZoneJsonLd
export type ZoneJsonLdDetail = ZoneJsonLd

export type ZoneMemberCreatePayload = ZoneMemberReference
export type ZoneMemberUpdatePayload = ZoneMemberReference
export type ZoneMemberListItem = ZoneMemberReference
export type ZoneMemberDetail = ZoneMemberReference

export interface ZoneMemberJsonLd extends ZoneMember {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ZoneMemberNoId {
  id?: number
  code: string
  belongsTo?: string | null
}

export interface ZoneMemberNoIdJsonLd extends ZoneMemberNoId {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}

export interface ZoneMemberInterface {
  belongsTo?: string | null
  id?: number
  code: string
}

export interface ZoneMemberInterfaceJsonLd extends ZoneMemberInterface {
  '@context'?: HydraContext
  '@id'?: string
  '@type'?: string
}
