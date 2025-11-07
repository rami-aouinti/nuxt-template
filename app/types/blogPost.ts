import type { Blog, BlogUser } from './blog'
import type { BlogTag } from './blogTag'

export interface BlogPost extends Record<string, unknown> {
  id?: string | number
  uuid?: string | number
  title?: string | null
  name?: string | null
  summary?: string | null
  description?: string | null
  content?: string | null
  slug?: string | null
  path?: string | null
  identifier?: string | null
  url?: string | null
  permalink?: string | null
  link?: string | null
  href?: string | null
  publishedAt?: string | null
  published_at?: string | null
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
  blog?: Blog | null
  blogTitle?: string | null
  blogName?: string | null
  blogSlug?: string | null
  user?: BlogUser | null
  author?: BlogUser | null
  totalComments?: number
  commentsCount?: number
  commentCount?: number
  comments?: unknown
  reactionsCount?: number
  likes?: number
  likesCount?: number
  likeCount?: number
  tags?: (BlogTag | string)[] | null
  tagList?: (BlogTag | string)[] | null
  tagNames?: string[] | null
  categories?: (BlogTag | string)[] | null
}

export interface BlogPostListResponse extends Record<string, unknown> {
  data?: BlogPost[]
  items?: BlogPost[]
  results?: BlogPost[]
  rows?: BlogPost[]
  entries?: BlogPost[]
  'hydra:member'?: BlogPost[]
  'hydra:members'?: BlogPost[]
}

export type BlogPostPayload = Record<string, unknown>
