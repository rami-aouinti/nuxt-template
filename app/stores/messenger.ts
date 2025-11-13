import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type {
  ConversationSummary,
  MessengerMercureEvent,
  MessengerSubscription,
} from '~/types/messenger'
import { useMessengerApi } from '~/composables/useMessengerApi'

const USER_ID_PLACEHOLDER = '{userId}'
const CONVERSATION_ID_PLACEHOLDER = '{conversationId}'

function toNormalizedIdentifier(value: unknown) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : ''
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return ''
}

function resolveSessionUserId(sessionValue: unknown) {
  if (!sessionValue || typeof sessionValue !== 'object') {
    return ''
  }

  const record = sessionValue as Record<string, unknown>

  const profile =
    record.profile && typeof record.profile === 'object'
      ? (record.profile as Record<string, unknown>)
      : null

  const user =
    record.user && typeof record.user === 'object'
      ? (record.user as Record<string, unknown>)
      : null

  const candidates = [
    profile?.id,
    user?.id,
    user?.userId,
    user?.user_id,
    record.userId,
    record.user_id,
    record.id,
  ]

  for (const candidate of candidates) {
    const normalized = toNormalizedIdentifier(candidate)
    if (normalized) {
      return normalized
    }
  }

  return ''
}

function replacePlaceholder(
  value: string,
  placeholder: string,
  replacement: string,
) {
  return value.split(placeholder).join(replacement)
}

function expandSubscriptionTopics(
  topics: string[],
  context: { userId: string; conversationIds: string[] },
) {
  const result: string[] = []
  const uniqueConversationIds = Array.from(
    new Set(context.conversationIds.map((id) => toNormalizedIdentifier(id))),
  ).filter((id) => Boolean(id))

  const userId = toNormalizedIdentifier(context.userId)

  for (const topic of topics) {
    const normalizedTopic = toNormalizedIdentifier(topic)
    if (!normalizedTopic) {
      continue
    }

    const requiresUser = normalizedTopic.includes(USER_ID_PLACEHOLDER)
    if (requiresUser && !userId) {
      continue
    }

    const requiresConversation = normalizedTopic.includes(
      CONVERSATION_ID_PLACEHOLDER,
    )

    const targetConversationIds = requiresConversation
      ? uniqueConversationIds
      : ['']

    if (requiresConversation && targetConversationIds.length === 0) {
      continue
    }

    for (const conversationId of targetConversationIds) {
      let resolvedTopic = normalizedTopic

      if (requiresUser) {
        resolvedTopic = replacePlaceholder(
          resolvedTopic,
          USER_ID_PLACEHOLDER,
          userId,
        )
      }

      if (requiresConversation) {
        resolvedTopic = replacePlaceholder(
          resolvedTopic,
          CONVERSATION_ID_PLACEHOLDER,
          conversationId,
        )
      }

      if (!result.includes(resolvedTopic)) {
        result.push(resolvedTopic)
      }
    }
  }

  return result
}

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
  const subscriptionTemplate = ref<MessengerSubscription | null>(null)
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
  const { session } = useUserSession()

  const currentUserId = computed(() => resolveSessionUserId(session.value))

  const conversationIds = computed(() => {
    const uniqueIds = new Set<string>()

    previews.value.forEach((conversation) => {
      const identifier = toNormalizedIdentifier(conversation.id)
      if (identifier) {
        uniqueIds.add(identifier)
      }
    })

    return Array.from(uniqueIds)
  })

  const refreshSubscriptionTopics = () => {
    if (!subscriptionTemplate.value) {
      return
    }

    const expandedTopics = expandSubscriptionTopics(
      subscriptionTemplate.value.topics,
      {
        userId: currentUserId.value,
        conversationIds: conversationIds.value,
      },
    )

    const nextTopics =
      expandedTopics.length > 0
        ? expandedTopics
        : subscriptionTemplate.value.topics.slice()

    const previousTopics = subscription.value?.topics ?? []
    const topicsChanged =
      previousTopics.length !== nextTopics.length ||
      previousTopics.some((topic, index) => topic !== nextTopics[index])

    subscription.value = {
      ...subscriptionTemplate.value,
      topics: nextTopics,
    }

    if (topicsChanged && eventSource.value && !import.meta.server) {
      closeEventSource()
      connect()
    }
  }

  watch(currentUserId, () => {
    refreshSubscriptionTopics()
  })

  watch(
    conversationIds,
    () => {
      refreshSubscriptionTopics()
    },
    { deep: false },
  )

  const setPreviews = (items: ConversationSummary[]) => {
    previews.value = items.slice(0, previewLimit.value)
    refreshSubscriptionTopics()
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

    refreshSubscriptionTopics()
  }

  const removePreview = (conversationId: string) => {
    previews.value = previews.value.filter(
      (conversation) => conversation.id !== conversationId,
    )
    refreshSubscriptionTopics()
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

    refreshSubscriptionTopics()

    if (!subscription.value || eventSource.value) {
      return
    }

    try {
      const { hubUrl, topics, token, withCredentials } = subscription.value
      const url = new URL(hubUrl)

      const normalizedTopics = topics
        .map((topic) => (typeof topic === 'string' ? topic.trim() : ''))
        .filter((topic): topic is string => topic.length > 0)

      if (normalizedTopics.length === 0) {
        error.value = 'MESSENGER_SUBSCRIPTION_TOPICS_MISSING'
        return
      }

      normalizedTopics.forEach((topic) => {
        url.searchParams.append('topic', topic)
      })

      if (token) {
        url.searchParams.append('access_token', token)
      }

      if (!('EventSource' in window)) {
        throw new Error('EventSource is not supported in this environment')
      }

      const eventSourceOptions: EventSourceInit = {}

      if (typeof withCredentials === 'boolean') {
        eventSourceOptions.withCredentials = withCredentials
      }

      const source = new EventSource(url.toString(), eventSourceOptions)

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
      const fetchedSubscription = await api.fetchSubscription()
      subscriptionTemplate.value = fetchedSubscription
      refreshSubscriptionTopics()
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
    subscriptionTemplate.value = null
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
