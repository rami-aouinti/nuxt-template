<template>
  <v-text-field v-model="model" :label="label" type="date" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Date], default: null },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
