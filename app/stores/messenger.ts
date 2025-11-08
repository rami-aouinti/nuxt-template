import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ConversationSummary,
  MessengerMercureEvent,
  MessengerSubscription,
} from '~/types/messenger'
import { useMessengerApi } from '~/composables/useMessengerApi'

interface MessengerEventRecord {
  event: MessengerMercureEvent
  receivedAt: string
}

const DEFAULT_PREVIEW_LIMIT = 3
const DEFAULT_RECONNECT_DELAY = 5000

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  try {
    return JSON.stringify(error)
  } catch (serializationError) {
    console.error('Unable to serialise messenger error', serializationError)
    return 'UNKNOWN_ERROR'
  }
}

export const useMessengerStore = defineStore('messenger', () => {
  const previews = ref<ConversationSummary[]>([])
  const previewLimit = ref(DEFAULT_PREVIEW_LIMIT)
  const loading = ref(false)
  const error = ref('')
  const subscription = ref<MessengerSubscription | null>(null)
  const eventSource = ref<EventSource | null>(null)
  const isConnected = ref(false)
  const reconnectTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const lastEvent = ref<MessengerEventRecord | null>(null)
  const isInitialised = ref(false)

  const unreadTotal = computed(() =>
    previews.value.reduce(
      (total, conversation) => total + (conversation.unreadCount || 0),
      0,
    ),
  )

  const hasUnread = computed(() => unreadTotal.value > 0)

  const api = useMessengerApi()

  const setPreviews = (items: ConversationSummary[]) => {
    previews.value = items.slice(0, previewLimit.value)
  }

  const upsertPreview = (conversation: ConversationSummary) => {
    const existingIndex = previews.value.findIndex(
      (item) => item.id === conversation.id,
    )
    if (existingIndex !== -1) {
      previews.value.splice(existingIndex, 1)
    }

    previews.value.unshift(conversation)

    if (previews.value.length > previewLimit.value) {
      previews.value.length = previewLimit.value
    }
  }

  const removePreview = (conversationId: string) => {
    previews.value = previews.value.filter(
      (conversation) => conversation.id !== conversationId,
    )
  }

  const applyEvent = (event: MessengerMercureEvent) => {
    lastEvent.value = {
      event,
      receivedAt: new Date().toISOString(),
    }

    switch (event.type) {
      case 'message.created':
        upsertPreview(event.conversation)
        break
      case 'conversation.updated':
        upsertPreview(event.conversation)
        break
      case 'message.read': {
        const preview = previews.value.find(
          (conversation) => conversation.id === event.conversationId,
        )
        if (preview) {
          preview.unreadCount = event.unreadCount
        }
        break
      }
      case 'conversation.deleted':
        removePreview(event.conversationId)
        break
      default:
        break
    }
  }

  const closeEventSource = () => {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    isConnected.value = false
  }

  const clearReconnectTimer = () => {
    if (reconnectTimer.value) {
      clearTimeout(reconnectTimer.value)
      reconnectTimer.value = null
    }
  }

  const scheduleReconnect = () => {
    clearReconnectTimer()

    const delay = subscription.value?.retry ?? DEFAULT_RECONNECT_DELAY

    reconnectTimer.value = setTimeout(() => {
      reconnectTimer.value = null
      connect()
    }, delay)
  }

  const connect = () => {
    if (import.meta.server) {
      return
    }

    if (!subscription.value || eventSource.value) {
      return
    }

    try {
      const { hubUrl, topics, token, withCredentials } = subscription.value
      const url = new URL(hubUrl)

      topics.forEach((topic) => {
        if (topic) {
          url.searchParams.append('topic', topic)
        }
      })

      if (token) {
        url.searchParams.append('access_token', token)
      }

      if (!('EventSource' in window)) {
        throw new Error('EventSource is not supported in this environment')
      }

      const source = new EventSource(url.toString(), {
        withCredentials: withCredentials ?? true,
      })

      source.onopen = () => {
        isConnected.value = true
        clearReconnectTimer()
      }

      source.onerror = () => {
        isConnected.value = false
        closeEventSource()
        scheduleReconnect()
      }

      source.onmessage = (messageEvent) => {
        if (!messageEvent.data) {
          return
        }

        try {
          const data = JSON.parse(messageEvent.data) as MessengerMercureEvent
          applyEvent(data)
        } catch (parseError) {
          console.error('Unable to parse messenger event', parseError)
        }
      }

      eventSource.value = source
    } catch (connectionError) {
      error.value = toErrorMessage(connectionError)
      scheduleReconnect()
    }
  }

  const fetchPreviews = async (limit = DEFAULT_PREVIEW_LIMIT) => {
    previewLimit.value = limit

    try {
      loading.value = true
      const response = await api.fetchConversationPreviews(limit)
      setPreviews(response.items)
      error.value = ''
    } catch (fetchError) {
      error.value = toErrorMessage(fetchError)
    } finally {
      loading.value = false
    }
  }

  const ensureSubscription = async () => {
    if (subscription.value) {
      return
    }

    try {
      subscription.value = await api.fetchSubscription()
      error.value = ''
    } catch (subscriptionError) {
      error.value = toErrorMessage(subscriptionError)
    }
  }

  const initialise = async (limit = DEFAULT_PREVIEW_LIMIT) => {
    if (import.meta.server) {
      return
    }

    if (isInitialised.value) {
      await ensureSubscription()
      connect()
      return
    }

    if (loading.value) {
      return
    }

    await fetchPreviews(limit)
    await ensureSubscription()
    connect()
    isInitialised.value = true
  }

  const teardown = () => {
    clearReconnectTimer()
    closeEventSource()
    subscription.value = null
    previews.value = []
    error.value = ''
    isInitialised.value = false
    lastEvent.value = null
  }

  return {
    previews,
    unreadTotal,
    hasUnread,
    loading,
    error,
    isConnected,
    lastEvent,
    isInitialised,
    initialise,
    fetchPreviews,
    ensureSubscription,
    connect,
    teardown,
    applyEvent,
  }
})
