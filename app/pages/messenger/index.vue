<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessengerApi } from '~/composables/useMessengerApi'
import { useMessengerStore } from '~/stores/messenger'
import type {
  ConversationSummary,
  MessengerMessageSummary,
} from '~/types/messenger'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.messenger',
  middleware: 'auth',
  drawerIndex: 2,
})

const { t } = useI18n()
const messengerApi = useMessengerApi()
const messengerStore = useMessengerStore()
const { lastEvent } = storeToRefs(messengerStore)
const { session } = useUserSession()

const conversations = ref<ConversationSummary[]>([])
const selectedConversationId = ref<string>('')
const messages = ref<MessengerMessageSummary[]>([])
const isLoadingConversations = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const messageInput = ref('')
const messageCursor = ref<string | null>(null)
const hasMoreMessages = ref(false)

const currentUserId = computed(() => session.value?.profile?.id ?? '')

const selectedConversation = computed(() =>
  conversations.value.find((conversation) => conversation.id === selectedConversationId.value) ?? null,
)

const sortedMessages = computed(() => messages.value.slice().sort((a, b) => {
  const aTime = new Date(a.createdAt).getTime()
  const bTime = new Date(b.createdAt).getTime()
  return aTime - bTime
}))

const canSendMessage = computed(
  () => Boolean(selectedConversationId.value) && messageInput.value.trim().length > 0 && !isSending.value,
)

const loadConversations = async () => {
  isLoadingConversations.value = true
  try {
    const response = await messengerApi.fetchConversations({ limit: 30 })
    conversations.value = response.items

    if (!selectedConversationId.value && conversations.value.length > 0) {
      selectedConversationId.value = conversations.value[0].id
    }
  } catch (error) {
    Notify.error(error)
  } finally {
    isLoadingConversations.value = false
  }
}

const upsertConversation = (conversation: ConversationSummary) => {
  const existingIndex = conversations.value.findIndex((item) => item.id === conversation.id)
  if (existingIndex !== -1) {
    conversations.value.splice(existingIndex, 1)
  }

  conversations.value.unshift(conversation)
}

const removeConversation = (conversationId: string) => {
  conversations.value = conversations.value.filter((conversation) => conversation.id !== conversationId)

  if (selectedConversationId.value === conversationId) {
    selectedConversationId.value = conversations.value[0]?.id ?? ''
    if (selectedConversationId.value) {
      void loadMessages(selectedConversationId.value)
    } else {
      messages.value = []
    }
  }
}

const formatConversationTitle = (conversation: ConversationSummary | null) => {
  if (!conversation) {
    return ''
  }

  if (conversation.title && conversation.title.trim().length > 0) {
    return conversation.title
  }

  const participants = conversation.participants
    .map((participant) => participant.displayName || participant.username)
    .filter((name) => typeof name === 'string' && name.trim().length > 0)

  if (participants.length === 0) {
    return t('messenger.untitledConversation')
  }

  return participants.join(', ')
}

const loadMessages = async (conversationId: string) => {
  isLoadingMessages.value = true
  try {
    const response = await messengerApi.fetchConversationMessages(conversationId)
    messages.value = response.items
    messageCursor.value = response.previousCursor ?? null
    hasMoreMessages.value = Boolean(response.previousCursor)

    if (messages.value.length > 0) {
      const lastMessage = messages.value[messages.value.length - 1]
      await messengerApi.markConversationAsRead(conversationId, {
        messageId: lastMessage.id,
      })
    }
  } catch (error) {
    Notify.error(error)
  } finally {
    isLoadingMessages.value = false
  }
}

const loadMoreMessages = async () => {
  if (!selectedConversationId.value || !messageCursor.value) {
    return
  }

  isLoadingMessages.value = true
  try {
    const response = await messengerApi.fetchConversationMessages(selectedConversationId.value, {
      cursor: messageCursor.value,
      direction: 'backward',
    })
    messages.value = [...response.items, ...messages.value]
    messageCursor.value = response.previousCursor ?? null
    hasMoreMessages.value = Boolean(response.previousCursor)
  } catch (error) {
    Notify.error(error)
  } finally {
    isLoadingMessages.value = false
  }
}

const sendMessage = async () => {
  if (!canSendMessage.value || !selectedConversationId.value) {
    return
  }

  isSending.value = true
  const text = messageInput.value.trim()
  try {
    const message = await messengerApi.sendMessage(selectedConversationId.value, { text })
    messages.value = [...messages.value, message]
    messageInput.value = ''
    await loadConversations()
    await messengerApi.markConversationAsRead(selectedConversationId.value, {
      messageId: message.id,
    })
  } catch (error) {
    Notify.error(error)
  } finally {
    isSending.value = false
  }
}

const handleSelectConversation = async (conversationId: string) => {
  if (selectedConversationId.value === conversationId) {
    return
  }

  selectedConversationId.value = conversationId
  await loadMessages(conversationId)
}

watch(
  () => lastEvent.value,
  (record) => {
    if (!record) {
      return
    }

    const { event } = record

    if (event.type === 'message.created') {
      upsertConversation(event.conversation)

      if (event.conversation.id === selectedConversationId.value) {
        messages.value = [...messages.value, event.message]
        void messengerApi.markConversationAsRead(event.conversation.id, {
          messageId: event.message.id,
        })
      }
    } else if (event.type === 'conversation.updated') {
      upsertConversation(event.conversation)
    } else if (event.type === 'message.read') {
      const conversation = conversations.value.find((item) => item.id === event.conversationId)
      if (conversation) {
        conversation.unreadCount = event.unreadCount
      }
    } else if (event.type === 'conversation.deleted') {
      removeConversation(event.conversationId)
    }
  },
  { deep: false },
)

onMounted(async () => {
  await loadConversations()
  if (selectedConversationId.value) {
    await loadMessages(selectedConversationId.value)
  }
  await messengerStore.initialise(3)
})
</script>

<template>
  <v-container fluid class="messenger-page">
    <v-row>
      <v-col cols="12" md="4" class="pr-md-4">
        <v-card class="conversation-list" elevation="2">
          <v-toolbar flat density="compact">
            <v-toolbar-title class="text-subtitle-1 font-weight-medium">
              {{ t('messenger.conversations') }}
            </v-toolbar-title>
            <v-btn icon="mdi-refresh" size="small" :loading="isLoadingConversations" @click="loadConversations" />
          </v-toolbar>
          <v-divider />
          <div class="conversation-scroll">
            <v-list nav density="comfortable">
              <v-list-item
                v-for="conversation in conversations"
                :key="conversation.id"
                :active="conversation.id === selectedConversationId"
                @click="handleSelectConversation(conversation.id)"
              >
                <v-list-item-title>
                  {{ formatConversationTitle(conversation) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ conversation.lastMessage?.text || t('messenger.noMessagesYet') }}
                </v-list-item-subtitle>
                <template #append>
                  <v-badge
                    v-if="conversation.unreadCount > 0"
                    :content="conversation.unreadCount"
                    color="error"
                    inline
                  />
                </template>
              </v-list-item>
            </v-list>
            <div v-if="!conversations.length && !isLoadingConversations" class="empty-state">
              {{ t('messenger.noConversations') }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" class="mt-4 mt-md-0">
        <v-card class="message-panel" elevation="2">
          <template v-if="selectedConversation">
            <v-toolbar flat density="compact">
              <v-toolbar-title class="text-subtitle-1 font-weight-medium">
                {{ formatConversationTitle(selectedConversation) }}
              </v-toolbar-title>
            </v-toolbar>
            <v-divider />
            <div class="message-history">
              <div v-if="hasMoreMessages" class="load-more">
                <v-btn
                  size="small"
                  variant="text"
                  :loading="isLoadingMessages"
                  @click="loadMoreMessages"
                >
                  {{ t('messenger.loadPrevious') }}
                </v-btn>
              </div>
              <div v-if="isLoadingMessages" class="loading-state">
                <v-progress-circular indeterminate size="32" />
              </div>
              <template v-else>
                <div
                  v-for="message in sortedMessages"
                  :key="message.id"
                  class="message-item"
                  :class="{
                    'message-item--outgoing': message.sender.id === currentUserId,
                    'message-item--incoming': message.sender.id !== currentUserId,
                  }"
                >
                  <div class="message-metadata">
                    <span class="message-author">{{ message.sender.displayName || message.sender.username }}</span>
                    <span class="message-time">{{ new Date(message.createdAt).toLocaleString() }}</span>
                  </div>
                  <div class="message-content">
                    {{ message.text || t('messenger.unsupportedContent') }}
                  </div>
                </div>
              </template>
            </div>
            <v-divider />
            <div class="message-input">
              <v-textarea
                v-model="messageInput"
                :label="t('messenger.messagePlaceholder')"
                :disabled="!selectedConversation || isSending"
                auto-grow
                rows="1"
                clearable
              />
              <div class="message-actions">
                <v-btn
                  color="primary"
                  :disabled="!canSendMessage"
                  :loading="isSending"
                  @click="sendMessage"
                >
                  {{ t('messenger.send') }}
                </v-btn>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              {{ t('messenger.selectConversation') }}
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.messenger-page {
  padding-top: 16px;
  padding-bottom: 16px;
}

.conversation-list,
.message-panel {
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
}

.conversation-scroll {
  flex: 1;
  overflow-y: auto;
}

.message-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  max-width: 70%;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-on-surface), 0.05);
}

.message-item--outgoing {
  align-self: flex-end;
  background-color: rgba(var(--v-theme-primary), 0.15);
}

.message-item--incoming {
  align-self: flex-start;
}

.message-metadata {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 6px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-input {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  text-align: center;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
</style>
