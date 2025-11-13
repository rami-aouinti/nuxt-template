<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref } from 'vue'
import type {
  BlogCommentViewModel,
  BlogPostUser,
  BlogPostViewModel,
  BlogReactionType,
} from '~/types/blog'
import { useBlogAuthor } from '~/composables/useBlogAuthor'
import AppButton from '~/components/ui/AppButton.vue'
import AppMenu from '~/components/ui/AppMenu.vue'

defineOptions({ name: 'BlogPostComments' })

const props = defineProps<{
  post: BlogPostViewModel
  loggedIn: boolean
  formatDate: (value: string) => string
  formatRelativeDate?: (value: string) => string
  currentUserId?: string | null
}>()

const emit = defineEmits<{
  'submit-comment': []
  'select-reaction': [{ comment: BlogCommentViewModel; type: BlogReactionType }]
  'remove-reaction': [BlogCommentViewModel]
  'submit-reply': [BlogCommentViewModel]
  'submit-comment-edit': [{ comment: BlogCommentViewModel; content: string }]
  'delete-comment': [BlogCommentViewModel]
}>()

const { t } = useI18n()
const { getAuthorName, getAuthorProfileLink } = useBlogAuthor()

const formatAuthor = (user: BlogPostUser) => getAuthorName(user)
const resolveProfileLink = (user: BlogPostUser) => getAuthorProfileLink(user)
const currentUserId = computed(() => props.currentUserId ?? null)

const commentFilters = [
  {
    value: 'relevant',
    label: 'blog.comments.filters.relevant',
    description: 'blog.comments.filters.relevantDescription',
  },
  {
    value: 'newest',
    label: 'blog.comments.filters.newest',
    description: 'blog.comments.filters.newestDescription',
  },
  {
    value: 'all',
    label: 'blog.comments.filters.all',
    description: 'blog.comments.filters.allDescription',
  },
] as const

type CommentFilterValue = (typeof commentFilters)[number]['value']

const selectedFilter = ref<CommentFilterValue>('relevant')

const selectedFilterOption = computed(
  () =>
    commentFilters.find((option) => option.value === selectedFilter.value) ||
    commentFilters[0],
)

const hasFilterMenu = computed(() => (props.post.comments?.length ?? 0) > 2)

const formatTimestamp = (value: string) => {
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : 0
}

const commentsToDisplay = computed(() => {
  const comments = props.post.comments ?? []
  if (!Array.isArray(comments) || comments.length <= 1) {
    return comments
  }

  const sorted = [...comments]
  switch (selectedFilter.value) {
    case 'newest':
      return sorted.sort(
        (a, b) => formatTimestamp(b.publishedAt) - formatTimestamp(a.publishedAt),
      )
    case 'all':
      return sorted.sort(
        (a, b) => formatTimestamp(a.publishedAt) - formatTimestamp(b.publishedAt),
      )
    default:
      return comments
  }
})

const selectFilter = (value: CommentFilterValue) => {
  selectedFilter.value = value
}
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

    <div
      v-if="hasFilterMenu"
      class="facebook-post-card__comments-toolbar"
    >
      <AppMenu>
        <template #activator="{ props: activatorProps }">
          <AppButton
            v-bind="activatorProps"
            class="facebook-post-card__comments-filter"
            variant="text"
            density="comfortable"
            prepend-icon="mdi-menu-down"
          >
            {{ t(selectedFilterOption.label) }}
          </AppButton>
        </template>
        <v-list density="comfortable" class="facebook-post-card__comments-filter-menu">
          <v-list-subheader>
            {{ t('blog.comments.filters.label') }}
          </v-list-subheader>
          <v-list-item
            v-for="option in commentFilters"
            :key="option.value"
            @click="selectFilter(option.value)"
          >
            <v-list-item-title>{{ t(option.label) }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ t(option.description) }}
            </v-list-item-subtitle>
            <template #append>
              <v-icon
                v-if="option.value === selectedFilter"
                icon="mdi-check"
                size="18"
              />
            </template>
          </v-list-item>
        </v-list>
      </AppMenu>
    </div>

    <BlogCommentThread
      v-if="commentsToDisplay.length"
      :comments="commentsToDisplay"
      :format-author="formatAuthor"
      :format-date="formatDate"
      :format-relative-date="formatRelativeDate"
      :can-interact="loggedIn"
      :resolve-profile-link="resolveProfileLink"
      :current-user-id="currentUserId"
      @select-reaction="emit('select-reaction', $event)"
      @remove-reaction="emit('remove-reaction', $event)"
      @submit-reply="emit('submit-reply', $event)"
      @submit-edit="emit('submit-comment-edit', $event)"
      @delete-comment="emit('delete-comment', $event)"
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

.facebook-post-card__comments-toolbar {
  display: flex;
  justify-content: flex-end;
}

.facebook-post-card__comments-filter {
  text-transform: none;
  font-weight: 600;
}

.facebook-post-card__comments-filter-menu {
  min-width: 260px;
}

.facebook-post-card__comments-empty {
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  background: rgba(var(--blog-surface-rgb), 0.6);
}
</style>
