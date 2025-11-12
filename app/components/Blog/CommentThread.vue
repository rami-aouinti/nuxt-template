<script setup lang="ts">
import { computed } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogReactionType,
} from '~/types/blog'
import { resolveReactionType } from '~/utils/reactions'

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

const formatRelative = (date: string) =>
  props.formatRelativeDate?.(date) ?? props.formatDate(date)

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

const resolveCommentReaction = (
  value: BlogCommentViewModel['isReacted'],
): BlogReactionType | null => resolveReactionType(value ?? null)
</script>

<template>
  <div v-if="hasComments" class="blog-comment-thread">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="blog-comment-thread__item"
    >
      <v-sheet variant="outlined" class="pa-4 mb-4 rounded-lg" color="surface">
        <div class="d-flex align-start">
          <NuxtLink
            v-if="getProfileLink(comment.user)"
            :to="getProfileLink(comment.user)"
            class="blog-comment-thread__avatar-link"
          >
            <AppAvatar
              :src="comment.user.photo || undefined"
              :alt="formatAuthor(comment.user)"
              size="36"
            />
          </NuxtLink>
          <AppAvatar
            v-else
            :src="comment.user.photo || undefined"
            :alt="formatAuthor(comment.user)"
            size="36"
          />
          <div class="flex-grow-1 ml-3">
            <div class="d-flex align-start justify-space-between">
              <div>
                <p class="text-subtitle-2 mb-0">
                  <NuxtLink
                    v-if="getProfileLink(comment.user)"
                    :to="getProfileLink(comment.user)"
                    class="blog-comment-thread__author-link"
                  >
                    {{ formatAuthor(comment.user) }}
                  </NuxtLink>
                  <span v-else>{{ formatAuthor(comment.user) }}</span>
                </p>
                <p
                  class="text-caption text-medium-emphasis mb-3"
                  :title="formatDate(comment.publishedAt)"
                >
                  {{ formatRelative(comment.publishedAt) }}
                </p>
              </div>
            </div>
            <p class="text-body-2 mb-0">
              {{ comment.content }}
            </p>
            <div class="d-flex align-center pa-3 blog-comment-thread__actions">
              <BlogReactionPicker
                class="mr-2"
                size="small"
                density="comfortable"
                :model-value="resolveCommentReaction(comment.isReacted)"
                :count="comment.reactions_count ?? comment.likes_count ?? 0"
                :loading="comment.ui.likeLoading"
                :disabled="!canInteract"
                :show-caret="canInteract"
                @select="(type) => emit('select-reaction', { comment, type })"
                @remove="emit('remove-reaction', comment)"
              />
              <v-btn
                v-if="canInteract"
                variant="text"
                size="small"
                :disabled="comment.ui.replyLoading"
                @click="toggleReply(comment)"
              >
                <v-icon icon="mdi-message" class="mr-1" />
                {{ comment.replies?.length ?? comment.totalComments ?? 0 }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-sheet>

      <v-expand-transition>
        <div v-if="comment.ui.replyOpen" class="blog-comment-thread__reply">
          <v-textarea
            v-model="comment.ui.replyContent"
            :label="t('blog.forms.replyPlaceholder')"
            auto-grow
            rows="2"
            variant="outlined"
            :disabled="comment.ui.replyLoading"
          />
          <div class="d-flex justify-end mt-2 mb-4">
            <v-btn
              class="mr-2"
              variant="text"
              :disabled="comment.ui.replyLoading"
              @click="toggleReply(comment)"
            >
              {{ t('common.actions.cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              :loading="comment.ui.replyLoading"
              :disabled="
                comment.ui.replyLoading ||
                !comment.ui.replyContent.trim().length
              "
              @click="emit('submit-reply', comment)"
            >
              {{ t('blog.actions.addComment') }}
            </v-btn>
          </div>
        </div>
      </v-expand-transition>

      <BlogCommentThread
        v-if="comment.replies?.length"
        :comments="comment.replies"
        :format-author="formatAuthor"
        :format-date="formatDate"
        :format-relative-date="formatRelativeDate"
        :can-interact="canInteract"
        @select-reaction="emit('select-reaction', $event)"
        @remove-reaction="emit('remove-reaction', $event)"
        @submit-reply="emit('submit-reply', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.blog-comment-thread__item:last-child {
  margin-bottom: 0;
}

.blog-comment-thread__reply {
  margin-left: 52px;
}

.blog-comment-thread__actions {
  gap: 8px;
}

.blog-comment-thread__avatar-link {
  display: inline-flex;
}

.blog-comment-thread__author-link {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
}

.blog-comment-thread__author-link:hover {
  text-decoration: underline;
}
</style>
