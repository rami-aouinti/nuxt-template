<script setup lang="ts">
import { computed, watch } from 'vue'

type MaxWidth = string | number

const props = defineProps<{
  modelValue?: boolean
  maxWidth?: MaxWidth
  fullscreen?: boolean
  persistent?: boolean
  scrollable?: boolean
  transition?: string
  overlayColor?: string
  overlayOpacity?: number | string
  shadow?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'open' | 'close'): void
}>()

const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  },
})

const normalizedMaxWidth = computed<MaxWidth>(() => props.maxWidth ?? 520)
const isFullscreen = computed(() => props.fullscreen ?? false)
const isPersistent = computed(() => props.persistent ?? false)
const isScrollable = computed(() => props.scrollable ?? false)
const normalizedTransition = computed(() => props.transition ?? 'dialog-bottom-transition')
const hasShadow = computed(() => props.shadow ?? true)

const contentClass = computed(() =>
  ['app-modal', hasShadow.value ? 'app-modal--shadow' : 'app-modal--no-shadow'].join(' '),
)

watch(isOpen, (value, oldValue) => {
  if (value === oldValue) return
  emit(value ? 'open' : 'close')
})
</script>

<template>
  <v-dialog
    v-model="isOpen"
    :max-width="normalizedMaxWidth"
    :fullscreen="isFullscreen"
    :persistent="isPersistent"
    :scrollable="isScrollable"
    :transition="normalizedTransition"
    :overlay-color="overlayColor"
    :overlay-opacity="overlayOpacity"
    :content-class="contentClass"
  >
    <template v-if="$slots.activator" #activator="slotProps">
      <slot name="activator" v-bind="slotProps" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
  </v-dialog>
</template>

<style scoped>
.app-modal {
  border-radius: var(--app-rounded, 18px);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.app-modal--shadow {
  box-shadow: var(--app-shadow, 0 10px 26px rgba(15, 23, 42, 0.14));
}

.app-modal--shadow:focus-within,
.app-modal--shadow:hover {
  box-shadow: var(--app-shadow-hover, 0 18px 44px rgba(15, 23, 42, 0.2));
}

.app-modal--no-shadow {
  box-shadow: none;
}
</style>
