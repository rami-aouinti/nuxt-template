import { computed } from 'vue'
import { useRuntimeConfig, useUserSession } from '#imports'
import type {
  ConversationListResponse,
  MarkConversationReadPayload,
  MessageListResponse,
  MessagePayload,
  MessengerSubscription,
  ConversationSummary,
  MessengerMessageSummary,
  MessengerUserSummary,
} from '~/types/messenger'

interface FetchConversationsParams {
  limit?: number
  cursor?: string | null
}

interface FetchMessagesParams {
  limit?: number
  cursor?: string | null
  direction?: 'forward' | 'backward'
}

const DEFAULT_CONVERSATION_LIMIT = 20
const DEFAULT_MESSAGE_LIMIT = 50
const DEFAULT_MERCURE_HUB_URL = 'http://bro-world.org/.well-known/mercure'

const toStringValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  return ''
}

const toNullableString = (value: unknown) => {
  const stringValue = typeof value === 'string' ? value : ''
  const trimmed = stringValue.trim()
  return trimmed.length > 0 ? trimmed : null
}

const normalizeTopics = (value: unknown): string[] => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    const unique = new Set(
      value
        .map((item) => toNullableString(item))
        .filter((item): item is string => Boolean(item)),
    )

    return Array.from(unique)
  }

  if (typeof value === 'string') {
    if (!value.trim()) {
      return []
    }

    return normalizeTopics(value.split(','))
  }

  return []
}

const normalizeRetry = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return null
    }

    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (!normalized) {
      return undefined
    }

    if (['1', 'true', 'yes', 'on'].includes(normalized)) {
      return true
    }

    if (['0', 'false', 'no', 'off'].includes(normalized)) {
      return false
    }
  }

  return undefined
}

const normalizeSubscription = (
  payload: unknown,
  fallbackHubUrl: string,
): MessengerSubscription => {
  const fallback: MessengerSubscription = {
    hubUrl: fallbackHubUrl,
    topics: [],
    token: null,
    retry: null,
  }

  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const record = payload as Record<string, unknown>

  const hubUrl =
    toNullableString(
      record.hubUrl ??
        record.hub_url ??
        record.url ??
        record.hub ??
        record.mercureHubUrl ??
        record.mercure_hub_url,
    ) || fallbackHubUrl

  const topics = normalizeTopics(
    record.topics ?? record.topic ?? record.channels,
  )

  const token =
    toNullableString(
      record.token ??
        record.jwt ??
        record.jwtToken ??
        record.accessToken ??
        record.access_token,
    ) ?? null

  const withCredentials = normalizeBoolean(
    record.withCredentials ??
      record.with_credentials ??
      record.credentials ??
      record.sendCredentials,
  )

  const retry = normalizeRetry(
    record.retry ??
      record.retryDelay ??
      record.retry_delay ??
      record.retryInterval ??
      record.retry_interval,
  )

  const result: MessengerSubscription = {
    hubUrl,
    topics,
    token,
  }

  if (typeof withCredentials === 'boolean') {
    result.withCredentials = withCredentials
  }

  result.retry = retry

  return result
}

const mergeSubscription = (
  primary: MessengerSubscription,
  fallback: MessengerSubscription,
): MessengerSubscription => {
  const merged: MessengerSubscription = {
    hubUrl: primary.hubUrl || fallback.hubUrl,
    topics: primary.topics.length > 0 ? primary.topics : fallback.topics,
    token:
      primary.token !== undefined ? primary.token : (fallback.token ?? null),
    retry:
      primary.retry !== undefined && primary.retry !== null
        ? primary.retry
        : (fallback.retry ?? null),
  }

  const withCredentials =
    typeof primary.withCredentials === 'boolean'
      ? primary.withCredentials
      : typeof fallback.withCredentials === 'boolean'
        ? fallback.withCredentials
        : undefined

  if (typeof withCredentials === 'boolean') {
    merged.withCredentials = withCredentials
  }

  return merged
}

const isRuntimeConfiguredSubscription = (
  subscription: MessengerSubscription,
  fallbackHubUrl: string,
) =>
  subscription.hubUrl !== fallbackHubUrl ||
  subscription.topics.length > 0 ||
  typeof subscription.token === 'string' ||
  typeof subscription.retry === 'number' ||
  typeof subscription.withCredentials === 'boolean'

const isIgnorableSubscriptionError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false
  }

  const record = error as Record<string, unknown>
  const status =
    typeof record.status === 'number'
      ? (record.status as number)
      : typeof record.statusCode === 'number'
        ? (record.statusCode as number)
        : typeof record.response === 'object' && record.response
            ? (record.response as { status?: number }).status
            : undefined

  return status === 404
}

const toTimestamp = (value: unknown, fallback?: string) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return fallback ?? new Date().toISOString()
}

const normalizeUserSummary = (value: unknown): MessengerUserSummary => {
  if (!value || typeof value !== 'object') {
    return {
      id: '',
      username: '',
      displayName: null,
      avatarUrl: null,
    }
  }

  const record = value as Record<string, unknown>

  const firstName = toNullableString(record.firstName)
  const lastName = toNullableString(record.lastName)

  let displayName = toNullableString(record.displayName)
  if (!displayName) {
    const parts = [firstName ?? '', lastName ?? '']
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
    displayName = parts.length > 0 ? parts.join(' ') : null
  }

  const profileRecord =
    record.profile && typeof record.profile === 'object'
      ? (record.profile as Record<string, unknown>)
      : null

  const avatarUrl =
    toNullableString(record.avatarUrl) ??
    toNullableString(record.avatar) ??
    toNullableString(record.photo) ??
    (profileRecord
      ? (toNullableString(profileRecord.avatarUrl) ??
        toNullableString(profileRecord.avatar) ??
        toNullableString(profileRecord.photo))
      : null)

  return {
    id: toStringValue(record.id),
    username: toStringValue(record.username),
    displayName,
    avatarUrl,
  }
}

const normalizeMessageSummary = (value: unknown): MessengerMessageSummary => {
  const record =
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

  const sender = normalizeUserSummary(record.sender)

  const replyTo =
    record.replyTo && typeof record.replyTo === 'object'
      ? (record.replyTo as Record<string, unknown>)
      : null

  const createdAt = toTimestamp(record.createdAt ?? record.created_at)
  const updatedAt = toTimestamp(
    record.updatedAt ?? record.updated_at,
    createdAt,
  )

  return {
    id: toStringValue(record.id),
    conversationId:
      toStringValue(record.conversationId ?? record.conversation_id) ||
      (record.conversation && typeof record.conversation === 'object'
        ? toStringValue((record.conversation as Record<string, unknown>).id)
        : ''),
    sender,
    text: toNullableString(record.text),
    mediaUrl: toNullableString(record.mediaUrl),
    mediaType: toNullableString(record.mediaType),
    attachmentUrl: toNullableString(record.attachmentUrl),
    attachmentType: toNullableString(record.attachmentType),
    replyToId:
      toNullableString(record.replyToId ?? record.reply_to_id) ??
      (replyTo ? toNullableString(replyTo.id) : null),
    createdAt,
    updatedAt,
  }
}

const normalizeConversationSummary = (value: unknown): ConversationSummary => {
  const record =
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

  const participants = Array.isArray(record.participants)
    ? record.participants.map(normalizeUserSummary)
    : []

  let lastMessage: MessengerMessageSummary | null = null
  if (record.lastMessage) {
    lastMessage = normalizeMessageSummary(record.lastMessage)
  } else if (Array.isArray(record.messages) && record.messages.length > 0) {
    lastMessage = normalizeMessageSummary(
      record.messages[record.messages.length - 1],
    )
  }

  const createdAt = toTimestamp(record.createdAt ?? record.created_at)
  const updatedAt = toTimestamp(
    record.updatedAt ?? record.updated_at ?? lastMessage?.createdAt,
    createdAt,
  )

  const unreadCountValue = Number(record.unreadCount ?? record.unread_count)

  return {
    id: toStringValue(record.id),
    title: toNullableString(record.title),
    isGroup: Boolean(record.isGroup ?? record.is_group),
    participants,
    lastMessage,
    unreadCount: Number.isFinite(unreadCountValue) ? unreadCountValue : 0,
    updatedAt,
    createdAt,
  }
}

const normalizeConversationListResponse = (
  payload: unknown,
): ConversationListResponse => {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.items)) {
      const items = record.items.map(normalizeConversationSummary)
      return {
        items,
        nextCursor: toNullableString(record.nextCursor ?? record.next_cursor),
        previousCursor: toNullableString(
          record.previousCursor ?? record.previous_cursor,
        ),
        total:
          typeof record.total === 'number' && Number.isFinite(record.total)
            ? (record.total as number)
            : items.length,
      }
    }
  }

  if (Array.isArray(payload)) {
    const items = payload.map(normalizeConversationSummary)
    return {
      items,
      nextCursor: null,
      previousCursor: null,
      total: items.length,
    }
  }

  return { items: [], nextCursor: null, previousCursor: null, total: 0 }
}

const normalizeMessageListResponse = (
  payload: unknown,
): MessageListResponse => {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.items)) {
      const items = record.items.map(normalizeMessageSummary)
      return {
        items,
        nextCursor: toNullableString(record.nextCursor ?? record.next_cursor),
        previousCursor: toNullableString(
          record.previousCursor ?? record.previous_cursor,
        ),
        total:
          typeof record.total === 'number' && Number.isFinite(record.total)
            ? (record.total as number)
            : items.length,
      }
    }
  }

  if (Array.isArray(payload)) {
    const items = payload.map(normalizeMessageSummary)
    return {
      items,
      nextCursor: null,
      previousCursor: null,
      total: items.length,
    }
  }

  return { items: [], nextCursor: null, previousCursor: null, total: 0 }
}

export const useMessengerApi = () => {
  const { loggedIn, session } = useUserSession()
  const runtimeConfig = useRuntimeConfig()
  const apiBase = computed(
    () =>
      runtimeConfig.public?.messenger?.apiBase?.replace(/\/$/, '') ||
      'https://bro-world.org/api/v1/messenger',
  )

  const fallbackHubUrl =
    runtimeConfig.public?.messenger?.mercureHubUrl ||
    runtimeConfig.public?.mercure?.hubUrl ||
    DEFAULT_MERCURE_HUB_URL

  const configuredSubscription = computed(() =>
    normalizeSubscription(
      runtimeConfig.public?.messenger?.subscription,
      fallbackHubUrl,
    ),
  )

  const token = computed(() => session.value?.token ?? '')
  const isAuthenticated = computed(
    () => loggedIn.value && Boolean(token.value?.length),
  )

  const getAuthHeaders = (mandatory = true) => {
    if (!isAuthenticated.value) {
      if (mandatory) {
        throw new Error('AUTHENTICATION_REQUIRED')
      }

      return undefined
    }

    return {
      Authorization: `Bearer ${token.value}`,
    }
  }

  const requestConversations = async (): Promise<ConversationListResponse> => {
    const headers = getAuthHeaders(true)
    const payload = await $fetch<unknown>(`${apiBase.value}/conversation/my`, {
      headers,
    })

    return normalizeConversationListResponse(payload)
  }

  const fetchConversationPreviews = async (
    limit = 3,
  ): Promise<ConversationListResponse> => {
    const response = await requestConversations()
    const items = response.items.slice(0, Math.max(0, limit))

    return {
      ...response,
      items,
    }
  }

  const fetchConversations = async (
    params: FetchConversationsParams = {},
  ): Promise<ConversationListResponse> => {
    const { limit = DEFAULT_CONVERSATION_LIMIT } = params
    const response = await requestConversations()
    const items =
      typeof limit === 'number' && limit > 0
        ? response.items.slice(0, limit)
        : response.items.slice()

    return {
      ...response,
      items,
    }
  }

  const fetchConversationMessages = async (
    conversationId: string,
    params: FetchMessagesParams = {},
  ): Promise<MessageListResponse> => {
    const headers = getAuthHeaders(true)
    const { limit = DEFAULT_MESSAGE_LIMIT, cursor, direction } = params

    const payload = await $fetch<unknown>(
      `${apiBase.value}/message/conversation/${conversationId}`,
      {
        params: {
          limit,
          cursor,
          direction,
        },
        headers,
      },
    )

    return normalizeMessageListResponse(payload)
  }

  const sendMessage = async (
    conversationId: string,
    payload: MessagePayload,
  ) => {
    const headers = getAuthHeaders(true)

    const response = await $fetch<unknown>(
      `${apiBase.value}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: payload,
        headers,
      },
    )

    return normalizeMessageSummary(response)
  }

  const createDirectConversation = async (
    receiverId: string,
  ): Promise<ConversationSummary> => {
    const headers = getAuthHeaders(true)
    const payload = await $fetch<unknown>(
      `${apiBase.value}/conversation/direct`,
      {
        method: 'POST',
        body: { receiverId },
        headers,
      },
    )

    return normalizeConversationSummary(payload)
  }

  const markConversationAsRead = async (
    conversationId: string,
    payload: MarkConversationReadPayload = {},
  ): Promise<void> => {
    const headers = getAuthHeaders(true)

    await $fetch(
      `${apiBase.value}/message/conversation/${conversationId}/read`,
      {
        method: 'POST',
        body: payload,
        headers,
      },
    )
  }

  const fetchSubscription = async (): Promise<MessengerSubscription> => {
    const fallback = configuredSubscription.value

    if (isRuntimeConfiguredSubscription(fallback, fallbackHubUrl)) {
      return fallback
    }

    try {
      const headers = getAuthHeaders(true)

      const payload = await $fetch<unknown>(`${apiBase.value}/subscription`, {
        headers,
      })

      const subscription = normalizeSubscription(payload, fallbackHubUrl)

      return mergeSubscription(subscription, fallback)
    } catch (fetchError) {
      if (import.meta.dev && !isIgnorableSubscriptionError(fetchError)) {
        console.warn(
          'Unable to fetch messenger subscription, using configured fallback instead.',
          fetchError,
        )
      }

      return fallback
    }
  }

  return {
    isAuthenticated,
    fetchConversationPreviews,
    fetchConversations,
    fetchConversationMessages,
    sendMessage,
    createDirectConversation,
    markConversationAsRead,
    fetchSubscription,
  }
}
