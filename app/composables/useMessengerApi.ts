import { computed } from 'vue'
import type {
  ConversationListResponse,
  MarkConversationReadPayload,
  MessageListResponse,
  MessagePayload,
  MessengerSubscription,
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

export const useMessengerApi = () => {
  const { loggedIn, session } = useUserSession()
  const runtimeConfig = useRuntimeConfig()
  const apiBase = computed(() =>
    runtimeConfig.public?.messenger?.apiBase?.replace(/\/$/, '') ||
    'https://bro-world.org/api/messenger',
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

  const fetchConversationPreviews = async (
    limit = 3,
  ): Promise<ConversationListResponse> => {
    const headers = getAuthHeaders(true)

    return await $fetch<ConversationListResponse>(`${apiBase.value}/conversations`, {
      params: { limit },
      headers,
    })
  }

  const fetchConversations = async (
    params: FetchConversationsParams = {},
  ): Promise<ConversationListResponse> => {
    const headers = getAuthHeaders(true)
    const { limit = DEFAULT_CONVERSATION_LIMIT, cursor } = params

    return await $fetch<ConversationListResponse>(`${apiBase.value}/conversations`, {
      params: {
        limit,
        cursor,
      },
      headers,
    })
  }

  const fetchConversationMessages = async (
    conversationId: string,
    params: FetchMessagesParams = {},
  ): Promise<MessageListResponse> => {
    const headers = getAuthHeaders(true)
    const { limit = DEFAULT_MESSAGE_LIMIT, cursor, direction } = params

    return await $fetch<MessageListResponse>(
      `${apiBase.value}/conversations/${conversationId}/messages`,
      {
        params: {
          limit,
          cursor,
          direction,
        },
        headers,
      },
    )
  }

  const sendMessage = async (
    conversationId: string,
    payload: MessagePayload,
  ) => {
    const headers = getAuthHeaders(true)

    return await $fetch<MessageListResponse['items'][number]>(
      `${apiBase.value}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: payload,
        headers,
      },
    )
  }

  const markConversationAsRead = async (
    conversationId: string,
    payload: MarkConversationReadPayload = {},
  ): Promise<void> => {
    const headers = getAuthHeaders(true)

    await $fetch(`${apiBase.value}/conversations/${conversationId}/read`, {
      method: 'POST',
      body: payload,
      headers,
    })
  }

  const fetchSubscription = async (): Promise<MessengerSubscription> => {
    const headers = getAuthHeaders(true)

    return await $fetch<MessengerSubscription>(
      `${apiBase.value}/subscriptions/current`,
      {
        headers,
      },
    )
  }

  return {
    isAuthenticated,
    fetchConversationPreviews,
    fetchConversations,
    fetchConversationMessages,
    sendMessage,
    markConversationAsRead,
    fetchSubscription,
  }
}
