import { computed } from 'vue'
import type {
  BlogComment,
  BlogCommentListResponse,
  BlogCommentPayload,
  BlogCreatePayload,
  BlogPost,
  BlogPostCreatePayload,
  BlogPostListResponse,
  BlogPostUpdatePayload,
  BlogSummary,
  BlogSummaryListResponse,
} from '~/types/blog'

const PUBLIC_POSTS_ENDPOINT = 'https://blog.bro-world.org/public/post'
const PRIVATE_POSTS_ENDPOINT = 'https://blog.bro-world.org/v1/platform/post'
const PRIVATE_COMMENTS_ENDPOINT = 'https://blog.bro-world.org/v1/platform/comment'
const PUBLIC_BLOGS_ENDPOINT = 'https://blog.bro-world.org/public/blog'
const PROFILE_BLOGS_ENDPOINT = 'https://blog.bro-world.org/v1/profile/blog'
const PRIVATE_BLOGS_ENDPOINT = 'https://blog.bro-world.org/v1/platform/blog'

export const BLOG_POSTS_DEFAULT_LIMIT = 10

export class AuthenticationRequiredError extends Error {
  constructor() {
    super('AUTHENTICATION_REQUIRED')
    this.name = 'AuthenticationRequiredError'
  }
}

export const useBlogApi = () => {
  const { loggedIn, session } = useUserSession()

  const token = computed(() => session.value?.token ?? '')
  const isAuthenticated = computed(
    () => loggedIn.value && Boolean(token.value?.length),
  )

  const getAuthHeaders = (mandatory = false) => {
    if (!isAuthenticated.value) {
      if (mandatory) {
        throw new AuthenticationRequiredError()
      }
      return undefined
    }

    return {
      Authorization: `Bearer ${token.value}`,
    }
  }

  const fetchPosts = async (
    page: number,
    limit: number,
  ): Promise<BlogPostListResponse> => {
    const headers = getAuthHeaders(false)
    const endpoint = headers ? PRIVATE_POSTS_ENDPOINT : PUBLIC_POSTS_ENDPOINT

    return await $fetch<BlogPostListResponse>(endpoint, {
      params: { page, limit },
      headers,
    })
  }

  const fetchPublicBlogs = async (): Promise<BlogSummaryListResponse> =>
    await $fetch<BlogSummaryListResponse>(PUBLIC_BLOGS_ENDPOINT)

  const fetchUserBlogs = async (): Promise<BlogSummaryListResponse> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogSummaryListResponse>(PROFILE_BLOGS_ENDPOINT, {
      headers,
    })
  }

  const fetchComments = async (
    postId: string,
    page: number,
    limit: number,
  ): Promise<BlogCommentListResponse> => {
    const headers = getAuthHeaders(true)

    const response = await $fetch<BlogCommentListResponse | BlogComment[] | null>(
      `${PRIVATE_POSTS_ENDPOINT}/${postId}/comments`,
      {
        params: { page, limit },
        headers,
      },
    )

    if (Array.isArray(response)) {
      return {
        data: response,
        page,
        limit,
        count: response.length,
      }
    }

    const data = Array.isArray(response?.data) ? response.data : []

    return {
      data,
      page: typeof response?.page === 'number' ? response.page : page,
      limit: typeof response?.limit === 'number' ? response.limit : limit,
      count: typeof response?.count === 'number' ? response.count : data.length,
    }
  }

  const createComment = async (
    postId: string,
    payload: BlogCommentPayload,
  ): Promise<BlogComment> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogComment>(
      `${PRIVATE_POSTS_ENDPOINT}/${postId}/comment`,
      {
        method: 'POST',
        body: payload,
        headers,
      },
    )
  }

  const replyToComment = async (
    commentId: string,
    payload: BlogCommentPayload,
  ): Promise<BlogComment> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogComment>(
      `${PRIVATE_COMMENTS_ENDPOINT}/${commentId}/comment`,
      {
        method: 'POST',
        body: payload,
        headers,
      },
    )
  }

  const likePost = async (postId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_POSTS_ENDPOINT}/${postId}/like`, {
      method: 'POST',
      headers,
    })
  }

  const dislikePost = async (postId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_POSTS_ENDPOINT}/${postId}/dislike`, {
      method: 'POST',
      headers,
    })
  }

  const likeComment = async (commentId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_COMMENTS_ENDPOINT}/${commentId}/like`, {
      method: 'POST',
      headers,
    })
  }

  const dislikeComment = async (commentId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_COMMENTS_ENDPOINT}/${commentId}/dislike`, {
      method: 'POST',
      headers,
    })
  }

  const updatePost = async (
    postId: string,
    payload: BlogPostUpdatePayload,
  ): Promise<BlogPost> => {
    const headers = getAuthHeaders(true)

    return await $fetch(`${PRIVATE_POSTS_ENDPOINT}/${postId}`, {
      method: 'PATCH',
      body: payload,
      headers,
    })
  }

  const deletePost = async (postId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_POSTS_ENDPOINT}/${postId}`, {
      method: 'DELETE',
      headers,
    })
  }

  const createBlog = async (payload: BlogCreatePayload): Promise<BlogSummary> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogSummary>(PRIVATE_BLOGS_ENDPOINT, {
      method: 'POST',
      body: payload,
      headers,
    })
  }

  const createPost = async (payload: BlogPostCreatePayload): Promise<BlogPost> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogPost>(PRIVATE_POSTS_ENDPOINT, {
      method: 'POST',
      body: payload,
      headers,
    })
  }

  return {
    isAuthenticated,
    fetchPosts,
    fetchPublicBlogs,
    fetchUserBlogs,
    fetchComments,
    createComment,
    replyToComment,
    likePost,
    dislikePost,
    likeComment,
    dislikeComment,
    updatePost,
    deletePost,
    createBlog,
    createPost,
  }
}
