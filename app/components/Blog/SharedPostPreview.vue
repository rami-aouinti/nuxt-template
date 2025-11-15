<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPost, BlogPostViewModel } from '~/types/blog'
import AppCard from '~/components/ui/AppCard.vue'
import AppAvatar from '~/components/AppAvatar.vue'
import { useBlogAuthor } from '~/composables/useBlogAuthor'

defineOptions({ name: 'BlogSharedPostPreview' })

const props = defineProps<{
  post: BlogPost | BlogPostViewModel
  formatRelativePublishedAt: (value: string) => string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { getAuthorName, getAuthorProfileLink, getAuthorAvatar } = useBlogAuthor()

const authorName = computed(() => getAuthorName(props.post.user))
const authorLink = computed(() => getAuthorProfileLink(props.post.user))
const authorAvatar = computed(() => getAuthorAvatar(props.post.user))
const publishedAtLabel = computed(() =>
  props.formatRelativePublishedAt(props.post.publishedAt),
)
const postLink = computed(() => localePath(`/post/${props.post.slug}`))

const excerpt = computed(() => {
  const summary = props.post.summary?.trim()
  if (summary) {
    return summary
  }

  const content = props.post.content?.trim()
  if (content) {
    const maxLength = 160
    return content.length > maxLength
      ? `${content.slice(0, maxLength - 1)}…`
      : content
  }

  return t('blog.placeholders.noSummary')
})
</script>

<template>
  <AppCard variant="text" class="shared-post-preview">
    <div class="shared-post-preview__header">
      <div class="shared-post-preview__avatar">
        <NuxtLink
          v-if="authorLink"
          :to="authorLink"
          class="shared-post-preview__avatar-link text-decoration-none"
          :aria-label="authorName"
        >
          <AppAvatar :src="authorAvatar" :alt="authorName" size="36" />
        </NuxtLink>
        <AppAvatar
          v-else
          :src="authorAvatar"
          :alt="authorName"
          size="36"
          class="shared-post-preview__avatar-fallback"
        />
      </div>
      <div class="shared-post-preview__header-info">
        <NuxtLink
          v-if="authorLink"
          :to="authorLink"
          class="shared-post-preview__author text-decoration-none"
          :aria-label="authorName"
        >
          {{ authorName }}
        </NuxtLink>
        <span v-else class="shared-post-preview__author">{{ authorName }}</span>
        <div class="shared-post-preview__meta">
          {{ publishedAtLabel }}
        </div>
      </div>
    </div>
    <NuxtLink :to="postLink" class="shared-post-preview__title text-decoration-none">
      {{ post.title }}
    </NuxtLink>
    <p class="shared-post-preview__excerpt">
      {{ excerpt }}
    </p>
  </AppCard>
</template>

<style scoped>
.shared-post-preview {
  background-color: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shared-post-preview__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shared-post-preview__avatar-link,
.shared-post-preview__avatar-fallback {
  display: inline-flex;
}

.shared-post-preview__header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shared-post-preview__author {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.shared-post-preview__author:hover,
.shared-post-preview__author:focus-visible {
  text-decoration: underline;
}

.shared-post-preview__meta {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.shared-post-preview__title {
  font-weight: 600;
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.shared-post-preview__title:hover,
.shared-post-preview__title:focus-visible {
  text-decoration: underline;
}

.shared-post-preview__excerpt {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.78);
  font-size: 0.95rem;
  line-height: 1.4;
}
</style>
