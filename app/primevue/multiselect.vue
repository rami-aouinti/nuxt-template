<template>
  <v-select
    v-model="model"
    :items="options"
    :item-title="optionLabel"
    :item-value="optionValue"
    :label="label"
    :chips="true"
    multiple
    clearable
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, null], default: null },
  options: { type: Array, default: () => [] },
  optionLabel: { type: [String, Function], default: 'label' },
  optionValue: { type: [String, Function], default: 'value' },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'change'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', { value })
  },
})
</script>
