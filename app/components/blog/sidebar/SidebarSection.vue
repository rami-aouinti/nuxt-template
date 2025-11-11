<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  loggedIn: boolean
  loginMessage: string
  actionsClass?: string
}>()

const actionsClasses = computed(() => {
  const base = 'd-flex flex-column gap-3'
  if (!props.actionsClass || !props.actionsClass.trim().length) {
    return `${base} mt-6`
  }
  return `${base} ${props.actionsClass}`
})
</script>

<template>
  <div class="animated-badge mb-4">
    <span class="animated-badge__pulse" />
    {{ title }}
  </div>
  <p class="text-body-2 text-medium-emphasis mb-4">
    {{ description }}
  </p>
  <v-alert
    v-if="!loggedIn"
    type="info"
    variant="tonal"
    density="comfortable"
    class="mb-4"
  >
    {{ loginMessage }}
  </v-alert>
  <template v-else>
    <slot />
  </template>
  <div v-if="$slots.actions" :class="actionsClasses">
    <slot name="actions" />
  </div>
</template>
