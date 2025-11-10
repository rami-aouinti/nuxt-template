import { computed } from 'vue'
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
      ? toNullableString(profileRecord.avatarUrl) ??
        toNullableString(profileRecord.avatar) ??
        toNullableString(profileRecord.photo)
      : null)

  return {
    id: toStringValue(record.id),
    username: toStringValue(record.username),
    displayName,
    avatarUrl,
  }
}

const normalizeMessageSummary = (
  value: unknown,
): MessengerMessageSummary => {
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

const normalizeConversationSummary = (
  value: unknown,
): ConversationSummary => {
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
    const payload = await $fetch<unknown>(
      `${apiBase.value}/conversation/my`,
      {
        headers,
      },
    )

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

    await $fetch(`${apiBase.value}/message/conversation/${conversationId}/read`, {
      method: 'POST',
      body: payload,
      headers,
    })
  }

  return {
    isAuthenticated,
    fetchConversationPreviews,
    fetchConversations,
    fetchConversationMessages,
    sendMessage,
    createDirectConversation,
    markConversationAsRead,
  }
}
