export interface Workplace {
  id: string
  name: string
  slug: string
}

export interface WorkplacePayload {
  name: string
}

export interface FrontendWorkplaceCreatePayload {
  name: string
  isPrivate?: boolean
  enabled?: boolean
}

export interface FrontendWorkplaceUpdatePayload {
  name?: string
  isPrivate?: boolean
  enabled?: boolean
}

export interface WorkplacePluginPayload {
  plugins: string[]
}

export interface WorkplaceMemberPayload {
  members: string[]
}
