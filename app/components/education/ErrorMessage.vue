<template>
  <v-alert
    v-if="error"
    type="error"
    border="start"
    variant="tonal"
    density="comfortable"
    class="ma-2"
  >
    <div class="font-weight-medium mb-1">{{ $t('An error occurred') }}</div>
    <div class="text-body-2">{{ displayMessage }}</div>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ error: any }>()

const displayMessage = computed(() => {
  const responseError = props.error?.response?.data
  if (responseError?.error || responseError?.message) {
    return `${responseError?.error ?? ''} ${responseError?.message ?? ''}`.trim()
  }

  return props.error?.message ?? String(props.error)
})
</script>
