<template>
  <v-rating
    v-model="model"
    :length="stars"
    :color="color"
    :readonly="readonly"
    density="comfortable"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Number, String], default: 0 },
  stars: { type: Number, default: 5 },
  color: { type: String, default: 'warning' },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => Number(props.modelValue) || 0,
  set: (value) => emit('update:modelValue', value),
})
</script>
