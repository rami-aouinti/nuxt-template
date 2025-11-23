<template>
  <v-btn
    :color="color"
    :variant="variant"
    :density="dense ? 'compact' : undefined"
    :loading="loading"
    :disabled="disable"
    :size="size"
    :href="href"
    :icon="icon"
    @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  color: { type: String, default: "primary" },
  label: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
  outline: { type: Boolean, default: false },
  noCaps: { type: Boolean, default: false },
  icon: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
  size: { type: String, default: "default" },
  href: { type: String, default: null },
})

defineEmits(["click"])
const variant = computed(() => (props.flat ? "text" : props.outline ? "outlined" : "flat"))
</script>
