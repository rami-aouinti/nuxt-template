<template>
  <v-alert
    v-if="message"
    border="start"
    color="error"
    density="comfortable"
    icon="mdi-alert-circle-outline"
    role="alert"
    variant="tonal"
  >
    <div class="font-weight-semibold mb-1">{{ headline }}</div>
    <div class="text-body-2">{{ message }}</div>
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ error: Error & { response?: any } }>()

const headline = computed(
  () => props.error?.response?.data?.error || props.error?.name || 'Erreur',
)

const message = computed(
  () => props.error?.response?.data?.message || props.error?.message || '',
)
</script>
