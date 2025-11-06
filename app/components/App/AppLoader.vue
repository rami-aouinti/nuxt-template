<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    subtitle?: string
    persistent?: boolean
    scrim?: string
  }>(),
  {
    modelValue: false,
    title: '',
    subtitle: '',
    persistent: true,
    scrim: 'rgba(16, 16, 29, 0.78)',
  },
)

const { t } = useI18n()

const computedTitle = computed(() => props.title || t('app.loader.title'))
const computedSubtitle = computed(
  () => props.subtitle || t('app.loader.subtitle'),
)
</script>

<template>
  <v-overlay
    :model-value="props.modelValue"
    :persistent="props.persistent"
    :scrim="props.scrim"
    class="app-loader"
  >
    <div class="app-loader__container">
      <div class="app-loader__icon">
        <v-progress-circular size="72" width="6" color="primary" indeterminate />
      </div>
      <div class="app-loader__content text-center">
        <h2 class="text-h5 font-weight-medium mb-1">
          {{ computedTitle }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ computedSubtitle }}
        </p>
        <slot />
      </div>
    </div>
  </v-overlay>
</template>

<style scoped>
.app-loader :deep(.v-overlay__scrim) {
  backdrop-filter: blur(6px);
}

.app-loader__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 32px 40px;
  border-radius: 24px;
  background: var(--v-theme-primary);
  box-shadow: 0 24px 48px rgba(7, 14, 34, 0.45);
  min-width: min(90vw, 360px);
  color: white;
}

.app-loader__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.16);
}

.app-loader__content {
  max-width: 320px;
}
</style>
