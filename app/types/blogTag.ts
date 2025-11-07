export interface BlogTag extends Record<string, unknown> {
  id?: string | number
  uuid?: string | number
  name?: string | null
  title?: string | null
  label?: string | null
  description?: string | null
  summary?: string | null
  color?: string | null
  hex?: string | null
  hexColor?: string | null
  hex_color?: string | null
  usage?: number
  usageCount?: number
  count?: number
  total?: number
  posts?: unknown
  postCount?: number
  post_count?: number
  createdAt?: string | null
  created_at?: string | null
  updatedAt?: string | null
  updated_at?: string | null
  visibility?: string | null
  visible?: boolean
  isVisible?: boolean
  isPublished?: boolean
  published?: boolean
  status?: string | null
  state?: string | null
}

export interface BlogTagListResponse extends Record<string, unknown> {
  data?: BlogTag[]
  items?: BlogTag[]
  results?: BlogTag[]
  rows?: BlogTag[]
  entries?: BlogTag[]
  'hydra:member'?: BlogTag[]
  'hydra:members'?: BlogTag[]
}

export type BlogTagPayload = Record<string, unknown>
