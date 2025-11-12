<script setup lang="ts">
import { computed } from 'vue'

type CardVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'
type CardElevation = number | string

type CardProps = {
  title?: string
  subtitle?: string
  text?: string
  variant?: CardVariant
  shadow?: boolean
  hover?: boolean
  loading?: boolean
  elevation?: CardElevation
}

const props = defineProps<CardProps>()

const normalizedVariant = computed<CardVariant>(() => props.variant ?? 'elevated')
const isLoading = computed(() => props.loading ?? false)
const hasShadow = computed(() => {
  if (props.shadow !== undefined) return props.shadow
  if (props.elevation !== undefined) {
    const value = typeof props.elevation === 'number' ? props.elevation : Number(props.elevation)
    return Number.isNaN(value) ? true : value > 0
  }
  return normalizedVariant.value === 'elevated'
})
const isHoverable = computed(() => props.hover ?? hasShadow.value)

const normalizedElevation = computed<CardElevation | undefined>(() => {
  if (props.elevation !== undefined) return props.elevation
  return hasShadow.value ? undefined : 0
})

const cardClasses = computed(() => [
  'app-card',
  hasShadow.value ? 'app-card--shadow' : 'app-card--no-shadow',
  { 'app-card--hoverable': isHoverable.value },
])
</script>

<template>
  <v-card
    :variant="normalizedVariant"
    :loading="isLoading"
    :elevation="normalizedElevation"
    :class="cardClasses"
  >
    <template v-if="props.title || $slots.title" #title>
      <slot name="title">
        {{ props.title }}
      </slot>
    </template>
    <template v-if="props.subtitle || $slots.subtitle" #subtitle>
      <slot name="subtitle">
        {{ props.subtitle }}
      </slot>
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot>
      <p v-if="props.text" class="app-card__text">
        {{ props.text }}
      </p>
    </slot>
  </v-card>
</template>

<style scoped>
.app-card {
  position: relative;
  border-radius: var(--app-rounded, 18px) !important;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.app-card--shadow {
  box-shadow: var(--app-shadow, 0 10px 26px rgba(var(--v-theme-primary), 0.14)) !important;
}

.app-card--hoverable:hover {
  box-shadow: var(--app-shadow-hover, 0 18px 44px rgba(var(--v-theme-primary), 0.2)) !important;
  transform: translateY(-4px);
}

.app-card--no-shadow {
  box-shadow: none !important;
}

.app-card__text {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.78);
}
</style>
