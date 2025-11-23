<template>
  <v-autocomplete
    v-model="model"
    :items="suggestions"
    :item-title="optionLabel"
    :item-value="optionValue"
    :label="label"
    clearable
    v-bind="$attrs"
    @update:model-value="emit('complete', { query: model })"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Object, Array, null], default: null },
  suggestions: { type: Array, default: () => [] },
  optionLabel: { type: [String, Function], default: 'label' },
  optionValue: { type: [String, Function], default: 'value' },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'complete'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})
</script>
