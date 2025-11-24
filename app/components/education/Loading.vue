<template>
  <v-overlay
    :model-value="visible"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular color="primary" indeterminate size="64" width="6" />
  </v-overlay>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
</script>
