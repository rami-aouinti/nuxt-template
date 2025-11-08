<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessengerStore } from '~/stores/messenger'
import type { ConversationSummary } from '~/types/messenger'

const messengerStore = useMessengerStore()
const { previews, unreadTotal, loading, error, isConnected } = storeToRefs(messengerStore)
const { loggedIn } = useUserSession()
const { t } = useI18n()
const localePath = useLocalePath()

const menu = ref(false)
const isInitialising = ref(false)

const hasConversations = computed(() => previews.value.length > 0)
const conversations = computed(() => previews.value)
const unreadCount = computed(() => unreadTotal.value)

const messengerLink = computed(() => localePath('messenger') ?? '/messenger')

const formatParticipants = (conversation: ConversationSummary) => {
  if (conversation.title && conversation.title.trim().length > 0) {
    return conversation.title
  }

  const names = conversation.participants
    .map((participant) => participant.displayName || participant.username)
    .filter((name) => typeof name === 'string' && name.trim().length > 0)

  if (names.length === 0) {
    return t('messenger.untitledConversation')
  }

  return names.join(', ')
}

const formatMessagePreview = (conversation: ConversationSummary) => {
  const lastMessage = conversation.lastMessage
  if (!lastMessage) {
    return t('messenger.noMessagesYet')
  }

  const senderName =
    lastMessage.sender.displayName || lastMessage.sender.username || t('messenger.someone')

  const text = lastMessage.text?.trim()

  if (text) {
    return `${senderName}: ${text}`
  }

  if (lastMessage.attachmentType) {
    return t('messenger.sharedAttachment', { sender: senderName })
  }

  if (lastMessage.mediaType) {
    return t('messenger.sharedMedia', { sender: senderName })
  }

  return senderName
}

const formatRelativeTime = (timestamp: string) => {
  if (!timestamp) {
    return ''
  }

  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = Date.now()
  const diff = date.getTime() - now

  const absoluteSeconds = Math.round(Math.abs(diff) / 1000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (absoluteSeconds < 60) {
    return rtf.format(Math.round(diff / 1000), 'second')
  }

  const absoluteMinutes = Math.round(Math.abs(diff) / 60000)
  if (absoluteMinutes < 60) {
    return rtf.format(Math.round(diff / 60000), 'minute')
  }

  const absoluteHours = Math.round(Math.abs(diff) / 3600000)
  if (absoluteHours < 24) {
    return rtf.format(Math.round(diff / 3600000), 'hour')
  }

  const absoluteDays = Math.round(Math.abs(diff) / 86400000)
  if (absoluteDays < 30) {
    return rtf.format(Math.round(diff / 86400000), 'day')
  }

  return date.toLocaleDateString()
}

const initialise = async () => {
  if (import.meta.server || !loggedIn.value || isInitialising.value) {
    return
  }

  isInitialising.value = true
  try {
    await messengerStore.initialise(3)
  } finally {
    isInitialising.value = false
  }
}

onMounted(() => {
  initialise()
})

watch(
  () => loggedIn.value,
  (logged) => {
    if (logged) {
      initialise()
    } else {
      messengerStore.teardown()
    }
  },
)

onBeforeUnmount(() => {
  if (!loggedIn.value) {
    messengerStore.teardown()
  }
})
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
          v-bind="props"
          :disabled="!loggedIn"
          :aria-label="t('messenger.ariaLabel', { unread: unreadCount })"
          size="small"
          variant="text"
        >
          <v-badge
            v-if="unreadCount > 0"
            :content="unreadCount"
            color="error"
            floating
          >
            <v-icon icon="mdi-message-text-outline" />
          </v-badge>
          <v-icon v-else icon="mdi-message-text-outline" />
        </v-btn>
      </template>
      <v-card elevation="6" width="360" class="messenger-card">
        <v-toolbar flat density="compact">
          <v-toolbar-title class="font-weight-light text-body-1">
            {{ t('messenger.title') }}
          </v-toolbar-title>
          <v-btn
            variant="text"
            size="small"
            :to="messengerLink"
            :text="t('messenger.viewAll')"
            @click="menu = false"
          />
        </v-toolbar>
        <div v-if="!loggedIn" class="messenger-status">
          <span>{{ t('messenger.loginRequired') }}</span>
        </div>
        <div v-else class="messenger-box">
          <div v-if="loading" class="messenger-loading">
            <v-progress-circular indeterminate size="24" class="mr-2" />
            <span>{{ t('messenger.loading') }}</span>
          </div>
          <div v-else-if="error" class="messenger-error">
            <v-icon icon="mdi-alert-circle-outline" size="18" class="mr-2" />
            <span>{{ error }}</span>
          </div>
          <template v-else>
            <div v-if="hasConversations" class="messenger-conversations">
              <v-list density="comfortable">
                <v-list-item
                  v-for="conversation in conversations"
                  :key="conversation.id"
                  class="messenger-item"
                >
                  <template #prepend>
                    <v-avatar size="36" color="primary" class="mr-3">
                      <span class="text-body-2">
                        {{ formatParticipants(conversation).slice(0, 2).toUpperCase() }}
                      </span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-subtitle-2 font-weight-medium">
                    {{ formatParticipants(conversation) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatMessagePreview(conversation) }}
                  </v-list-item-subtitle>
                  <template #append>
                    <div class="text-caption text-medium-emphasis ml-2">
                      {{ formatRelativeTime(conversation.updatedAt) }}
                    </div>
                    <v-badge
                      v-if="conversation.unreadCount > 0"
                      :content="conversation.unreadCount"
                      color="error"
                      inline
                      class="ml-2"
                    />
                  </template>
                </v-list-item>
              </v-list>
            </div>
            <div v-else class="messenger-empty">
              <span>{{ t('messenger.noConversations') }}</span>
            </div>
          </template>
          <div v-if="loggedIn" class="messenger-footer">
            <v-chip
              :color="isConnected ? 'success' : 'warning'"
              size="small"
              class="text-caption"
              variant="outlined"
            >
              <v-icon
                :icon="isConnected ? 'mdi-lightning-bolt' : 'mdi-cloud-alert'"
                size="16"
                class="mr-1"
              />
              {{ isConnected ? t('messenger.live') : t('messenger.reconnecting') }}
            </v-chip>
          </div>
        </div>
      </v-card>
    </v-menu>
  </ClientOnly>
</template>

<style scoped>
.messenger-card {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.messenger-box {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 12px;
  overflow-y: auto;
}

.messenger-conversations {
  max-height: 45vh;
  overflow-y: auto;
}

.messenger-item {
  border-radius: 8px;
}

.messenger-loading,
.messenger-error,
.messenger-empty,
.messenger-status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-align: center;
}

.messenger-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 12px 12px;
}
</style>
