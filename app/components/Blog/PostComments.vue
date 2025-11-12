<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionType,
} from '~/types/blog'
import { useBlogAuthor } from '~/composables/useBlogAuthor'

defineOptions({ name: 'BlogPostComments' })

defineProps<{
  post: BlogPostViewModel
  loggedIn: boolean
  formatDate: (value: string) => string
  formatRelativeDate?: (value: string) => string
}>()

const emit = defineEmits<{
  'submit-comment': []
  'select-reaction': [{ comment: BlogCommentViewModel; type: BlogReactionType }]
  'remove-reaction': [BlogCommentViewModel]
  'submit-reply': [BlogCommentViewModel]
}>()

const { t } = useI18n()
const { getAuthorName, getAuthorProfileLink } = useBlogAuthor()

const formatAuthor = (user: BlogPostUser) => getAuthorName(user)
const resolveProfileLink = (user: BlogPostUser) => getAuthorProfileLink(user)
</script>

<template>
  <div class="facebook-post-card__comments">
    <v-alert
      v-if="!loggedIn"
      type="info"
      variant="tonal"
      class="mb-4"
      density="comfortable"
    >
      {{ t('blog.prompts.loginToComment') }}
    </v-alert>

    <v-alert
      v-if="post.ui.commentsError"
      type="error"
      variant="tonal"
      class="mb-4"
      density="comfortable"
    >
      {{ post.ui.commentsError }}
    </v-alert>

    <div v-if="loggedIn" class="blog-comment-composer mb-4">
      <v-sheet
        class="blog-comment-composer__container"
        color="surface"
        variant="outlined"
        rounded="lg"
        border
      >
        <v-textarea
          v-model="post.ui.commentContent"
          :placeholder="t('blog.forms.commentPlaceholder')"
          auto-grow
          rows="2"
          :disabled="post.ui.commentLoading"
        />
        <div class="blog-comment-composer__actions">
          <div class="blog-comment-composer__actions-left">
            <v-btn
              icon="mdi-paperclip"
              variant="text"
              color="primary"
              density="compact"
              class="blog-comment-composer__action"
              :disabled="post.ui.commentLoading"
            />
            <v-btn
              icon="mdi-microphone-outline"
              variant="text"
              color="primary"
              density="compact"
              class="blog-comment-composer__action"
              :disabled="post.ui.commentLoading"
            />
          </div>
          <v-spacer />
          <v-btn
            class="blog-comment-composer__submit"
            color="primary"
            variant="text"
            density="compact"
            icon="mdi-send"
            :aria-label="t('blog.actions.addComment')"
            :loading="post.ui.commentLoading"
            :disabled="
              post.ui.commentLoading || !post.ui.commentContent.trim().length
            "
            @click="emit('submit-comment')"
          />
        </div>
      </v-sheet>
    </div>

    <BlogCommentThread
      v-if="post.comments.length"
      :comments="post.comments"
      :format-author="formatAuthor"
      :format-date="formatDate"
      :format-relative-date="formatRelativeDate"
      :can-interact="loggedIn"
      :resolve-profile-link="resolveProfileLink"
      @select-reaction="emit('select-reaction', $event)"
      @remove-reaction="emit('remove-reaction', $event)"
      @submit-reply="emit('submit-reply', $event)"
    />

    <v-sheet
      v-else
      class="facebook-post-card__comments-empty"
      variant="tonal"
      color="surface"
    >
      <v-icon icon="mdi-comment-outline" size="48" class="mb-3" />
      <h3 class="text-h6 mb-1">{{ t('blog.emptyComments.title') }}</h3>
      <p class="text-body-2 mb-0 text-medium-emphasis">
        {{ t('blog.emptyComments.description') }}
      </p>
    </v-sheet>
  </div>
</template>

<style scoped>
.facebook-post-card__comments {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blog-comment-composer__container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.12);
  border-radius: 18px;
}

.blog-comment-composer__textarea :deep(textarea) {
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 0;
}

.blog-comment-composer__actions {
  display: flex;
  align-items: center;
}

.blog-comment-composer__actions-left {
  display: flex;
  align-items: center;
}

.blog-comment-composer__action {
  color: rgba(var(--v-theme-on-surface-variant), 0.8);
}

.blog-comment-composer__action:hover {
  color: rgb(var(--v-theme-primary));
}

.blog-comment-composer__submit {
  box-shadow: none;
}

.facebook-post-card__comments-empty {
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  background: rgba(var(--blog-surface-rgb), 0.6);
}
</style>
