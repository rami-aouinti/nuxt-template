export interface MessengerUserSummary {
  id: string
  username: string
  displayName?: string | null
  avatarUrl?: string | null
}

export interface MessengerMessageSummary {
  id: string
  conversationId: string
  sender: MessengerUserSummary
  text?: string | null
  mediaUrl?: string | null
  mediaType?: string | null
  attachmentUrl?: string | null
  attachmentType?: string | null
  replyToId?: string | null
  createdAt: string
  updatedAt: string
}

export interface ConversationSummary {
  id: string
  title?: string | null
  isGroup: boolean
  participants: MessengerUserSummary[]
  lastMessage?: MessengerMessageSummary | null
  unreadCount: number
  updatedAt: string
  createdAt: string
}

export interface ConversationListResponse {
  items: ConversationSummary[]
  nextCursor?: string | null
  previousCursor?: string | null
  total?: number
}

export interface MessageListResponse {
  items: MessengerMessageSummary[]
  nextCursor?: string | null
  previousCursor?: string | null
  total?: number
}

export interface MessagePayload {
  text?: string | null
  mediaUrl?: string | null
  mediaType?: string | null
  attachmentUrl?: string | null
  attachmentType?: string | null
  replyToId?: string | null
}

export interface MarkConversationReadPayload {
  messageId?: string | null
}

export interface MessengerSubscription {
  hubUrl: string
  topics: string[]
  token?: string | null
  withCredentials?: boolean
  retry?: number | null
}

export type MessengerMercureEvent =
  | {
      type: 'message.created'
      conversation: ConversationSummary
      message: MessengerMessageSummary
    }
  | { type: 'conversation.updated'; conversation: ConversationSummary }
  | { type: 'conversation.deleted'; conversationId: string }
  | { type: 'message.read'; conversationId: string; unreadCount: number }
