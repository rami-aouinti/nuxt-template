<template>
  <v-checkbox
    v-model="model"
    :label="label"
    :value="value"
    :disabled="disabled"
    density="comfortable"
    hide-details
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Boolean, Array, String, Number], default: false },
  label: { type: String, default: '' },
  value: { type: [String, Number, Boolean, Object], default: true },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
