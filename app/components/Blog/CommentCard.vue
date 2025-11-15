<script setup lang="ts">
import { computed } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogReactionType,
} from '~/types/blog'
import { resolveReactionType } from '~/utils/reactions'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'

const props = defineProps<{
  comment: BlogCommentViewModel
  formatAuthor: (user: BlogPostUser) => string
  formatDate: (value: string) => string
  formatRelativeDate?: (value: string) => string
  canInteract: boolean
  resolveProfileLink?: (user: BlogPostUser) => string | null | undefined
  replyCount?: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'select-reaction': [BlogReactionType]
  'remove-reaction': []
  'toggle-reply': []
}>()

const { t } = useI18n()

const formattedRelativeDate = computed(
  () =>
    props.formatRelativeDate?.(props.comment.publishedAt) ??
    props.formatDate(props.comment.publishedAt),
)

const resolvedProfileLink = computed(() => {
  const link = props.resolveProfileLink?.(props.comment.user)
  if (typeof link === 'string' && link.trim().length) {
    return link
  }
  return undefined
})

const reactionType = computed<BlogReactionType | null>(() =>
  resolveReactionType(props.comment.isReacted ?? null),
)

const reactionCount = computed(
  () => props.comment.reactions_count ?? props.comment.likes_count ?? 0,
)

const avatarAlt = computed(() => props.formatAuthor(props.comment.user))

const hasReplyCount = computed(() => (props.replyCount ?? 0) > 0)

const interactionsDisabled = computed(
  () => !props.canInteract || props.disabled === true,
)

const onToggleReply = () => emit('toggle-reply')
</script>

<template>
  <div class="blog-comment-card">
    <AppCard variant="outlined" elevation="0" class="blog-comment-card__card">
      <div class="blog-comment-card__layout">
        <NuxtLink
          v-if="resolvedProfileLink"
          :to="resolvedProfileLink"
          class="blog-comment-card__avatar-link"
        >
          <AppAvatar
            :src="comment.user.photo || undefined"
            :alt="avatarAlt"
            size="36"
          />
        </NuxtLink>
        <AppAvatar
          v-else
          :src="comment.user.photo || undefined"
          :alt="avatarAlt"
          size="36"
        />
        <div class="blog-comment-card__body">
          <div class="blog-comment-card__meta">
            <div class="blog-comment-card__meta-info">
              <p class="blog-comment-card__author">
                <NuxtLink
                  v-if="resolvedProfileLink"
                  :to="resolvedProfileLink"
                  class="blog-comment-card__author-link"
                >
                  {{ formatAuthor(comment.user) }}
                </NuxtLink>
                <span v-else>{{ formatAuthor(comment.user) }}</span>
              </p>
              <p
                class="blog-comment-card__date"
                :title="formatDate(comment.publishedAt)"
              >
                {{ formattedRelativeDate }}
              </p>
            </div>
            <div
              v-if="$slots['meta-actions']"
              class="blog-comment-card__meta-actions"
            >
              <slot name="meta-actions" />
            </div>
          </div>
          <div class="blog-comment-card__content">
            <slot>
              {{ comment.content }}
            </slot>
          </div>
          <div class="blog-comment-card__actions">
            <BlogReactionPicker
              size="small"
              density="comfortable"
              :model-value="reactionType"
              :count="reactionCount"
              :loading="comment.ui.likeLoading"
              :disabled="interactionsDisabled"
              :show-caret="!interactionsDisabled"
              @select="(type) => emit('select-reaction', type)"
              @remove="emit('remove-reaction')"
            />
            <AppButton
              v-if="canInteract"
              variant="text"
              size="small"
              :disabled="comment.ui.replyLoading || disabled"
              prepend-icon="mdi-message"
              @click="onToggleReply"
            >
              <span v-if="hasReplyCount">{{ replyCount }}</span>
              <span v-else>{{ t('blog.actions.reply') }}</span>
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
    <slot name="reply" />
    <slot name="children" />
  </div>
</template>

<style scoped>
.blog-comment-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 6px 0;
}

.blog-comment-card__card {
  padding: 16px;
}

.blog-comment-card__layout {
  display: flex;
  gap: 12px;
}

.blog-comment-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.blog-comment-card__meta {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.blog-comment-card__meta-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.blog-comment-card__author {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

.blog-comment-card__author-link {
  color: inherit;
  text-decoration: none;
}

.blog-comment-card__author-link:hover,
.blog-comment-card__author-link:focus-visible {
  text-decoration: underline;
}

.blog-comment-card__date {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.blog-comment-card__content {
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.blog-comment-card__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blog-comment-card__avatar-link {
  display: inline-flex;
}

.blog-comment-card__meta-actions {
  margin-left: auto;
  display: flex;
  align-items: flex-start;
}
</style>
