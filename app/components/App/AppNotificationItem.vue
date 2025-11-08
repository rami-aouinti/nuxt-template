<script setup lang="ts">
import type { Notification } from '~/stores/notification'

defineProps<{
  notification: Notification
}>()
const emit = defineEmits(['close'])
</script>

<template>
  <v-alert
    border="start"
    variant="tonal"
    density="compact"
    :type="notification.type"
    :text="notification.text"
    :title="notification.time.toLocaleString()"
  >
    <template #close>
      <v-btn icon="$close" @click="emit('close')" />
    </template>
  </v-alert>
</template>

<style scoped>
:deep(.v-alert-title) {
  line-height: 1.25rem;
  font-size: 14px;
  font-weight: 300;
}
</style>
