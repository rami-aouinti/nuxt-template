import { computed } from 'vue'
import type {
  BlogComment,
  BlogCommentListResponse,
  BlogCommentPayload,
  BlogCreatePayload,
  BlogPost,
  BlogPostCreatePayload,
  BlogPostListResponse,
  BlogPostSharePayload,
  BlogPostUpdatePayload,
  BlogReactionType,
  BlogSummary,
  BlogSummaryListResponse,
  BlogUpdatePayload,
} from '~/types/blog'

const PUBLIC_POSTS_ENDPOINT = 'https://blog.bro-world.org/public/post'
const PRIVATE_POSTS_ENDPOINT = 'https://blog.bro-world.org/v1/platform/post'
const PRIVATE_POSTS_REACTS_ENDPOINT =
  'https://blog.bro-world.org/v1/private/post'
const PRIVATE_COMMENTS_ENDPOINT =
  'https://blog.bro-world.org/v1/platform/comment'
const PRIVATE_COMMENT_REACTIONS_ENDPOINT =
  'https://blog.bro-world.org/v1/private/comment'
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
  const { loggedIn, session } = useAppUserSession()

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

  const isBlogPost = (value: unknown): value is BlogPost =>
    Boolean(
      value &&
        typeof value === 'object' &&
        'id' in value &&
        'title' in value &&
        'slug' in value &&
        'publishedAt' in value,
    )

  const extractBlogPost = (value: unknown): BlogPost | null => {
    if (isBlogPost(value)) {
      return value
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (isBlogPost(item)) {
          return item
        }
      }
      return null
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>

      if ('post' in record && isBlogPost(record.post)) {
        return record.post
      }

      if ('data' in record && Array.isArray(record.data)) {
        for (const item of record.data) {
          if (isBlogPost(item)) {
            return item
          }
        }
      }

      if ('blog' in record) {
        return extractBlogPost(record.blog)
      }
    }

    return null
  }

  const extractBlogPosts = (value: unknown): BlogPost[] => {
    if (!value) {
      return []
    }

    if (isBlogPost(value)) {
      return [value]
    }

    if (Array.isArray(value)) {
      return value.filter((item): item is BlogPost => isBlogPost(item))
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>
      const potentialKeys = ['posts', 'data', 'items', 'results']

      for (const key of potentialKeys) {
        if (key in record) {
          const nested = extractBlogPosts(record[key])
          if (nested.length || Array.isArray(record[key])) {
            return nested
          }
        }
      }

      if ('blog' in record) {
        return extractBlogPosts(record.blog)
      }
    }

    return []
  }

  const resolveNumeric = (value: unknown, fallback: number) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string') {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }

    return fallback
  }

  const toBlogPostListResponse = (
    value: unknown,
    page: number,
    limit: number,
  ): BlogPostListResponse | null => {
    if (value == null) {
      return null
    }

    const data = extractBlogPosts(value)
    const record =
      value && typeof value === 'object'
        ? (value as Record<string, unknown>)
        : {}

    const resolvedPage = resolveNumeric(record.page, page)
    const resolvedLimit = resolveNumeric(record.limit, limit)
    const resolvedCount = resolveNumeric(record.count, data.length)

    if (
      !data.length &&
      !('count' in record || 'data' in record || 'posts' in record)
    ) {
      return null
    }

    return {
      data,
      page: resolvedPage,
      limit: resolvedLimit,
      count: resolvedCount,
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

  const fetchPostBySlug = async (slug: string): Promise<BlogPost> => {
    const normalizedSlug = slug?.toString().trim()
    if (!normalizedSlug) {
      throw new Error('INVALID_POST_SLUG')
    }

    const headers = getAuthHeaders(false)
    const encodedSlug = encodeURIComponent(normalizedSlug)
    const attempts: Array<{ url: string; options?: Record<string, unknown> }> =
      []

    if (headers) {
      attempts.push({
        url: `${PRIVATE_POSTS_ENDPOINT}/${encodedSlug}`,
        options: { headers },
      })
      attempts.push({
        url: `${PRIVATE_POSTS_ENDPOINT}/slug/${encodedSlug}`,
        options: { headers },
      })
    }

    attempts.push({ url: `${PUBLIC_POSTS_ENDPOINT}/${encodedSlug}` })
    attempts.push({ url: `${PUBLIC_POSTS_ENDPOINT}/slug/${encodedSlug}` })

    let lastError: unknown = null

    for (const attempt of attempts) {
      try {
        const response = await $fetch<unknown>(attempt.url, attempt.options)
        const post = extractBlogPost(response)
        if (post) {
          return post
        }
      } catch (error) {
        lastError = error
      }
    }

    const paramAttempts: Array<{
      url: string
      options: Record<string, unknown>
    }> = []

    if (headers) {
      paramAttempts.push({
        url: PRIVATE_POSTS_ENDPOINT,
        options: { params: { slug: normalizedSlug, limit: 1 }, headers },
      })
    }

    paramAttempts.push({
      url: PUBLIC_POSTS_ENDPOINT,
      options: { params: { slug: normalizedSlug, limit: 1 } },
    })

    for (const attempt of paramAttempts) {
      try {
        const response = await $fetch<unknown>(attempt.url, attempt.options)
        const post = extractBlogPost(response)
        if (post) {
          return post
        }
      } catch (error) {
        lastError = error
      }
    }

    throw lastError ?? new Error('POST_NOT_FOUND')
  }

  const fetchBlogPostsBySlug = async (
    slug: string,
    page: number,
    limit: number,
  ): Promise<BlogPostListResponse> => {
    const normalizedSlug = slug?.toString().trim()
    if (!normalizedSlug) {
      throw new Error('INVALID_BLOG_SLUG')
    }

    const headers = getAuthHeaders(false)
    const encodedSlug = encodeURIComponent(normalizedSlug)
    const attempts: Array<{ url: string; options?: Record<string, unknown> }> =
      []

    if (headers) {
      attempts.push({
        url: `${PRIVATE_BLOGS_ENDPOINT}/${encodedSlug}/post`,
        options: { params: { page, limit }, headers },
      })
      attempts.push({
        url: `${PRIVATE_BLOGS_ENDPOINT}/${encodedSlug}`,
        options: { headers },
      })
    }

    attempts.push({
      url: `${PUBLIC_BLOGS_ENDPOINT}/${encodedSlug}/post`,
      options: { params: { page, limit } },
    })
    attempts.push({ url: `${PUBLIC_BLOGS_ENDPOINT}/${encodedSlug}` })

    let lastError: unknown = null

    for (const attempt of attempts) {
      try {
        const response = await $fetch<unknown>(attempt.url, attempt.options)
        const normalized = toBlogPostListResponse(response, page, limit)
        if (normalized) {
          return normalized
        }
      } catch (error) {
        lastError = error
      }
    }

    try {
      const aggregated: BlogPost[] = []
      let pageNumber = 1
      const fetchSize = Math.max(limit, BLOG_POSTS_DEFAULT_LIMIT)
      const maxIterations = 15
      let hasMore = true

      while (hasMore && pageNumber <= maxIterations) {
        const response = await fetchPosts(pageNumber, fetchSize)
        const filtered = response.data.filter((post) => {
          const summary = post.blog as BlogSummary | null | undefined
          const postSlug =
            typeof summary?.slug === 'string' ? summary.slug.trim() : ''
          return postSlug === normalizedSlug
        })
        aggregated.push(...filtered)

        hasMore =
          pageNumber * response.limit < response.count &&
          response.data.length > 0

        if (aggregated.length >= page * limit) {
          break
        }

        pageNumber += 1
      }

      const start = (page - 1) * limit
      const data = aggregated.slice(start, start + limit)

      return {
        data,
        page,
        limit,
        count: aggregated.length,
      }
    } catch (error) {
      lastError = error
    }

    throw lastError ?? new Error('BLOG_POSTS_NOT_FOUND')
  }

  const fetchProfilePosts = async (
    page: number,
    limit: number,
  ): Promise<BlogPostListResponse> => {
    if (!isAuthenticated.value) {
      throw new AuthenticationRequiredError()
    }

    return await $fetch<BlogPostListResponse>('/api/profile/posts', {
      params: { page, limit },
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

    const response = await $fetch<
      BlogCommentListResponse | BlogComment[] | null
    >(`${PRIVATE_POSTS_ENDPOINT}/${postId}/comments`, {
      params: { page, limit },
      headers,
    })

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

  const updateComment = async (
    commentId: string,
    payload: BlogCommentPayload,
  ): Promise<BlogComment> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogComment>(
      `${PRIVATE_COMMENTS_ENDPOINT}/${commentId}`,
      {
        method: 'PATCH',
        body: payload,
        headers,
      },
    )
  }

  const deleteComment = async (commentId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_COMMENTS_ENDPOINT}/${commentId}`, {
      method: 'DELETE',
      headers,
    })
  }

  const normalizeReactionType = (type: BlogReactionType) =>
    typeof type === 'string' && type.trim().length
      ? type.trim().toLowerCase()
      : 'like'

  const reactToPost = async (postId: string, type: BlogReactionType) => {
    const headers = getAuthHeaders(true)
    const normalized = normalizeReactionType(type)

    await $fetch(
      `${PRIVATE_POSTS_REACTS_ENDPOINT}/${postId}/react/${normalized}`,
      {
        method: 'POST',
        headers,
      },
    )
  }

  const removePostReaction = async (postId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_POSTS_REACTS_ENDPOINT}/${postId}/react/delete`, {
      method: 'POST',
      headers,
    })
  }

  const reactToComment = async (commentId: string, type: BlogReactionType) => {
    const headers = getAuthHeaders(true)
    const normalized = normalizeReactionType(type)

    await $fetch(
      `${PRIVATE_COMMENT_REACTIONS_ENDPOINT}/${commentId}/react/${normalized}`,
      {
        method: 'POST',
        headers,
      },
    )
  }

  const removeCommentReaction = async (commentId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(
      `${PRIVATE_COMMENT_REACTIONS_ENDPOINT}/${commentId}/react/delete`,
      {
        method: 'POST',
        headers,
      },
    )
  }

  const updatePost = async (
    postId: string,
    payload: BlogPostUpdatePayload | FormData,
  ): Promise<BlogPost> => {
    const headers = getAuthHeaders(true)

    const body =
      payload instanceof FormData
        ? payload
        : Object.entries(payload).reduce((formData, [key, value]) => {
            if (value === undefined || value === null) {
              return formData
            }

            if (Array.isArray(value)) {
              value.forEach((entry) => {
                if (entry === undefined || entry === null) {
                  return
                }

                formData.append(`${key}[]`, String(entry))
              })
              return formData
            }

            formData.append(key, String(value))
            return formData
          }, new FormData())

    return await $fetch(`${PRIVATE_POSTS_ENDPOINT}/${postId}`, {
      method: 'POST',
      body: body as any,
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

  const createBlog = async (
    payload: BlogCreatePayload | FormData,
  ): Promise<BlogSummary> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogSummary>(PRIVATE_BLOGS_ENDPOINT, {
      method: 'POST',
      body: payload as any,
      headers,
    })
  }

  const updateBlog = async (
    blogId: string,
    payload: BlogUpdatePayload,
  ): Promise<BlogSummary | null> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogSummary | null>(
      `${PRIVATE_BLOGS_ENDPOINT}/${blogId}`,
      {
        method: 'PATCH',
        body: payload,
        headers,
      },
    )
  }

  const deleteBlog = async (blogId: string) => {
    const headers = getAuthHeaders(true)

    await $fetch(`${PRIVATE_BLOGS_ENDPOINT}/${blogId}`, {
      method: 'DELETE',
      headers,
    })
  }

  const createPost = async (
    payload: BlogPostCreatePayload | FormData,
  ): Promise<BlogPost> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogPost>(PRIVATE_POSTS_ENDPOINT, {
      method: 'POST',
      body: payload as any,
      headers,
    })
  }

  const sharePost = async (
    postId: string | number,
    payload: BlogPostSharePayload = {},
  ): Promise<BlogPost> => {
    const headers = getAuthHeaders(true)

    return await $fetch<BlogPost>(
      `${PRIVATE_POSTS_ENDPOINT}/${postId}/shared`,
      {
        method: 'POST',
        body: payload,
        headers,
      },
    )
  }

  return {
    isAuthenticated,
    fetchPosts,
    fetchPostBySlug,
    fetchBlogPostsBySlug,
    fetchProfilePosts,
    fetchPublicBlogs,
    fetchUserBlogs,
    fetchComments,
    createComment,
    replyToComment,
    updateComment,
    deleteComment,
    reactToPost,
    removePostReaction,
    reactToComment,
    removeCommentReaction,
    updatePost,
    deletePost,
    createBlog,
    updateBlog,
    deleteBlog,
    createPost,
    sharePost,
  }
}
