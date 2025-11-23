<template>
  <v-text-field
    v-model.number="model"
    :label="label"
    type="number"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
