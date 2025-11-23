<template>
  <v-select
    v-model="model"
    :items="options"
    :item-title="optionLabel"
    :item-value="optionValue"
    :label="label"
    :multiple="multiple"
    clearable
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Array, Object, null], default: null },
  options: { type: Array, default: () => [] },
  optionLabel: { type: [String, Function], default: 'label' },
  optionValue: { type: [String, Function], default: 'value' },
  label: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
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
