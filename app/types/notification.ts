export type NotificationStatus =
  | 'pending'
  | 'processing'
  | 'sent'
  | 'failed'
  | 'cancelled'
  | string

export type NotificationChannel =
  | 'email'
  | 'sms'
  | 'push'
  | 'in_app'
  | 'webhook'
  | string

export interface AdminNotification {
  id: string
  subject: string
  message?: string | null
  channel: NotificationChannel
  recipient: string
  status: NotificationStatus
  createdAt: string
  scheduledFor?: string | null
  sentAt?: string | null
  updatedAt?: string | null
  metadata?: Record<string, unknown> | null
}

export interface AdminNotificationDetail extends AdminNotification {
  payload?: Record<string, unknown> | null
  context?: Record<string, unknown> | null
  attempts?: Array<{
    status: NotificationStatus
    occurredAt: string
    description?: string | null
  }>
}

export interface NotificationStatusUpdatePayload {
  status: NotificationStatus
}
