<script setup lang="ts">
import { mergeProps } from 'vue'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const notificationsShown = computed(() => [...notifications.value].reverse())
const menu = ref(false)
const { loggedIn } = useAppUserSession()
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
        <v-tooltip text="Notifications" aria-label="Notifications">
          <template #activator="{ props: tooltip }">
            <v-btn
              icon
              :disabled="!loggedIn"
              v-bind="mergeProps(props, tooltip)"
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
        </v-tooltip>
      </template>
      <v-card elevation="6" width="360" class="notification-card">
        <v-toolbar  style="background-color: transparent" density="comfortable">
          <v-toolbar-title
            class="font-weight-light text-body-1"
            :text="hasNotifications ? 'Notifications' : 'No New Notifications'"
          />
          <v-tooltip
            text="Clear All Notifications"
            aria-label="Clear All Notifications"
          >
            <template #activator="{ props: tooltip }">
              <v-btn
                size="small"
                icon="mdi-broom"
                :disabled="!hasNotifications"
                v-bind="tooltip"
                @click="emptyNotifications"
              />
            </template>
          </v-tooltip>
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
    <template #fallback>
      <span class="dock-navbar__action-placeholder" aria-hidden="true" />
    </template>
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

.notification-float {
  position: fixed;
  top: 24px;
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

.notification-empty {
  display: flex;
  justify-content: center;
  padding: 24px 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}

.dock-navbar__action-placeholder {
  display: inline-flex;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  pointer-events: none;
  flex-shrink: 0;
}
</style>
