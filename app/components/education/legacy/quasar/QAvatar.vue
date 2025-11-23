<template>
  <v-avatar
    :color="color"
    :size="size"
  >
    <v-icon v-if="icon" :icon="icon" />
    <slot />
  </v-avatar>
</template>

<script setup>
const props = defineProps({
  color: { type: String, default: "primary" },
  icon: { type: String, default: "" },
  textColor: { type: String, default: "" },
  size: { type: [Number, String], default: 40 },
})
</script>
