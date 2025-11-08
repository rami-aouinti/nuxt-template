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

const normalizedReactions = computed(() => {
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
    .map((reaction) => ({
      ...reaction,
      id:
        typeof reaction.id === 'string' && reaction.id.trim().length
          ? reaction.id
          : `${reaction.user.id}-${reaction.type}`,
      type:
        typeof reaction.type === 'string' && reaction.type.trim().length
          ? reaction.type.trim()
          : 'like',
    }))
})

const { t } = useI18n()

const reactionLabel = (type: string) => {
  if (!type) {
    return t('blog.reactions.types.like')
  }

  const key = `blog.reactions.types.${type}` as const
  const translation = t(key)
  return translation && translation !== key
    ? translation
    : type.charAt(0).toUpperCase() + type.slice(1)
}

const reactionEmoji = (type: string) =>
  getReactionDefinition(type)?.emoji ?? '👍'

const userDisplayName = (user: BlogPostUser) => {
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
        <span>{{ t('blog.dialogs.reactionsTitle') }}</span>
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
          <v-list density="comfortable">
            <v-list-item
              v-for="reaction in normalizedReactions"
              :key="reaction.id"
            >
              <template #prepend>
                <v-avatar size="40">
                  <v-img
                    :src="userAvatar(reaction.user)"
                    :alt="userDisplayName(reaction.user)"
                    cover
                  >
                    <template #error>
                      <v-icon icon="mdi-account-circle" />
                    </template>
                  </v-img>
                </v-avatar>
              </template>
              <v-list-item-title>
                {{ userDisplayName(reaction.user) }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-capitalize">
                <span class="blog-reactions-dialog__emoji">{{
                  reactionEmoji(reaction.type)
                }}</span>
                {{ reactionLabel(reaction.type) }}
              </v-list-item-subtitle>
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
.blog-reactions-dialog__emoji {
  margin-right: 6px;
  font-size: 1.1rem;
}
</style>
