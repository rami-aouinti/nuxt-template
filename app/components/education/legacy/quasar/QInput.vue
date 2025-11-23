<template>
  <v-text-field
    v-model="model"
    :label="label"
    :type="type"
    :rules="rules"
    :error="error"
    :error-messages="errorMessages"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  type: { type: String, default: "text" },
  rules: { type: Array, default: () => [] },
  error: { type: Boolean, default: false },
  errorMessages: { type: [String, Array], default: "" },
})
const emit = defineEmits(["update:modelValue"])
const model = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})
</script>
