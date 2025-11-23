<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ uppy?: unknown }>()
</script>

<template>
  <div class="uppy-placeholder">
    <slot />
  </div>
</template>
