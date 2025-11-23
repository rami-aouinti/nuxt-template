<template>
  <v-btn-toggle
    v-model="model"
    :multiple="multiple"
    :divided="true"
    :base-color="color"
    density="comfortable"
  >
    <v-btn
      v-for="(opt, idx) in options"
      :key="idx"
      :value="opt.value ?? opt"
      :text="opt.label ?? opt"
    >
      {{ opt.label ?? opt }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, String, Number, Boolean], default: null },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
