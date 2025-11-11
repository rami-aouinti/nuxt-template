<script setup lang="ts">
import { computed } from 'vue'
import type { BlogReactionPreview, BlogPostUser } from '~/types/blog'
import { getReactionDefinition } from '~/utils/reactions'

const props = defineProps<{
  modelValue: boolean
  reactions: BlogReactionPreview[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const { t } = useI18n()

const getUserDisplayName = (user: BlogPostUser) => {
  const parts = [user.firstName, user.lastName]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)

  if (parts.length) {
    return parts.join(' ')
  }

  if (typeof user.username === 'string' && user.username.trim().length) {
    return user.username.trim()
  }

  if (typeof user.email === 'string' && user.email.trim().length) {
    return user.email.trim()
  }

  return t('auth.guest')
}

const getReactionLabel = (type: string) => {
  if (!type) {
    return t('blog.reactions.types.like')
  }

  const key = `blog.reactions.types.${type}` as const
  const translation = t(key)
  return translation && translation !== key
    ? translation
    : type.charAt(0).toUpperCase() + type.slice(1)
}

const getReactionEmoji = (type: string) =>
  getReactionDefinition(type)?.emoji ?? '👍'

type NormalizedReaction = BlogReactionPreview & {
  id: string
  type: string
  displayName: string
  label: string
  emoji: string
}

const normalizedReactions = computed<NormalizedReaction[]>(() => {
  return (props.reactions ?? [])
    .filter((reaction): reaction is BlogReactionPreview => {
      if (!reaction || typeof reaction !== 'object') {
        return false
      }

      const user = (reaction as { user?: BlogPostUser | null }).user
      return Boolean(
        user &&
          typeof user === 'object' &&
          'id' in user &&
          typeof user.id === 'string' &&
          user.id.trim().length > 0,
      )
    })
    .map((reaction) => {
      const sanitizedType =
        typeof reaction.type === 'string' && reaction.type.trim().length
          ? reaction.type.trim()
          : 'like'

      return {
        ...reaction,
        id:
          typeof reaction.id === 'string' && reaction.id.trim().length
            ? reaction.id
            : `${reaction.user.id}-${sanitizedType}`,
        type: sanitizedType,
        displayName: getUserDisplayName(reaction.user),
        label: getReactionLabel(sanitizedType),
        emoji: getReactionEmoji(sanitizedType),
      }
    })
    .sort((a, b) => {
      const labelComparison = a.label.localeCompare(b.label)
      if (labelComparison !== 0) {
        return labelComparison
      }

      return a.displayName.localeCompare(b.displayName)
    })
})

const totalReactions = computed(() => normalizedReactions.value.length)

const userAvatar = (user: BlogPostUser) => {
  if (typeof user.photo === 'string' && user.photo.trim().length) {
    return user.photo
  }

  return undefined
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="420">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <span class="font-weight-medium">{{ t('blog.dialogs.reactionsTitle') }}</span>
          <v-chip
            v-if="totalReactions"
            size="small"
            color="primary"
            variant="tonal"
            class="blog-reactions-dialog__count"
          >
            {{ totalReactions }}
          </v-chip>
        </div>
        <v-btn
          variant="text"
          density="comfortable"
          icon="mdi-close"
          @click="isOpen = false"
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <template v-if="normalizedReactions.length">
          <v-list density="comfortable" class="blog-reactions-dialog__list">
            <v-list-item
              v-for="reaction in normalizedReactions"
              :key="reaction.id"
              density="compact"
              rounded="lg"
              class="blog-reactions-dialog__item"
            >
              <template #prepend>
                <AppAvatar
                  :src="userAvatar(reaction.user)"
                  :alt="reaction.displayName"
                  size="40"
                />
              </template>
              <template #title>
                <span class="blog-reactions-dialog__title">{{ reaction.displayName }}</span>
              </template>
              <template #subtitle>
                <span class="blog-reactions-dialog__subtitle">{{ reaction.label }}</span>
              </template>
              <template #append>
                <v-avatar
                  size="36"
                  color="primary"
                  variant="tonal"
                  class="blog-reactions-dialog__reaction"
                  :aria-label="reaction.label"
                  role="img"
                >
                  {{ reaction.emoji }}
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </template>
        <template v-else>
          <div class="text-medium-emphasis text-center py-8">
            {{ t('blog.dialogs.reactionsEmpty') }}
          </div>
        </template>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isOpen = false">
          {{ t('common.actions.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.blog-reactions-dialog__count {
  margin-left: 8px;
  font-weight: 600;
}

.blog-reactions-dialog__list {
  padding: 4px 0;
}

.blog-reactions-dialog__item {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.blog-reactions-dialog__item + .blog-reactions-dialog__item {
  margin-top: 6px;
}

.blog-reactions-dialog__item:hover {
  background-color: rgba(var(--v-theme-primary), 0.06);
  border-color: rgba(var(--v-theme-primary), 0.24);
}

.blog-reactions-dialog__title {
  font-weight: 600;
}

.blog-reactions-dialog__subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: capitalize;
}

.blog-reactions-dialog__reaction {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
