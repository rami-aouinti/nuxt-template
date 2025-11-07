export interface BlogUser extends Record<string, unknown> {
  id?: string | number
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  fullName?: string | null
  email?: string | null
  name?: string | null
}

export interface BlogTeam extends Record<string, unknown> {
  id?: string | number
  name?: string | null
  title?: string | null
  label?: string | null
  slug?: string | null
}

export interface Blog extends Record<string, unknown> {
  id?: string | number
  uuid?: string | number
  title?: string | null
  name?: string | null
  subtitle?: string | null
  description?: string | null
  slug?: string | null
  visibility?: string | null
  visible?: boolean
  isVisible?: boolean
  isPublished?: boolean
  published?: boolean
  status?: string | null
  state?: string | null
  publishedAt?: string | null
  published_at?: string | null
  publicationDate?: string | null
  publishedOn?: string | null
  createdAt?: string | null
  created_at?: string | null
  updatedAt?: string | null
  updated_at?: string | null
  owner?: BlogUser | null
  user?: BlogUser | null
  author?: BlogUser | null
  teams?: (BlogTeam | string)[] | null
  categories?: (BlogTeam | string)[] | null
  groups?: (BlogTeam | string)[] | null
}

export interface BlogListResponse extends Record<string, unknown> {
  data?: Blog[]
  items?: Blog[]
  results?: Blog[]
  rows?: Blog[]
  entries?: Blog[]
  'hydra:member'?: Blog[]
  'hydra:members'?: Blog[]
}

export type BlogPayload = Record<string, unknown>
