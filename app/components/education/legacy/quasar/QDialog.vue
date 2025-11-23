<template>
  <v-dialog
    v-model="model"
    persistent
  >
    <slot />
  </v-dialog>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(["update:modelValue"])
const model = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})
</script>
