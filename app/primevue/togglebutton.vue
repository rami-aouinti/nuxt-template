<template>
  <v-btn
    :color="model ? activeColor : inactiveColor"
    :variant="model ? 'flat' : 'outlined'"
    @click="model = !model"
  >
    <slot>{{ model ? onLabel : offLabel }}</slot>
  </v-btn>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: false },
  onLabel: { type: String, default: "On" },
  offLabel: { type: String, default: "Off" },
  onIcon: { type: String, default: "" },
  offIcon: { type: String, default: "" },
  activeColor: { type: String, default: "primary" },
  inactiveColor: { type: String, default: "grey" },
})
const emit = defineEmits(["update:modelValue"])
const model = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})
</script>
