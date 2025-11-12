<script setup lang="ts">
import { computed } from 'vue'
import type { BlogSummary } from '~/types/blog'

const props = defineProps<{
  loggedIn: boolean
  blogs: BlogSummary[]
  loading: boolean
  error: string | null
}>()

const { t } = useI18n()

const hasBlogs = computed(() => props.blogs.length > 0)

function getBlogInitials(title: string | null | undefined): string {
  if (!title) {
    return '??'
  }

  const trimmed = title.trim()
  if (!trimmed) {
    return '??'
  }

  const alphanumericChars = Array.from(trimmed).filter((char) =>
    /\p{Letter}|\p{Number}/u.test(char),
  )
  const fallbackChars = alphanumericChars.length
    ? alphanumericChars
    : Array.from(trimmed).filter((char) => char.trim().length > 0)

  if (!fallbackChars.length) {
    return '??'
  }

  const initials = fallbackChars.slice(0, 2)
  if (initials.length === 1) {
    initials.push(initials[0])
  }

  return initials.join('').toUpperCase()
}
</script>

<template>
  <v-alert
    v-if="!loggedIn"
    type="info"
    variant="tonal"
    density="comfortable"
    class="mb-4"
  >
    {{ t('blog.sidebar.loginToManage') }}
  </v-alert>

  <template v-else>
    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line@3"
      class="rounded mb-4"
    />

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <template v-else-if="hasBlogs">
      <div
        v-for="blog in blogs"
        :key="blog.id"
        class="stat-card d-flex align-center gap-3 mb-3 w-100 px-3"
      >
        <NuxtLink
          class="text-decoration-none text-primary d-flex align-center gap-3"
          :to="`/blog/${blog.id}`"
        >
          <AppAvatar
            :src="blog.logo || undefined"
            :alt="blog.title"
            size="36"
            color="primary"
            variant="tonal"
          >
            <template #fallback>
              <span class="blog-avatar__initials">
                {{ getBlogInitials(blog.title) }}
              </span>
            </template>
          </AppAvatar>
          <span>{{ blog.title }}</span>
        </NuxtLink>
      </div>
    </template>

    <p v-else class="text-body-2 text-medium-emphasis mb-0">
      {{ t('blog.sidebar.myBlogsEmpty') }}
    </p>
  </template>
</template>

<style scoped>
.blog-avatar__initials {
  font-weight: 600;
  letter-spacing: 0.08em;
}
</style>
