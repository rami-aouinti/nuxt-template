<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPostUser } from '~/types/blog'
import { useBlogAuthor } from '~/composables/useBlogAuthor'

const props = withDefaults(
  defineProps<{
    user: BlogPostUser
    publishedAt: string
    formatDate?: (value: string) => string
    tag?: string | object
  }>(),
  {
    formatDate: undefined,
    tag: 'div',
  },
)

const { t, locale } = useI18n()
const { getAuthorName, getAuthorProfileLink } = useBlogAuthor()

const formattedDate = computed(() => {
  if (props.formatDate) {
    return props.formatDate(props.publishedAt)
  }

  const formatter = new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short',
  })
  return formatter.format(new Date(props.publishedAt))
})

const AUTHOR_PLACEHOLDER = '__AUTHOR__'

const metaParts = computed(() => {
  const template = t('blog.meta.author', {
    author: AUTHOR_PLACEHOLDER,
    date: formattedDate.value,
  })

  const [prefix = '', suffix = ''] = template.split(AUTHOR_PLACEHOLDER)
  return {
    prefix,
    suffix,
  }
})

const authorName = computed(() => getAuthorName(props.user))
const authorLink = computed(() => getAuthorProfileLink(props.user))
</script>

<template>
  <component :is="tag" class="blog-post-meta d-flex flex-wrap align-center">
    <span>{{ metaParts.prefix }}</span>
    <NuxtLink
      v-if="authorLink"
      :to="authorLink"
      class="blog-post-meta__author-link mx-1"
    >
      {{ authorName }}
    </NuxtLink>
    <span v-else class="mx-1">{{ authorName }}</span>
    <span>{{ metaParts.suffix }}</span>
  </component>
</template>

<style scoped>
.blog-post-meta__author-link {
  color: inherit;
  text-decoration: none;
}

.blog-post-meta__author-link:hover,
.blog-post-meta__author-link:focus-visible {
  text-decoration: underline;
}
</style>
