<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
type ButtonSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large'
type ButtonDensity = 'default' | 'comfortable' | 'compact'
type ButtonType = 'button' | 'submit' | 'reset'

type IconValue = string | undefined

const props = defineProps<{
  color?: string
  variant?: ButtonVariant
  shadow?: boolean
  block?: boolean
  loading?: boolean
  disabled?: boolean
  size?: ButtonSize
  density?: ButtonDensity
  prependIcon?: IconValue
  appendIcon?: IconValue
  type?: ButtonType
}>()

const normalizedVariant = computed<ButtonVariant>(() => props.variant ?? 'elevated')
const normalizedColor = computed(() => props.color ?? 'primary')
const normalizedBlock = computed(() => props.block ?? false)
const normalizedLoading = computed(() => props.loading ?? false)
const normalizedDisabled = computed(() => props.disabled ?? false)
const normalizedSize = computed<ButtonSize>(() => props.size ?? 'default')
const normalizedDensity = computed<ButtonDensity>(() => props.density ?? 'default')
const normalizedType = computed<ButtonType>(() => props.type ?? 'button')

const hasShadow = computed(() => props.shadow ?? (normalizedVariant.value === 'elevated'))
</script>

<template>
  <v-btn
    :variant="normalizedVariant"
    :color="normalizedColor"
    :loading="normalizedLoading"
    :disabled="normalizedDisabled"
    :block="normalizedBlock"
    :size="normalizedSize"
    :density="normalizedDensity"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :type="normalizedType"
    :elevation="hasShadow ? undefined : 0"
    :class="[
      'app-button',
      hasShadow ? 'app-button--shadow' : 'app-button--no-shadow',
      { 'app-button--block': normalizedBlock },
    ]"
  >
    <slot />
  </v-btn>
</template>

<style scoped>
.app-button {
  border-radius: var(--app-rounded, 18px) !important;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}

.app-button--block {
  width: 100%;
}

.app-button--shadow {
  box-shadow: var(--app-shadow, 0 10px 26px rgba(var(--v-theme-primary), 0.14)) !important;
}

.app-button--shadow:hover,
.app-button--shadow:focus-visible {
  box-shadow: var(--app-shadow-hover, 0 18px 44px rgba(var(--v-theme-primary), 0.2)) !important;
  transform: translateY(-1px);
}

.app-button--no-shadow {
  box-shadow: none !important;
}
</style>
