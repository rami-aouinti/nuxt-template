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

export type NotificationScope =
  | 'INDIVIDUAL'
  | 'GLOBAL'
  | 'WORKPLACE'
  | 'SEGMENT'
  | string

export interface NotificationTemplate {
  id: string
  templateId: number
  name: string
  locale?: string | null
  variables: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
}

export interface NotificationDetail {
  id: string
  channel?: string | null
  scope?: NotificationScope | null
  scopeTarget?: Record<string, unknown> | null
  status?: NotificationStatus | null
  sendAfter?: string | null
  completedAt?: string | null
  callback?: Record<string, unknown> | null
  [key: string]: unknown
}

export interface NotificationCreatePayload {
  channel: string
  scope?: NotificationScope | null
  sendAfter?: string | Date | null
  scopeTarget?: unknown
  topic?: string | null
  pushTitle?: string | null
  pushSubtitle?: string | null
  pushContent?: string | null
  smsContent?: string | null
  smsSenderName?: string | null
  recipients?: unknown
  emailRecipientsCc?: unknown
  emailRecipientsBcc?: unknown
  emailRecipientsReplyTo?: unknown
  emailSenderEmail?: string | null
  emailSenderName?: string | null
  templateId?: number | string | null
  emailSubject?: string | null
  emailContentPlain?: string | null
  emailContentHtml?: string | null
}

export interface NotificationBatchPayload {
  channel: string
  recipients?: unknown
  emailSenderEmail?: string | null
  emailSenderName?: string | null
  templateId?: number | string | null
  emailSubject?: string | null
  emailContentPlain?: string | null
  emailContentHtml?: string | null
  scope?: NotificationScope | null
  sendAfter?: string | Date | null
}

export interface NotificationTemplateUploadResponse {
  status: string
  message?: string
}
