<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessengerApi } from '~/composables/useMessengerApi'
import { useMessengerStore } from '~/stores/messenger'
import type {
  ConversationSummary,
  MessengerMessageSummary,
  MessengerUserSummary,
} from '~/types/messenger'
import { Notify } from '~/stores/notification'
import type { PublicProfileData } from '~/types/profile'
import AppCard from '~/components/ui/AppCard.vue'
import AppButton from '~/components/ui/AppButton.vue'
import AppList from '~/components/ui/AppList.vue'

definePageMeta({
  title: 'navigation.messenger',
  middleware: 'auth',
  drawerIndex: 2,
})

const { t } = useI18n()
const messengerApi = useMessengerApi()
const messengerStore = useMessengerStore()
const { lastEvent } = storeToRefs(messengerStore)
const { session } = useAppUserSession()
const route = useRoute()
const router = useRouter()

const conversations = ref<ConversationSummary[]>([])
const selectedConversationId = ref<string>('')
const messages = ref<MessengerMessageSummary[]>([])
const isLoadingConversations = ref(true)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const messageInput = ref('')
const messageCursor = ref<string | null>(null)
const hasMoreMessages = ref(false)
const isUpdatingRoute = ref(false)

const currentUserId = computed(() => session.value?.profile?.id ?? '')

const fallbackSender = computed<MessengerUserSummary>(() => {
  const profile = session.value?.profile as PublicProfileData | null | undefined

  const firstName =
    typeof profile?.firstName === 'string' ? profile.firstName.trim() : ''
  const lastName =
    typeof profile?.lastName === 'string' ? profile.lastName.trim() : ''
  const username =
    typeof profile?.username === 'string' ? profile.username.trim() : ''

  const displayName =
    [firstName, lastName].filter((part) => part.length > 0).join(' ') ||
    username

  let avatarUrl: string | null = null
  const photo =
    typeof profile?.photo === 'string' && profile.photo.trim().length > 0
      ? profile.photo.trim()
      : null

  if (photo) {
    avatarUrl = photo
  } else if (profile?.profile && typeof profile.profile === 'object') {
    const record = profile.profile as Record<string, unknown>
    const candidate =
      typeof record.avatarUrl === 'string'
        ? record.avatarUrl
        : typeof record.avatar === 'string'
          ? record.avatar
          : null

    avatarUrl =
      candidate && candidate.trim().length > 0 ? candidate.trim() : null
  }

  return {
    id: currentUserId.value,
    username,
    displayName: displayName.length > 0 ? displayName : null,
    avatarUrl,
  }
})

const resolveSender = (sender: MessengerUserSummary): MessengerUserSummary => {
  const fallback = fallbackSender.value

  const senderDisplayName =
    typeof sender.displayName === 'string' ? sender.displayName.trim() : ''
  const fallbackDisplayName =
    typeof fallback.displayName === 'string' ? fallback.displayName.trim() : ''

  const resolvedDisplayName =
    senderDisplayName.length > 0
      ? senderDisplayName
      : fallbackDisplayName.length > 0
        ? fallbackDisplayName
        : null

  const senderUsername = sender.username?.trim() ?? ''
  const fallbackUsername = fallback.username?.trim() ?? ''

  const resolvedUsername =
    senderUsername.length > 0 ? senderUsername : fallbackUsername

  const resolvedId =
    sender.id && sender.id.trim().length > 0 ? sender.id : fallback.id

  const avatarUrl =
    sender.avatarUrl && sender.avatarUrl.trim().length > 0
      ? sender.avatarUrl.trim()
      : (fallback.avatarUrl ?? null)

  return {
    id: resolvedId,
    username: resolvedUsername,
    displayName: resolvedDisplayName,
    avatarUrl,
  }
}

const prepareMessage = (
  message: MessengerMessageSummary,
  fallbackText?: string,
  fallbackConversationId?: string,
): MessengerMessageSummary => ({
  ...message,
  conversationId:
    message.conversationId && message.conversationId.length > 0
      ? message.conversationId
      : (fallbackConversationId ?? selectedConversationId.value),
  text: message.text ?? fallbackText ?? null,
  sender: resolveSender(message.sender),
})

const normalizeConversationSummaryData = (
  conversation: ConversationSummary,
): ConversationSummary => ({
  ...conversation,
  lastMessage: conversation.lastMessage
    ? prepareMessage(conversation.lastMessage, undefined, conversation.id)
    : (conversation.lastMessage ?? null),
})

const getSenderName = (sender: MessengerUserSummary) => {
  const displayName = sender.displayName?.trim()
  const username = sender.username?.trim()

  return displayName?.length
    ? displayName
    : username?.length
      ? username
      : t('messenger.someone')
}

const getSenderInitials = (sender: MessengerUserSummary) => {
  const name = getSenderName(sender)
  const words = name.split(/\s+/).filter((word) => word.length > 0)

  if (words.length === 0) {
    return '?'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  const first = words[0][0]
  const last = words[words.length - 1][0]
  return `${first}${last}`.toUpperCase()
}

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const secondsDiff = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / 1000),
  )

  if (secondsDiff < 5) {
    return 'Just now'
  }

  if (secondsDiff < 60) {
    return `${secondsDiff}s ago`
  }

  const minutes = Math.floor(secondsDiff / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days}d ago`
  }

  const weeks = Math.floor(days / 7)
  if (weeks < 5) {
    return `${weeks}w ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months}mo ago`
  }

  const years = Math.floor(days / 365)
  return `${years}y ago`
}

const selectedConversation = computed(
  () =>
    conversations.value.find(
      (conversation) => conversation.id === selectedConversationId.value,
    ) ?? null,
)

const isInitialConversationLoading = computed(
  () => isLoadingConversations.value && conversations.value.length === 0,
)

const sortedMessages = computed(() =>
  messages.value.slice().sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()
    return aTime - bTime
  }),
)

const getRouteConversationId = () => {
  const value = route.query.conversationId
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return typeof value === 'string' ? value : ''
}

const updateRouteConversationId = async (conversationId: string) => {
  const normalized = conversationId.trim()
  const current = getRouteConversationId()

  if (normalized === current) {
    return
  }

  const query = { ...route.query }
  if (normalized) {
    query.conversationId = normalized
  } else {
    delete query.conversationId
  }

  isUpdatingRoute.value = true
  try {
    await router.replace({ query })
  } finally {
    isUpdatingRoute.value = false
  }
}

const canSendMessage = computed(
  () =>
    Boolean(selectedConversationId.value) &&
    messageInput.value.trim().length > 0 &&
    !isSending.value,
)

const loadConversations = async () => {
  isLoadingConversations.value = true
  try {
    const response = await messengerApi.fetchConversations({ limit: 30 })
    const normalizedItems = response.items.map(normalizeConversationSummaryData)
    conversations.value = normalizedItems

    const routeConversationId = getRouteConversationId()

    if (routeConversationId) {
      selectedConversationId.value = routeConversationId
    } else if (
      !selectedConversationId.value &&
      conversations.value.length > 0
    ) {
      selectedConversationId.value = conversations.value[0].id
      void updateRouteConversationId(selectedConversationId.value)
    } else if (conversations.value.length === 0) {
      selectedConversationId.value = ''
      messages.value = []
      void updateRouteConversationId('')
    }
  } catch (error) {
    Notify.error(error)
  } finally {
    isLoadingConversations.value = false
  }
}

const upsertConversation = (conversation: ConversationSummary) => {
  const normalized = normalizeConversationSummaryData(conversation)
  const existingIndex = conversations.value.findIndex(
    (item) => item.id === normalized.id,
  )
  if (existingIndex !== -1) {
    conversations.value.splice(existingIndex, 1)
  }

  conversations.value.unshift(normalized)
}

const removeConversation = (conversationId: string) => {
  conversations.value = conversations.value.filter(
    (conversation) => conversation.id !== conversationId,
  )

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
    const response =
      await messengerApi.fetchConversationMessages(conversationId)
    messages.value = response.items.map((item) =>
      prepareMessage(item, undefined, conversationId),
    )
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
    const response = await messengerApi.fetchConversationMessages(
      selectedConversationId.value,
      {
        cursor: messageCursor.value,
        direction: 'backward',
      },
    )
    messages.value = [
      ...response.items.map((item) =>
        prepareMessage(item, undefined, selectedConversationId.value),
      ),
      ...messages.value,
    ]
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
    const message = await messengerApi.sendMessage(
      selectedConversationId.value,
      { text },
    )
    messages.value = [
      ...messages.value,
      prepareMessage(message, text, selectedConversationId.value),
    ]
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
  if (!conversationId) {
    return
  }

  if (selectedConversationId.value === conversationId) {
    return
  }

  selectedConversationId.value = conversationId
  await updateRouteConversationId(conversationId)
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
        messages.value = [
          ...messages.value,
          prepareMessage(event.message, undefined, event.conversation.id),
        ]
        void messengerApi.markConversationAsRead(event.conversation.id, {
          messageId: event.message.id,
        })
      }
    } else if (event.type === 'conversation.updated') {
      upsertConversation(event.conversation)
    } else if (event.type === 'message.read') {
      const conversation = conversations.value.find(
        (item) => item.id === event.conversationId,
      )
      if (conversation) {
        conversation.unreadCount = event.unreadCount
      }
    } else if (event.type === 'conversation.deleted') {
      removeConversation(event.conversationId)
    }
  },
  { deep: false },
)

watch(
  () => route.query.conversationId,
  async () => {
    if (isUpdatingRoute.value) {
      return
    }

    const conversationId = getRouteConversationId()
    if (conversationId && conversationId !== selectedConversationId.value) {
      selectedConversationId.value = conversationId
      await loadMessages(conversationId)
    } else if (!conversationId) {
      if (conversations.value.length > 0) {
        const firstId = conversations.value[0].id
        selectedConversationId.value = firstId
        await updateRouteConversationId(firstId)
        await loadMessages(firstId)
      } else {
        selectedConversationId.value = ''
        messages.value = []
      }
    }
  },
)

onMounted(async () => {
  await loadConversations()
  const initialConversationId =
    getRouteConversationId() || selectedConversationId.value

  if (initialConversationId) {
    selectedConversationId.value = initialConversationId
    await updateRouteConversationId(initialConversationId)
    await loadMessages(initialConversationId)
  }
  await messengerStore.initialise(3)
})
</script>

<template>
  <v-container fluid class="messenger-page">
    <client-only>
      <teleport to="#app-drawer">
        <v-toolbar density="compact" variant="text">
          <v-toolbar-title class="text-subtitle-1 font-weight-medium">
            {{ t('messenger.conversations') }}
          </v-toolbar-title>
          <AppButton
            icon
            size="small"
            :loading="isLoadingConversations"
            @click="loadConversations"
          >
            <v-icon>mdi-refresh</v-icon>
          </AppButton>
        </v-toolbar>
        <v-divider />
        <div class="conversation-scroll">
          <template v-if="isInitialConversationLoading">
            <v-skeleton-loader
              v-for="index in 5"
              :key="index"
              type="list-item-two-line"
              class="conversation-skeleton"
            />
          </template>
          <template v-else>
            <AppList density="comfortable" lines="two">
              <v-list-item
                v-for="conversation in conversations"
                :key="conversation.id"
                class="stat-card d-flex align-center gap-3 mb-3 w-100 px-3"
                :active="conversation.id === selectedConversationId"
                @click="handleSelectConversation(conversation.id)"
              >
                <v-list-item-title>
                  {{ formatConversationTitle(conversation) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    conversation.lastMessage?.text ||
                    t('messenger.noMessagesYet')
                  }}
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
            </AppList>
            <div v-if="!conversations.length" class="empty-state">
              {{ t('messenger.noConversations') }}
            </div>
          </template>
        </div>
      </teleport>
    </client-only>
    <client-only>
      <teleport to="#app-drawer-right" />
    </client-only>
    <v-row>
      <v-col cols="12">
        <AppCard class="message-panel" variant="text">
          <template v-if="isInitialConversationLoading">
            <div class="message-skeleton">
              <div class="message-skeleton__toolbar">
                <v-skeleton-loader
                  type="text"
                  class="message-skeleton__title"
                />
              </div>
              <v-divider />
              <div class="message-history">
                <v-skeleton-loader
                  v-for="index in 4"
                  :key="index"
                  type="list-item-three-line"
                  class="message-history__skeleton"
                />
              </div>
              <v-divider />
              <div class="message-input">
                <v-skeleton-loader
                  type="paragraph"
                  class="message-input__skeleton"
                />
                <div class="message-actions">
                  <v-skeleton-loader
                    type="button"
                    class="message-actions__skeleton"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="selectedConversation">
            <v-toolbar flat density="compact">
              <v-toolbar-title class="text-subtitle-1 font-weight-medium">
                {{ formatConversationTitle(selectedConversation) }}
              </v-toolbar-title>
            </v-toolbar>
            <v-divider />
            <div class="message-history">
              <div v-if="hasMoreMessages" class="load-more">
                <AppButton
                  size="small"
                  variant="text"
                  :loading="isLoadingMessages"
                  @click="loadMoreMessages"
                >
                  {{ t('messenger.loadPrevious') }}
                </AppButton>
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
                    'message-item--outgoing':
                      message.sender.id === currentUserId,
                    'message-item--incoming':
                      message.sender.id !== currentUserId,
                  }"
                >
                  <AppAvatar
                    class="message-avatar"
                    :src="message.sender.avatarUrl"
                    :alt="getSenderName(message.sender)"
                    size="36"
                  >
                    <template #fallback>
                      <span>{{ getSenderInitials(message.sender) }}</span>
                    </template>
                  </AppAvatar>
                  <div class="message-body">
                    <div class="message-header">
                      <span class="message-author">
                        {{ getSenderName(message.sender) }}
                      </span>
                      <span class="message-time">
                        {{ formatRelativeTime(message.createdAt) }}
                      </span>
                    </div>
                    <div class="message-content">
                      {{ message.text || t('messenger.unsupportedContent') }}
                    </div>
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
                <AppButton
                  color="primary"
                  :disabled="!canSendMessage"
                  :loading="isSending"
                  @click="sendMessage"
                >
                  {{ t('messenger.send') }}
                </AppButton>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              {{ t('messenger.selectConversation') }}
            </div>
          </template>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped src="~/assets/styles/pages/messenger/index.css"></style>
