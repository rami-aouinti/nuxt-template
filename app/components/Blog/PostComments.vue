<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionType,
} from '~/types/blog'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import AppButton from '~/components/ui/AppButton.vue'

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

    <BlogCommentEditor
      v-if="loggedIn"
      v-model="post.ui.commentContent"
      card-variant="flat"
      :placeholder="t('blog.forms.commentPlaceholder')"
      :loading="post.ui.commentLoading"
      @submit="emit('submit-comment')"
    >
      <template #actions-left="{ disabled }">
        <AppButton variant="text" icon density="compact" :disabled="disabled">
          <v-icon>mdi-paperclip</v-icon>
        </AppButton>
        <AppButton variant="text" icon density="compact" :disabled="disabled">
          <v-icon>mdi-microphone-outline</v-icon>
        </AppButton>
      </template>
      <template #actions-right="{ loading, canSubmit, submit, cancel }">
        <AppButton
          variant="text"
          icon
          :loading="loading"
          :disabled="!canSubmit"
          :aria-label="t('blog.actions.addComment')"
          density="compact"
          @click="submit"
        >
          <v-icon>mdi-send</v-icon>
        </AppButton>
      </template>
    </BlogCommentEditor>

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

.facebook-post-card__comments-empty {
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  background: rgba(var(--blog-surface-rgb), 0.6);
}
</style>
