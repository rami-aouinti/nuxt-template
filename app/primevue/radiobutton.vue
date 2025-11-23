<template>
  <v-radio
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
  modelValue: { type: [String, Number, Boolean], default: null },
  label: { type: String, default: '' },
  value: { type: [String, Number, Boolean], default: null },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
