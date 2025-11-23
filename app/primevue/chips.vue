<template>
  <v-combobox
    v-model="model"
    :label="label"
    multiple
    chips
    closable-chips
    hide-selected
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: "" },
})
const emit = defineEmits(["update:modelValue"])
const model = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})
</script>
