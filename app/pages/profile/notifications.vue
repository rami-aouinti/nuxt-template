<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FetchError } from 'ofetch'

import ProfilePageShell from '~/components/profile/ProfilePageShell.vue'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'

definePageMeta({
  title: 'navigation.profileNotifications',
  middleware: 'auth',
})

const NOTIFICATIONS_ENDPOINT = '/api/profile/notifications'

interface NotificationViewModel {
  id: string
  title: string
  description: string
  createdAt: Date | null
  isRead: boolean
}

const { t, locale } = useI18n()
const { loggedIn } = useAppUserSession()

const isAuthenticated = computed(() => Boolean(loggedIn.value))

const notifications = ref<NotificationViewModel[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)

const hasNotifications = computed(
  () => notifications.value.length > 0,
)

function ensureString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }

  return null
}

function ensureBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes'].includes(normalized)) {
      return true
    }
    if (['false', '0', 'no'].includes(normalized)) {
      return false
    }
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return null
    }
    return value !== 0
  }

  return null
}

function ensureDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'number' || typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof FetchError) {
    const data = error.data as Record<string, unknown> | undefined

    if (data?.message && typeof data.message === 'string') {
      return data.message
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && typeof error.message === 'string') {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return t('profile.notifications.states.error')
}

function extractNotificationId(
  record: Record<string, unknown>,
  index: number,
): string {
  const potentialKeys = [
    'id',
    'uuid',
    'notificationId',
    'notification_id',
    'key',
    'slug',
  ]

  for (const key of potentialKeys) {
    const value = record[key]
    const id = ensureString(value)
    if (id) {
      return id
    }
  }

  return `notification-${index}`
}

function extractNotificationTitle(record: Record<string, unknown>): string {
  const potentialKeys = ['title', 'subject', 'name', 'type']

  for (const key of potentialKeys) {
    const value = record[key]
    const title = ensureString(value)
    if (title) {
      return title
    }
  }

  return t('profile.notifications.fallback.title')
}

function extractNotificationDescription(record: Record<string, unknown>): string {
  const potentialKeys = [
    'message',
    'body',
    'description',
    'content',
    'text',
    'details',
  ]

  for (const key of potentialKeys) {
    const value = record[key]
    const description = ensureString(value)
    if (description) {
      return description
    }
  }

  return ''
}

function extractNotificationDate(record: Record<string, unknown>): Date | null {
  const potentialKeys = [
    'createdAt',
    'created_at',
    'created',
    'timestamp',
    'time',
    'sentAt',
    'sent_at',
    'publishedAt',
    'published_at',
    'date',
  ]

  for (const key of potentialKeys) {
    const value = record[key]
    const parsedDate = ensureDate(value)
    if (parsedDate) {
      return parsedDate
    }
  }

  return null
}

function extractNotificationReadStatus(
  record: Record<string, unknown>,
): boolean {
  const potentialKeys = [
    'isRead',
    'read',
    'seen',
    'is_read',
    'readAt',
    'read_at',
  ]

  for (const key of potentialKeys) {
    const value = record[key]

    if (key === 'readAt' || key === 'read_at') {
      const date = ensureDate(value)
      if (date) {
        return true
      }
      continue
    }

    const booleanValue = ensureBoolean(value)
    if (booleanValue !== null) {
      return booleanValue
    }
  }

  return false
}

function toNotificationViewModel(
  value: unknown,
  index: number,
): NotificationViewModel | null {
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>

    const id = extractNotificationId(record, index)
    const title = extractNotificationTitle(record)
    const description = extractNotificationDescription(record)
    const createdAt = extractNotificationDate(record)
    const isRead = extractNotificationReadStatus(record)

    return {
      id,
      title,
      description,
      createdAt,
      isRead,
    }
  }

  const fallbackDescription = ensureString(value)
  if (fallbackDescription) {
    return {
      id: `notification-${index}`,
      title: t('profile.notifications.fallback.title'),
      description: fallbackDescription,
      createdAt: null,
      isRead: false,
    }
  }

  return null
}

function extractNotifications(payload: unknown): NotificationViewModel[] {
  if (!payload) {
    return []
  }

  const candidates: unknown[] = []

  if (Array.isArray(payload)) {
    candidates.push(...payload)
  } else if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    const listKeys = ['notifications', 'data', 'items', 'results']

    for (const key of listKeys) {
      const value = record[key]
      if (Array.isArray(value)) {
        candidates.push(...value)
      }
    }

    if (candidates.length === 0) {
      candidates.push(record)
    }
  }

  return candidates
    .map((candidate, index) => toNotificationViewModel(candidate, index))
    .filter((item): item is NotificationViewModel => Boolean(item))
}

async function loadNotifications() {
  if (import.meta.server) {
    return
  }

  if (!isAuthenticated.value || isLoading.value) {
    return
  }

  isLoading.value = true
  loadError.value = null

  try {
    const response = await $fetch<unknown>(NOTIFICATIONS_ENDPOINT, {
      headers: {
        accept: 'application/json',
      },
      credentials: 'include',
    })

    notifications.value = extractNotifications(response)
  } catch (error) {
    loadError.value = resolveErrorMessage(error)
    notifications.value = []
  } finally {
    isLoading.value = false
  }
}

if (import.meta.client) {
  watch(
    isAuthenticated,
    (ready) => {
      if (ready) {
        loadNotifications()
      } else {
        notifications.value = []
        loadError.value = null
      }
    },
    { immediate: true },
  )

}

function formatNotificationTimestamp(date: Date) {
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
</script>

<template>
  <ProfilePageShell>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <AppCard
          class="profile-notifications"
          :title="t('profile.notifications.page.title')"
          :subtitle="t('profile.notifications.page.subtitle')"
        >
          <template #actions>
            <AppButton
              variant="text"
              size="small"
              prepend-icon="mdi-refresh"
              :loading="isLoading"
              :disabled="isLoading"
              @click="loadNotifications"
            >
              {{ t('profile.notifications.actions.refresh') }}
            </AppButton>
          </template>

          <div class="profile-notifications__content">
            <div v-if="isLoading" class="profile-notifications__state">
              <v-progress-circular indeterminate color="primary" size="32" />
              <span>{{ t('profile.notifications.states.loading') }}</span>
            </div>

            <div
              v-else-if="loadError"
              class="profile-notifications__state profile-notifications__state--error"
            >
              <span>{{ loadError }}</span>
              <AppButton
                variant="tonal"
                size="small"
                prepend-icon="mdi-refresh"
                @click="loadNotifications"
              >
                {{ t('profile.notifications.states.retry') }}
              </AppButton>
            </div>

            <div v-else-if="hasNotifications" class="profile-notifications__list">
              <v-list density="comfortable" class="profile-notifications__v-list">
                <template v-for="(notification, index) in notifications" :key="notification.id">
                  <v-list-item class="profile-notifications__item">
                    <template #prepend>
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon
                          :icon="
                            notification.isRead ? 'mdi-bell-outline' : 'mdi-bell-ring'
                          "
                        />
                      </v-avatar>
                    </template>

                    <div class="profile-notifications__item-content">
                      <div class="profile-notifications__item-header">
                        <span class="profile-notifications__item-title">
                          {{ notification.title }}
                        </span>
                        <v-chip
                          v-if="!notification.isRead"
                          color="primary"
                          variant="tonal"
                          size="x-small"
                        >
                          {{ t('profile.notifications.labels.unread') }}
                        </v-chip>
                      </div>

                      <p
                        v-if="notification.description"
                        class="profile-notifications__item-description"
                      >
                        {{ notification.description }}
                      </p>

                      <span
                        v-if="notification.createdAt"
                        class="profile-notifications__item-timestamp"
                      >
                        {{
                          t('profile.notifications.labels.receivedAt', {
                            date: formatNotificationTimestamp(notification.createdAt),
                          })
                        }}
                      </span>
                    </div>
                  </v-list-item>

                  <v-divider
                    v-if="index < notifications.length - 1"
                    class="profile-notifications__divider"
                    inset
                  />
                </template>
              </v-list>
            </div>

            <div v-else class="profile-notifications__state">
              <v-icon icon="mdi-bell-off" size="36" color="primary" />
              <span>{{ t('profile.notifications.states.empty') }}</span>
            </div>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </ProfilePageShell>
</template>

<style scoped>
.profile-notifications__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-notifications__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 32px 16px;
  color: rgba(var(--v-theme-on-surface), 0.68);
}

.profile-notifications__state--error {
  color: rgba(var(--v-theme-error), 0.9);
}

.profile-notifications__list {
  width: 100%;
}

.profile-notifications__v-list {
  background-color: transparent !important;
  padding: 0;
}

.profile-notifications__item {
  padding: 16px 0;
}

.profile-notifications__item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-notifications__item-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-notifications__item-title {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.profile-notifications__item-description {
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.75);
  white-space: pre-wrap;
}

.profile-notifications__item-timestamp {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.profile-notifications__divider {
  margin-inline-start: 72px;
}
</style>
