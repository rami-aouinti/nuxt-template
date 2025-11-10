<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrim="scrim"
    :scrollable="scrollable"
    :transition="transition"
  >
    <v-card class="app-modal" elevation="0">
      <header class="app-modal__header">
        <div v-if="icon || $slots.icon" class="app-modal__icon">
          <slot name="icon">
            <v-icon :icon="icon" size="28" />
          </slot>
        </div>
        <div class="app-modal__titles">
          <slot name="title">
            <h3 class="app-modal__title">{{ title }}</h3>
          </slot>
          <p v-if="subtitle || $slots.subtitle" class="app-modal__subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
        <v-spacer />
        <v-btn
          v-if="!hideClose"
          class="app-modal__close"
          icon
          variant="text"
          :disabled="closeDisabled"
          @click="handleClose"
        >
          <v-icon icon="mdi-close" size="22" />
        </v-btn>
      </header>

      <v-divider class="app-modal__divider" />

      <v-card-text class="app-modal__body">
        <slot />
      </v-card-text>

      <template v-if="$slots.actions">
        <v-divider class="app-modal__divider" />
        <v-card-actions class="app-modal__actions">
          <slot name="actions" />
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    subtitle?: string
    icon?: string
    maxWidth?: string | number
    persistent?: boolean
    scrollable?: boolean
    scrim?: boolean | string
    closeDisabled?: boolean
    hideClose?: boolean
    transition?: string
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    icon: undefined,
    maxWidth: 520,
    persistent: false,
    scrollable: false,
    scrim: undefined,
    closeDisabled: false,
    hideClose: false,
    transition: 'dialog-bottom-transition',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close' | 'open'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    if (!value) {
      emit('close')
    }
  },
})

watch(
  () => props.modelValue,
  (value, oldValue) => {
    if (value && !oldValue) {
      emit('open')
    }
  },
)

const handleClose = () => {
  if (props.closeDisabled) {
    return
  }

  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.app-modal {
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
  background: rgb(var(--v-theme-surface));
}

.app-modal__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.96),
    rgba(var(--v-theme-secondary), 0.9)
  );
  color: rgba(var(--v-theme-on-primary), 0.94);
}

.app-modal__titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.app-modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.01em;
}

.app-modal__subtitle {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.4;
  opacity: 0.9;
}

.app-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(var(--v-theme-on-primary), 0.12);
  backdrop-filter: blur(12px);
}

.app-modal__close {
  color: rgba(var(--v-theme-on-primary), 0.88);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.app-modal__close:hover {
  background-color: rgba(var(--v-theme-on-primary), 0.12);
}

.app-modal__body {
  padding: 28px 24px 24px;
}

.app-modal__actions {
  padding: 16px 24px 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.app-modal__divider {
  opacity: 0.16;
}

:deep(.v-alert) {
  border-radius: 14px;
}
</style>
