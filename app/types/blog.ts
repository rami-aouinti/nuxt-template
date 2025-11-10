export interface BlogPostUser {
  id: string
  firstName?: string | null
  lastName?: string | null
  username: string
  email?: string | null
  photo?: string | null
}

export type BlogUser = BlogPostUser

export interface BlogMedia {
  id: string
  url: string
  type: string
  alt?: string | null
}

export type BlogReactionType =
  | 'like'
  | 'love'
  | 'care'
  | 'haha'
  | 'wow'
  | 'sad'
  | 'angry'

export interface BlogReactionPreview {
  id: string
  type: BlogReactionType | string
  user: BlogPostUser
}

export interface BlogCommentLike {
  id: string
  type?: BlogReactionType | string | null
  user: BlogPostUser
}

export interface BlogComment {
  id: string
  content: string
  user: BlogPostUser
  publishedAt: string
  reactions_count?: number
  likes_count?: number
  totalComments?: number
  isReacted?: boolean | BlogReactionType | string | null
  reactions_preview?: BlogReactionPreview[]
  comments_preview?: BlogComment[]
  likes?: BlogCommentLike[] | null
  children?: BlogComment[] | null
}

export interface BlogSummary {
  id: string
  title: string
  blogSubtitle?: string | null
  logo?: string | null
  author: string
  teams?: string[] | null
  slug?: string | null
}

export interface BlogPost {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  slug: string
  publishedAt: string
  url?: string | null
  medias?: BlogMedia[]
  isReacted?: boolean | BlogReactionType | string | null
  reactions_count?: number
  totalComments?: number
  user: BlogPostUser
  reactions_preview?: BlogReactionPreview[]
  comments_preview?: BlogComment[]
  blog?: BlogSummary | null
  sharedFrom?: BlogPost | null
}

export interface BlogListResponse<T> {
  data: T[]
  page: number
  limit: number
  count: number
}

export type BlogPostListResponse = BlogListResponse<BlogPost>
export type BlogCommentListResponse = BlogListResponse<BlogComment>

export type BlogSummaryListResponse = BlogSummary[]

export interface BlogCommentPayload {
  content: string
}

export interface BlogPostUpdatePayload {
  title?: string
  summary?: string | null
  content?: string | null
}

export interface BlogPostSharePayload {
  content?: string | null
}

export interface BlogCreatePayload {
  title: string
  blogSubtitle?: string | null
  teams?: string[] | null
}

export interface BlogUpdatePayload {
  title?: string
  blogSubtitle?: string | null
  teams?: string[] | null
}

export interface BlogPostCreatePayload {
  title: string
  summary?: string | null
  content?: string | null
  url?: string | null
  blog: string
}

export interface BlogCommentUiState {
  replyOpen: boolean
  replyContent: string
  replyLoading: boolean
  likeLoading: boolean
}

export interface BlogCommentViewModel extends BlogComment {
  replies: BlogCommentViewModel[]
  ui: BlogCommentUiState
}

export interface BlogPostEditFormState {
  title: string
  summary: string
  content: string
  loading: boolean
}

export interface BlogPostUiState {
  commentsVisible: boolean
  commentsLoaded: boolean
  commentsLoading: boolean
  commentsError: string | null
  commentContent: string
  commentLoading: boolean
  likeLoading: boolean
  deleteLoading: boolean
  editDialog: boolean
  editForm: BlogPostEditFormState
}

export interface BlogPostViewModel extends BlogPost {
  comments: BlogCommentViewModel[]
  ui: BlogPostUiState
}
