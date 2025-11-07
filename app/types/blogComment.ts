import type { BlogPost } from './blogPost'
import type { BlogUser } from './blog'

export interface BlogComment extends Record<string, unknown> {
  id?: string | number
  uuid?: string | number
  content?: string | null
  body?: string | null
  message?: string | null
  text?: string | null
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
  user?: BlogUser | null
  author?: BlogUser | null
  post?: BlogPost | null
  article?: BlogPost | null
  entry?: BlogPost | null
  target?: BlogPost | null
  postTitle?: string | null
  post_title?: string | null
  replies?: unknown
  replyCount?: number
  repliesCount?: number
  replies_count?: number
  likes?: number
  likeCount?: number
  likesCount?: number
  reactionsCount?: number
}

export interface BlogCommentListResponse extends Record<string, unknown> {
  data?: BlogComment[]
  items?: BlogComment[]
  results?: BlogComment[]
  rows?: BlogComment[]
  entries?: BlogComment[]
  'hydra:member'?: BlogComment[]
  'hydra:members'?: BlogComment[]
}

export type BlogCommentPayload = Record<string, unknown>
