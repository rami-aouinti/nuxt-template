<template>
  <v-chip :color="color" :variant="variant" v-bind="$attrs">
    <slot />
  </v-chip>
</template>

<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: 'primary' },
  variant: { type: String, default: 'tonal' },
})
</script>
