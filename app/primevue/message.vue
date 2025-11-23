<template>
  <v-alert
    :type="severity"
    :variant="variant"
    :closable="closable"
    density="comfortable"
  >
    <slot>{{ text }}</slot>
  </v-alert>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  severity: { type: String, default: 'info' },
  variant: { type: String, default: 'tonal' },
  closable: { type: Boolean, default: false },
})
</script>
