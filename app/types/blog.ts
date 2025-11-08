export interface BlogPostUser {
  id: string
  firstName?: string | null
  lastName?: string | null
  username: string
  email?: string | null
  photo?: string | null
}

export interface BlogMedia {
  id: string
  url: string
  type: string
  alt?: string | null
}

export interface BlogReactionPreview {
  id: string
  type: string
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
  isReacted?: boolean | string | null
  reactions_preview?: BlogReactionPreview[]
  comments_preview?: BlogComment[]
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
  isReacted?: boolean | string | null
  reactions_count?: number
  totalComments?: number
  user: BlogPostUser
  reactions_preview?: BlogReactionPreview[]
  comments_preview?: BlogComment[]
}

export interface BlogListResponse<T> {
  data: T[]
  page: number
  limit: number
  count: number
}

export type BlogPostListResponse = BlogListResponse<BlogPost>
export type BlogCommentListResponse = BlogListResponse<BlogComment>

export interface BlogCommentPayload {
  content: string
}

export interface BlogPostUpdatePayload {
  title?: string
  summary?: string | null
  content?: string | null
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
