<template>
  <v-btn
    :color="color"
    :variant="variant"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :type="type"
    :aria-label="ariaLabel"
    block="false"
    @click="$emit('click', $event)"
  >
    <v-icon v-if="icon" :icon="icon" start />
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  severity: { type: String, default: 'primary' },
  outlined: { type: Boolean, default: false },
  text: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'default' },
  type: { type: String, default: 'button' },
})

defineEmits(['click'])

const color = computed(() => props.severity || 'primary')
const variant = computed(() => {
  if (props.text || props.plain) return 'text'
  if (props.outlined) return 'outlined'
  return 'flat'
})
const ariaLabel = computed(() =>
  props.text && props.label ? props.label : undefined,
)
</script>
