<script setup lang="ts">
import { computed } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogReactionType,
} from '~/types/blog'
import AppButton from '~/components/ui/AppButton.vue'
import AppMenu from '~/components/ui/AppMenu.vue'

defineOptions({ name: 'BlogCommentThread' })

const props = defineProps<{
  comments: BlogCommentViewModel[]
  formatAuthor: (user: BlogPostUser) => string
  formatDate: (date: string) => string
  formatRelativeDate?: (date: string) => string
  canInteract: boolean
  resolveProfileLink?: (user: BlogPostUser) => string | null | undefined
  currentUserId?: string | null
}>()

const emit = defineEmits<{
  (
    e: 'select-reaction',
    payload: { comment: BlogCommentViewModel; type: BlogReactionType },
  ): void
  (e: 'remove-reaction' | 'submit-reply', comment: BlogCommentViewModel): void
  (
    e: 'submit-edit',
    payload: { comment: BlogCommentViewModel; content: string },
  ): void
  (e: 'delete-comment', comment: BlogCommentViewModel): void
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

const normalizeId = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const canManageComment = (comment: BlogCommentViewModel) => {
  const currentId = normalizeId(props.currentUserId ?? null)
  const authorId = normalizeId(comment.user?.id ?? null)
  return Boolean(currentId) && currentId === authorId
}

const isCommentBusy = (comment: BlogCommentViewModel) =>
  comment.ui.editLoading || comment.ui.deleteLoading

const startEdit = (comment: BlogCommentViewModel) => {
  comment.ui.editContent = comment.content
  comment.ui.editOpen = true
}

const cancelEdit = (comment: BlogCommentViewModel) => {
  comment.ui.editOpen = false
  comment.ui.editContent = comment.content
}

const submitEdit = (comment: BlogCommentViewModel) => {
  const content = comment.ui.editContent.trim()
  if (!content) {
    return
  }

  emit('submit-edit', { comment, content })
}

const requestDelete = (comment: BlogCommentViewModel) => {
  if (isCommentBusy(comment)) {
    return
  }

  emit('delete-comment', comment)
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
        :disabled="comment.ui.editOpen || isCommentBusy(comment)"
        @select-reaction="(type) => emit('select-reaction', { comment, type })"
        @remove-reaction="emit('remove-reaction', comment)"
        @toggle-reply="toggleReply(comment)"
      >
        <template v-if="comment.ui.editOpen" #default>
          <div class="blog-comment-thread__edit">
            <BlogCommentEditor
              v-model="comment.ui.editContent"
              card-variant="flat"
              :loading="comment.ui.editLoading"
              :disabled="comment.ui.deleteLoading"
              @submit="submitEdit(comment)"
              @cancel="cancelEdit(comment)"
            >
              <template #actions-right="{ loading, canSubmit, submit }">
                <AppButton
                  variant="text"
                  :disabled="loading"
                  @click="cancelEdit(comment)"
                >
                  {{ t('common.actions.cancel') }}
                </AppButton>
                <AppButton
                  color="primary"
                  variant="text"
                  :loading="loading"
                  :disabled="!canSubmit"
                  @click="submit"
                >
                  {{ t('common.actions.save') }}
                </AppButton>
              </template>
            </BlogCommentEditor>
          </div>
        </template>
        <template v-if="canManageComment(comment)" #meta-actions>
          <AppMenu>
            <template #activator="{ props: activatorProps }">
              <AppButton
                v-bind="activatorProps"
                variant="text"
                icon
                density="comfortable"
                :disabled="isCommentBusy(comment)"
                :aria-label="t('blog.actions.commentMenu')"
              >
                <v-icon icon="mdi-dots-horizontal" />
              </AppButton>
            </template>
            <v-list density="compact" class="blog-comment-thread__menu">
              <v-list-item
                v-if="!comment.ui.editOpen"
                :disabled="isCommentBusy(comment)"
                @click="startEdit(comment)"
              >
                <v-list-item-title>
                  {{ t('blog.actions.editComment') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-else
                :disabled="isCommentBusy(comment)"
                @click="cancelEdit(comment)"
              >
                <v-list-item-title>
                  {{ t('blog.actions.cancelEdit') }}
                </v-list-item-title>
              </v-list-item>
              <v-divider class="my-1" />
              <v-list-item
                class="text-error"
                :disabled="isCommentBusy(comment)"
                @click="requestDelete(comment)"
              >
                <v-list-item-title>
                  {{ t('blog.actions.deleteComment') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </AppMenu>
        </template>
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
                <template
                  #actions-right="{ loading, canSubmit, submit, cancel }"
                >
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
          <div
            v-if="comment.replies?.length"
            class="blog-comment-thread__children"
          >
            <BlogCommentThread
              :comments="comment.replies"
              :format-author="formatAuthor"
              :format-date="formatDate"
              :format-relative-date="props.formatRelativeDate"
              :can-interact="canInteract"
              :resolve-profile-link="props.resolveProfileLink"
              :current-user-id="props.currentUserId"
              @select-reaction="emit('select-reaction', $event)"
              @remove-reaction="emit('remove-reaction', $event)"
              @submit-reply="emit('submit-reply', $event)"
              @submit-edit="emit('submit-edit', $event)"
              @delete-comment="emit('delete-comment', $event)"
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

.blog-comment-thread__edit {
  margin-top: 4px;
}

.blog-comment-thread__menu {
  min-width: 220px;
}
</style>
