<script setup lang="ts">
import { computed } from 'vue'

type ComposerAction = {
  id: string
  label: string
  icon: string
  color?: string
}

const props = defineProps<{
  avatar?: string | null
  displayName?: string | null
  prompt: string
  composerAction: ComposerAction
  actions: ComposerAction[]
}>()

const emit = defineEmits<{ select: [ComposerAction] }>()

const avatarSrc = computed(() => props.avatar || undefined)
const avatarAlt = computed(() => props.displayName || '')

const onSelect = (action: ComposerAction) => emit('select', action)
</script>

<template>
  <AppCard class="blog-create-post-card" elevation="0">
    <v-card-text class="blog-create-post-card__body">
      <button
        type="button"
        class="blog-create-post-card__composer"
        @click="onSelect(composerAction)"
      >
        <AppAvatar
          :src="avatarSrc"
          :alt="avatarAlt"
          size="32"
          class="blog-create-post-card__avatar"
        />
        <div class="blog-create-post-card__placeholder">
          {{ prompt }}
        </div>
      </button>
      <v-divider class="my-4" />
      <div class="blog-create-post-card__actions">
        <AppButton
          v-for="action in actions"
          :key="action.id"
          variant="text"
          class="blog-create-post-card__action"
          :color="action.color ?? 'primary'"
          :prepend-icon="action.icon"
          @click="onSelect(action)"
        >
          {{ action.label }}
        </AppButton>
      </div>
    </v-card-text>
  </AppCard>
</template>

<style scoped>
.blog-create-post-card__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.blog-create-post-card__composer {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid rgba(var(--v-theme-outline), 0.24);
  background-color: rgba(var(--v-theme-surface), 0.9);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.blog-create-post-card__composer:hover,
.blog-create-post-card__composer:focus-visible {
  border-color: rgba(var(--v-theme-primary), 0.4);
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.18);
  outline: none;
}

.blog-create-post-card__placeholder {
  flex: 1;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.95rem;
}

.blog-create-post-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.blog-create-post-card__action {
  flex: 1;
  min-width: 140px;
  justify-content: flex-start;
}

.blog-create-post-card__avatar {
  flex-shrink: 0;
}
</style>
