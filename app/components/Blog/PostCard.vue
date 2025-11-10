<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostViewModel,
  BlogReactionType,
} from '~/types/blog'
import { resolveReactionType } from '~/utils/reactions'
import { useBlogAuthor } from '~/composables/useBlogAuthor'

defineOptions({ name: 'BlogPostCard' })

const props = defineProps<{
  post: BlogPostViewModel
  loggedIn: boolean
  canEdit: boolean
  excerpt: string
  formatRelativePublishedAt: (value: string) => string
  formatPublishedAt: (value: string) => string
}>()

const emit = defineEmits<{
  'request-edit': [BlogPostViewModel]
  'submit-edit': [BlogPostViewModel]
  delete: [BlogPostViewModel]
  'select-reaction': [{ post: BlogPostViewModel; type: BlogReactionType }]
  'remove-reaction': [BlogPostViewModel]
  'show-reactions': [BlogPostViewModel]
  'toggle-comments': [BlogPostViewModel]
  share: [BlogPostViewModel]
  'submit-comment': [BlogPostViewModel]
  'select-comment-reaction': [
    {
      post: BlogPostViewModel
      comment: BlogCommentViewModel
      type: BlogReactionType
    },
  ]
  'remove-comment-reaction': [
    { post: BlogPostViewModel; comment: BlogCommentViewModel },
  ]
  'submit-comment-reply': [
    { post: BlogPostViewModel; comment: BlogCommentViewModel },
  ]
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { getAuthorName, getAuthorProfileLink, getAuthorAvatar } = useBlogAuthor()

const postLink = computed(() => localePath(`/post/${props.post.slug}`))
const authorName = computed(() => getAuthorName(props.post.user))
const authorLink = computed(() => getAuthorProfileLink(props.post.user))
const authorAvatar = computed(() => getAuthorAvatar(props.post.user))
const excerptState = computed(() => {
  const trimmedExcerpt = props.excerpt.trim()

  if (trimmedExcerpt.length > 0) {
    return {
      text: trimmedExcerpt,
      isMuted: false,
    }
  }

  return {
    text: t('blog.placeholders.noSummary'),
    isMuted: true,
  }
})
const reactionType = computed(() =>
  resolveReactionType(props.post.isReacted ?? null),
)
const reactionCount = computed(() => props.post.reactions_count ?? 0)
const commentCount = computed(() => props.post.totalComments ?? 0)
const shareCount = computed(() => props.post.sharedFrom?.length ?? 0)

const commentsToggleLabel = computed(() => {
  const baseKey = props.post.ui?.commentsVisible
    ? 'blog.actions.hideComments'
    : 'blog.actions.showComments'
  const base = t(baseKey)
  if (commentCount.value <= 0) {
    return base
  }

  return `${base} (${t('blog.stats.comments', { count: commentCount.value })})`
})

const reactionsButtonLabel = computed(() => {
  const base = t('blog.actions.viewReactions')
  if (reactionCount.value <= 0) {
    return base
  }

  return `${base} (${t('blog.stats.reactions', { count: reactionCount.value })})`
})

const shareButtonLabel = computed(() => {
  const base = t('blog.actions.sharePost')
  if (shareCount.value <= 0) {
    return base
  }

  return `${base} (${t('blog.stats.shares', { count: shareCount.value })})`
})

const isMenuOpen = ref(false)
const isDeleteLoading = computed(() => props.post.ui?.deleteLoading ?? false)

const onSelectReaction = (type: BlogReactionType) =>
  emit('select-reaction', { post: props.post, type })
const onRemoveReaction = () => emit('remove-reaction', props.post)
const onSubmitComment = () => emit('submit-comment', props.post)
const onSelectCommentReaction = (payload: {
  comment: BlogCommentViewModel
  type: BlogReactionType
}) => emit('select-comment-reaction', { post: props.post, ...payload })
const onRemoveCommentReaction = (comment: BlogCommentViewModel) =>
  emit('remove-comment-reaction', { post: props.post, comment })
const onSubmitCommentReply = (comment: BlogCommentViewModel) =>
  emit('submit-comment-reply', { post: props.post, comment })
const onRequestEdit = () => {
  emit('request-edit', props.post)
  isMenuOpen.value = false
}
const onDeletePost = () => {
  emit('delete', props.post)
  isMenuOpen.value = false
}
</script>

<template>
<v-card class="facebook-post-card" elevation="0" rounded="xl">
    <div class="facebook-post-card__header">
      <div class="facebook-post-card__avatar">
        <NuxtLink
          v-if="authorLink"
          :to="authorLink"
          class="facebook-post-card__avatar-link text-decoration-none"
          :aria-label="authorName"
        >
          <AppAvatar :src="authorAvatar" :alt="authorName" size="48" />
        </NuxtLink>
        <AppAvatar v-else :src="authorAvatar" :alt="authorName" size="48" />
      </div>
      <div class="facebook-post-card__header-info">
        <div class="facebook-post-card__author">
          <NuxtLink
            v-if="authorLink"
            :to="authorLink"
            class="facebook-post-card__author-link text-decoration-none"
            :aria-label="authorName"
          >
            {{ authorName }}
          </NuxtLink>
          <span v-else class="facebook-post-card__author-link">
            {{ authorName }}
          </span>
        </div>
        <div class="facebook-post-card__meta">
          <span>{{ formatRelativePublishedAt(post.publishedAt) }}</span>
          <span class="facebook-post-card__meta-separator">·</span>
          <v-icon
            icon="mdi-earth"
            size="14"
            class="facebook-post-card__meta-icon"
            aria-hidden="true"
          />
        </div>
      </div>
      <v-menu
        v-if="canEdit"
        v-model="isMenuOpen"
        location="bottom end"
        offset="8"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            icon
            variant="text"
            size="sm"
            class="facebook-post-card__menu-btn"
            v-bind="activatorProps"
            :disabled="activatorProps.disabled || isDeleteLoading"
            :loading="isDeleteLoading"
          >
            <v-icon size="sm" icon="mdi-dots-vertical" />
          </v-btn>
        </template>

        <v-list density="compact" nav>
          <v-list-item @click="onRequestEdit">
            <template #prepend>
              <v-icon size="sm" icon="mdi-pencil" />
            </template>
            <v-list-item-title>{{
              t('common.actions.edit')
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item :disabled="isDeleteLoading" @click="onDeletePost">
            <template #prepend>
              <v-icon
                v-if="!isDeleteLoading"
                size="sm"
                icon="mdi-trash-can-outline"
              />
              <v-progress-circular v-else indeterminate size="16" width="2" />
            </template>
            <v-list-item-title>
              {{ t('common.actions.delete') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="facebook-post-card__body">
      <NuxtLink
        :to="postLink"
        class="facebook-post-card__title text-decoration-none"
      >
        {{ post.title }}
      </NuxtLink>
      <p
        class="facebook-post-card__text"
        :class="{ 'facebook-post-card__text--muted': excerptState.isMuted }"
      >
        {{ excerptState.text }}
      </p>
    </div>

    <div class="facebook-post-card__stats">
      <div class="facebook-post-card__stats-left">
        <div class="facebook-post-card__reaction-icons">
          <span
            class="facebook-post-card__reaction-icon facebook-post-card__reaction-icon--like"
          >
            <v-icon icon="mdi-thumb-up" size="14" />
          </span>
          <span
            class="facebook-post-card__reaction-icon facebook-post-card__reaction-icon--love"
          >
            <v-icon icon="mdi-heart" size="14" />
          </span>
          <span
            class="facebook-post-card__reaction-icon facebook-post-card__reaction-icon--care"
          >
            <v-icon icon="mdi-emoticon-excited" size="14" />
          </span>
        </div>
        <div
          class="facebook-post-card__stat-value facebook-post-card__stat-value--reactions"
        >
          <BlogReactionPicker
            class="facebook-post-card__reaction-picker"
            size="small"
            density="comfortable"
            :model-value="reactionType"
            :count="reactionCount"
            :loading="post.ui.likeLoading"
            :disabled="!loggedIn"
            :show-caret="loggedIn"
            :show-count="false"
            @select="onSelectReaction"
            @remove="onRemoveReaction"
          />
          <v-btn
            variant="text"
            class="facebook-post-card__action-btn facebook-post-card__count-btn"
            :aria-label="reactionsButtonLabel"
            @click="emit('show-reactions', post)"
          >
            {{ reactionCount }}
          </v-btn>
        </div>
      </div>
      <div class="facebook-post-card__stats-right">
        <v-btn
          variant="text"
          class="facebook-post-card__action-btn"
          :loading="post.ui.commentsLoading"
          :aria-label="commentsToggleLabel"
          @click="emit('toggle-comments', post)"
        >
          <v-icon
            :icon="
              post.ui.commentsVisible
                ? 'mdi-comment-off-outline'
                : 'mdi-comment-text-outline'
            "
            class="mr-1"
          />
          {{ commentCount }}
        </v-btn>
        <v-btn
          variant="text"
          class="facebook-post-card__action-btn"
          :aria-label="shareButtonLabel"
          @click="emit('share', post)"
        >
          <v-icon icon="mdi-share" class="mr-1" />
          {{ shareCount }}
        </v-btn>
      </div>
    </div>

    <v-expand-transition>
      <div
        v-if="post.ui.commentsVisible"
        class="facebook-post-card__comments-section"
      >
        <BlogPostComments
          :post="post"
          :logged-in="loggedIn"
          :format-date="formatPublishedAt"
          @submit-comment="onSubmitComment"
          @select-reaction="onSelectCommentReaction"
          @remove-reaction="onRemoveCommentReaction"
          @submit-reply="onSubmitCommentReply"
        />
      </div>
    </v-expand-transition>

    <v-dialog v-model="post.ui.editDialog" max-width="640" persistent>
      <v-card>
        <v-card-title>{{ t('blog.dialogs.editTitle') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="post.ui.editForm.title"
            :label="t('blog.forms.edit.title')"
            :disabled="post.ui.editForm.loading"
            required
          />
          <v-text-field
            v-model="post.ui.editForm.summary"
            :label="t('blog.forms.edit.summary')"
            :disabled="post.ui.editForm.loading"
          />
          <v-textarea
            v-model="post.ui.editForm.content"
            :label="t('blog.forms.edit.content')"
            :disabled="post.ui.editForm.loading"
            rows="6"
            auto-grow
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="post.ui.editForm.loading"
            @click="post.ui.editDialog = false"
          >
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="post.ui.editForm.loading"
            :disabled="!post.ui.editForm.title.trim().length"
            @click="emit('submit-edit', post)"
          >
            {{ t('common.actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.facebook-post-card {
  border-radius: 30px;
  background: rgba(var(--blog-post-card-background-rgb), 0.95);
  box-shadow: var(--blog-post-card-shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  min-height: 288px;
  display: flex;
  flex-direction: column;
}

.facebook-post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--blog-post-card-hover-shadow);
}

.facebook-post-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 0;
}

.facebook-post-card__avatar {
  flex-shrink: 0;
}

.facebook-post-card__avatar-link {
  display: inline-flex;
}

.facebook-post-card__header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.facebook-post-card__author-link {
  color: inherit;
  text-decoration: none;
}

a.facebook-post-card__author-link:hover,
a.facebook-post-card__author-link:focus-visible {
  text-decoration: underline;
}

.facebook-post-card__meta {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.facebook-post-card__meta-icon {
  color: inherit;
}

.facebook-post-card__menu-btn {
  margin-left: auto;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.facebook-post-card__menu-btn:hover,
.facebook-post-card__menu-btn:focus-visible {
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.facebook-post-card__body {
  padding: 0 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.facebook-post-card__title {
  display: inline-block;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.92);
  text-decoration: none;
  font-size: 1.05rem;
  line-height: 1.4;
}

.facebook-post-card__title:hover,
.facebook-post-card__title:focus-visible {
  text-decoration: underline;
}

.facebook-post-card__text {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.87);
  line-height: 1.6;
  font-size: 1rem;
}

.facebook-post-card__text--muted {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.facebook-post-card__stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.facebook-post-card__stats-left,
.facebook-post-card__stats-right {
  display: flex;
  align-items: center;
  gap: 5px;
}

.facebook-post-card__reaction-icons {
  display: flex;
  align-items: center;
}

.facebook-post-card__reaction-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(var(--blog-surface-rgb), 1);
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.facebook-post-card__reaction-icon + .facebook-post-card__reaction-icon {
  margin-left: -8px;
}

.facebook-post-card__reaction-icon--like {
  background: #1877f2;
}

.facebook-post-card__reaction-icon--love {
  background: #f33e58;
}

.facebook-post-card__reaction-icon--care {
  background: #f7b125;
}

.facebook-post-card__stat-value {
  white-space: nowrap;
}

.facebook-post-card__stat-value--reactions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.facebook-post-card__count-btn {
  min-width: 48px;
  padding-inline: 10px;
}

.facebook-post-card__reaction-picker {
  display: inline-flex;
  align-items: center;
}

.facebook-post-card__reaction-picker--placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 72px;
  block-size: 32px;
  border-radius: 16px;
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__action) {
  padding: 2px;
  min-width: 40px;
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__count) {
  font-weight: 600;
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__label) {
  font-size: 0.85rem;
}

.facebook-post-card__reaction-picker :deep(.blog-reaction-picker__caret) {
  margin-left: 4px;
}

.facebook-post-card__action-btn {
  text-transform: none;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 999px;
}

.facebook-post-card__action-btn:hover,
.facebook-post-card__action-btn:focus-visible {
  color: rgba(var(--v-theme-on-surface), 0.9);
  background: rgba(var(--v-theme-primary), 0.08);
}

.facebook-post-card__meta-separator {
  color: rgba(var(--v-theme-on-surface), 0.45);
}

.facebook-post-card__comments-section {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgba(var(--blog-post-card-background-rgb), 0.98);
  padding-bottom: 20px;
}

@media (max-width: 960px) {
  .facebook-post-card__stats {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .facebook-post-card__stats-right {
    justify-content: flex-start;
  }
}
</style>
