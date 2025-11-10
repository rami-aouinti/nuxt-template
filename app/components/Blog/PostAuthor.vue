<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPostUser } from '~/types/blog'
import { useBlogAuthor } from '~/composables/useBlogAuthor'

const props = withDefaults(
  defineProps<{
    user: BlogPostUser
    publishedAt?: string
    formatDate?: (value: string) => string
    avatarSize?: number
    showAvatar?: boolean
    tag?: string | object
  }>(),
  {
    publishedAt: undefined,
    formatDate: undefined,
    avatarSize: 48,
    showAvatar: true,
    tag: 'div',
  },
)

const { getAuthorName, getAuthorProfileLink, getAuthorAvatar } = useBlogAuthor()

const authorName = computed(() => getAuthorName(props.user))
const authorLink = computed(() => getAuthorProfileLink(props.user))
const authorAvatar = computed(() => getAuthorAvatar(props.user))
</script>

<template>
  <component :is="tag" class="blog-post-author d-flex align-center">
    <component
      :is="authorLink ? 'NuxtLink' : 'div'"
      v-if="showAvatar"
      :to="authorLink || undefined"
      class="blog-post-author__avatar-link"
    >
      <AppAvatar :src="authorAvatar" :alt="authorName" :size="avatarSize" />
    </component>
    <div class="blog-post-author__details" :class="{ 'ml-3': showAvatar }">
      <div class="blog-post-author__name text-subtitle-2 font-weight-medium">
        <NuxtLink
          v-if="authorLink"
          :to="authorLink"
          class="blog-post-author__name-link"
        >
          {{ authorName }}
        </NuxtLink>
        <span v-else class="blog-post-author__name-link">{{ authorName }}</span>
      </div>
      <BlogPostMeta
        v-if="publishedAt"
        class="blog-post-author__meta"
        :user="user"
        :published-at="publishedAt"
        :format-date="formatDate"
      />
      <slot />
    </div>
  </component>
</template>

<style scoped>
.blog-post-author__avatar-link {
  display: inline-flex;
}

.blog-post-author__name-link {
  color: inherit;
  text-decoration: none;
}

.blog-post-author__name-link:hover,
.blog-post-author__name-link:focus-visible {
  text-decoration: underline;
}

.blog-post-author__meta {
  margin-top: 2px;
  font-size: 0.875rem;
}
</style>
