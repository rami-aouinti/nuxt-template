<template>
  <v-progress-linear
    :model-value="value"
    :color="color"
    :height="height"
    striped
    rounded
  />
</template>

<script setup lang="ts">
const props = defineProps({
  value: { type: Number, default: 0 },
  color: { type: String, default: 'primary' },
  height: { type: [Number, String], default: 6 },
})
</script>
