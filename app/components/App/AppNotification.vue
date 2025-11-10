<script setup lang="ts">
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const notificationsShown = computed(() => [...notifications.value].reverse())
const menu = ref(false)
const { loggedIn } = useUserSession()
function deleteNotification(id: number) {
  notificationStore.delNotification(id)
}
function emptyNotifications() {
  notificationStore.$reset()
}
const hasNotifications = computed(() => notificationsShown.value.length > 0)
</script>

<template>
  <ClientOnly>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom end"
      :offset="[0, 12]"
    >
      <template #activator="{ props }">
        <v-btn
          v-tooltip="{ text: 'Notifications' }"
          :disabled="!loggedIn"
          v-bind="props"
          :aria-label="
            notifications.length ? 'Notifications (new)' : 'Notifications'
          "
          variant="text"
          class="dock-navbar__action-button"
        >
          <v-badge
            v-if="notifications.length > 0"
            :content="notifications.length"
            color="error"
            floating
          >
            <v-icon icon="mdi-bell-badge-outline" />
          </v-badge>
          <v-icon v-else icon="mdi-bell-outline" />
        </v-btn>
      </template>
      <v-card elevation="6" width="360" class="notification-card">
        <v-toolbar flat density="compact">
          <v-toolbar-title
            class="font-weight-light text-body-1"
            :text="hasNotifications ? 'Notifications' : 'No New Notifications'"
          />
          <v-btn
            v-tooltip="{ text: 'Clear All Notifications' }"
            size="small"
            icon="mdi-broom"
            :disabled="!hasNotifications"
            @click="emptyNotifications"
          />
        </v-toolbar>
        <div class="notification-box">
          <v-slide-y-reverse-transition group hide-on-leave>
            <div
              v-for="notification in notificationsShown"
              :key="notification.id"
              class="notification-item-wrapper"
            >
              <AppNotificationItem
                :notification="notification"
                class="notification-item"
                @close="deleteNotification(notification.id)"
              />
            </div>
          </v-slide-y-reverse-transition>
          <div v-if="!hasNotifications" class="notification-empty">
            <span>No notifications to display.</span>
          </div>
        </div>
      </v-card>
    </v-menu>
  </ClientOnly>
</template>

<style scoped>
.dock-navbar__action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 9999px;
}

.dock-navbar__action-button :deep(.v-icon) {
  font-size: 22px;
}

.dock-navbar__action-button :deep(.v-badge__badge) {
  font-size: 0.7rem;
}

.notification-card {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.notification-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  overflow-y: auto;
}

.notification-item-wrapper {
  display: contents;
}

.notification-item {
  width: 100%;
}

.notification-empty {
  display: flex;
  justify-content: center;
  padding: 24px 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}
</style>
