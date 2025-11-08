import { defineStore } from 'pinia'
import { ref } from 'vue'

import { BLOG_POSTS_DEFAULT_LIMIT } from '~/composables/useBlogApi'
import type { BlogPost, BlogPostListResponse } from '~/types/blog'

interface PaginationState {
  page: number
  limit: number
  total: number
}

export const useProfilePostsStore = defineStore('profilePosts', () => {
  const posts = ref<BlogPost[]>([])
  const pagination = ref<PaginationState>({
    page: 1,
    limit: BLOG_POSTS_DEFAULT_LIMIT,
    total: 0,
  })
  const isInitialLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)

  const setPosts = (data: BlogPost[], { replace }: { replace: boolean }) => {
    if (replace) {
      posts.value = data
      return
    }

    const existingIds = new Set(posts.value.map((post) => post.id))
    const merged = data.filter((post) => !existingIds.has(post.id))
    posts.value = [...posts.value, ...merged]
  }

  const setPagination = ({ page, limit, total }: PaginationState) => {
    pagination.value = { page, limit, total }
  }

  const applyResponse = (
    response: BlogPostListResponse,
    { replace }: { replace: boolean },
  ) => {
    const data = Array.isArray(response.data) ? response.data : []
    setPosts(data, { replace })
    setPagination({
      page: response.page,
      limit: response.limit,
      total: response.count,
    })
  }

  const reset = () => {
    posts.value = []
    pagination.value = {
      page: 1,
      limit: BLOG_POSTS_DEFAULT_LIMIT,
      total: 0,
    }
    error.value = null
  }

  return {
    posts,
    pagination,
    isInitialLoading,
    isLoadingMore,
    error,
    setPosts,
    setPagination,
    applyResponse,
    reset,
  }
})
