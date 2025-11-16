<script setup lang="ts">
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const appNotifications = computed(() =>
  notifications.value.filter((notification) => notification.source !== 'mercure'),
)
const notificationsShown = computed(() => [...appNotifications.value].reverse())

function deleteNotification(id: number) {
  notificationStore.delNotification(id)
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="notification-float" aria-live="polite" aria-atomic="true">
        <v-slide-y-transition group>
          <div
            v-for="notification in notificationsShown"
            :key="`float-${notification.id}`"
            class="notification-float__item"
          >
            <AppNotificationItem
              :notification="notification"
              class="notification-item"
              @close="deleteNotification(notification.id)"
            />
          </div>
        </v-slide-y-transition>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.notification-item {
  width: 100%;
}

.notification-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: min(360px, calc(100vw - 32px));
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1100;
  pointer-events: none;
}

.notification-float__item {
  pointer-events: auto;
}
</style>
