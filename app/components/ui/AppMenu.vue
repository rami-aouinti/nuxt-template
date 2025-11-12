<script setup lang="ts">
import { computed, watch } from 'vue'

type MenuLocation =
  | 'top'
  | 'bottom'
  | 'start'
  | 'end'
  | 'top start'
  | 'top end'
  | 'bottom start'
  | 'bottom end'
  | 'left'
  | 'right'

type OffsetValue = number | string | readonly [number, number]

const props = defineProps<{
  modelValue?: boolean
  closeOnContentClick?: boolean
  location?: MenuLocation
  openOnHover?: boolean
  offset?: OffsetValue
  transition?: string
  maxHeight?: string | number
  width?: string | number
  persistent?: boolean
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

const normalizedCloseOnContentClick = computed(
  () => props.closeOnContentClick ?? true,
)
const normalizedLocation = computed<MenuLocation>(
  () => props.location ?? 'bottom end',
)
const normalizedOffset = computed<OffsetValue>(() => props.offset ?? 12)
const normalizedTransition = computed(
  () => props.transition ?? 'scale-transition',
)
const normalizedMaxHeight = computed(() => props.maxHeight ?? 360)
const normalizedWidth = computed(() => props.width ?? undefined)
const isPersistent = computed(() => props.persistent ?? false)
const hasShadow = computed(() => props.shadow ?? true)

const contentClass = computed(() =>
  [
    'app-menu',
    hasShadow.value ? 'app-menu--shadow' : 'app-menu--no-shadow',
  ].join(' '),
)

watch(isOpen, (value, oldValue) => {
  if (value === oldValue) return
  emit(value ? 'open' : 'close')
})
</script>

<template>
  <v-menu
    v-model="isOpen"
    :close-on-content-click="normalizedCloseOnContentClick"
    :location="normalizedLocation"
    :open-on-hover="openOnHover"
    :offset="normalizedOffset"
    :transition="normalizedTransition"
    :max-height="normalizedMaxHeight"
    :width="normalizedWidth"
    :persistent="isPersistent"
    :content-class="contentClass"
  >
    <template v-if="$slots.activator" #activator="slotProps">
      <slot name="activator" v-bind="slotProps" />
    </template>
    <slot />
  </v-menu>
</template>

<style scoped>
.app-menu {
  border-radius: var(--app-rounded, 18px);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.app-menu--shadow {
  box-shadow: var(--app-shadow, 0 10px 26px rgba(var(--v-theme-primary), 0.14));
}

.app-menu--shadow:hover,
.app-menu--shadow:focus-within {
  box-shadow: var(
    --app-shadow-hover,
    0 18px 44px rgba(var(--v-theme-primary), 0.2)
  );
}

.app-menu--no-shadow {
  box-shadow: none;
}
</style>
