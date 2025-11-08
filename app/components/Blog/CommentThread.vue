<script setup lang="ts">
import { computed } from 'vue'
import type { BlogCommentViewModel, BlogPostUser } from '~/types/blog'

defineOptions({ name: 'BlogCommentThread' })

const props = defineProps<{
  comments: BlogCommentViewModel[]
  formatAuthor: (user: BlogPostUser) => string
  formatDate: (date: string) => string
  canInteract: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-like' | 'submit-reply', comment: BlogCommentViewModel): void
}>()

const { t } = useI18n()

const hasComments = computed(() => props.comments?.length > 0)

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
      <v-sheet variant="outlined" class="pa-4 mb-4 rounded-lg" color="surface">
        <div class="d-flex align-start">
          <v-avatar size="36">
            <v-img
              :src="comment.user.photo || undefined"
              :alt="formatAuthor(comment.user)"
            >
              <template #error>
                <v-icon icon="mdi-account-circle" size="36" />
              </template>
            </v-img>
          </v-avatar>
          <div class="flex-grow-1 ml-3">
            <div class="d-flex align-start justify-space-between">
              <div>
                <p class="text-subtitle-2 mb-0">
                  {{ formatAuthor(comment.user) }}
                </p>
                <p class="text-caption text-medium-emphasis mb-3">
                  {{ formatDate(comment.publishedAt) }}
                </p>
              </div>
              <div class="d-flex align-center">
                <v-btn
                  v-if="canInteract"
                  variant="text"
                  size="small"
                  :loading="comment.ui.likeLoading"
                  class="mr-2"
                  @click="emit('toggle-like', comment)"
                >
                  <v-icon
                    :icon="comment.isReacted ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
                    class="mr-1"
                  />
                  {{ comment.reactions_count ?? comment.likes_count ?? 0 }}
                </v-btn>
                <v-btn
                  v-if="canInteract"
                  variant="text"
                  size="small"
                  :disabled="comment.ui.replyLoading"
                  @click="toggleReply(comment)"
                >
                  <v-icon icon="mdi-reply" class="mr-1" />
                  {{ t('blog.actions.reply') }}
                </v-btn>
              </div>
            </div>
            <p class="text-body-2 mb-0">
              {{ comment.content }}
            </p>
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
                comment.ui.replyLoading || !comment.ui.replyContent.trim().length
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
        :can-interact="canInteract"
        @toggle-like="emit('toggle-like', $event)"
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
</style>
