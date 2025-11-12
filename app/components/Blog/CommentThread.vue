<script setup lang="ts">
import { computed } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogReactionType,
} from '~/types/blog'
import AppButton from "~/components/ui/AppButton.vue";

defineOptions({ name: 'BlogCommentThread' })

const props = defineProps<{
  comments: BlogCommentViewModel[]
  formatAuthor: (user: BlogPostUser) => string
  formatDate: (date: string) => string
  formatRelativeDate?: (date: string) => string
  canInteract: boolean
  resolveProfileLink?: (user: BlogPostUser) => string | null | undefined
}>()

const emit = defineEmits<{
  (
    e: 'select-reaction',
    payload: { comment: BlogCommentViewModel; type: BlogReactionType },
  ): void
  (e: 'remove-reaction' | 'submit-reply', comment: BlogCommentViewModel): void
}>()

const { t } = useI18n()

const hasComments = computed(() => props.comments?.length > 0)

const getProfileLink = (user: BlogPostUser) => {
  const link = props.resolveProfileLink?.(user)
  if (typeof link === 'string' && link.trim().length) {
    return link
  }

  return undefined
}

const toggleReply = (comment: BlogCommentViewModel) => {
  comment.ui.replyOpen = !comment.ui.replyOpen
  if (!comment.ui.replyOpen) {
    comment.ui.replyContent = ''
  }
}
</script>

<template>
  <div v-if="hasComments" class="blog-comment-thread">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="blog-comment-thread__item"
    >
      <BlogCommentCard
        :comment="comment"
        :format-author="formatAuthor"
        :format-date="formatDate"
        :format-relative-date="props.formatRelativeDate"
        :can-interact="canInteract"
        :resolve-profile-link="getProfileLink"
        :reply-count="comment.replies?.length ?? comment.totalComments ?? 0"
        @select-reaction="(type) => emit('select-reaction', { comment, type })"
        @remove-reaction="emit('remove-reaction', comment)"
        @toggle-reply="toggleReply(comment)"
      >
        <template #reply>
          <v-expand-transition>
            <div v-if="comment.ui.replyOpen" class="blog-comment-thread__reply">
              <BlogCommentEditor
                v-model="comment.ui.replyContent"
                :placeholder="t('blog.forms.replyPlaceholder')"
                :loading="comment.ui.replyLoading"
                card-variant="flat"
                @submit="emit('submit-reply', comment)"
                @cancel="toggleReply(comment)"
              >
                <template #actions-left="{ disabled }">
                  <AppButton
                    variant="text"
                    icon
                    density="compact"
                    :disabled="disabled"
                  >
                    <v-icon>mdi-paperclip</v-icon>
                  </AppButton>
                  <AppButton
                    variant="text"
                    icon
                    density="compact"
                    :disabled="disabled"
                  >
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
            </div>
          </v-expand-transition>
        </template>
        <template #children>
          <div v-if="comment.replies?.length" class="blog-comment-thread__children">
            <BlogCommentThread
              :comments="comment.replies"
              :format-author="formatAuthor"
              :format-date="formatDate"
              :format-relative-date="props.formatRelativeDate"
              :can-interact="canInteract"
              :resolve-profile-link="props.resolveProfileLink"
              @select-reaction="emit('select-reaction', $event)"
              @remove-reaction="emit('remove-reaction', $event)"
              @submit-reply="emit('submit-reply', $event)"
            />
          </div>
        </template>
      </BlogCommentCard>
    </div>
  </div>
</template>

<style scoped>
.blog-comment-thread__item:last-child {
  margin-bottom: 0;
}

.blog-comment-thread__reply {
  margin-left: 48px;
}

.blog-comment-thread__children {
  margin-left: 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
