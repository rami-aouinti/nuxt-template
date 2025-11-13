import type {
  NotificationBatchPayload,
  NotificationCreatePayload,
} from '~/types/notification'

function formatValue(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString()
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      return null
    }

    return String(value)
  }

  return null
}

function appendStringValue(formData: FormData, key: string, value: unknown) {
  const stringValue = formatValue(value)

  if (stringValue !== null) {
    formData.append(key, stringValue)
  }
}

function appendJsonValue(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) {
    return
  }

  if (typeof value === 'string') {
    if (value.length > 0) {
      formData.append(key, value)
    }
    return
  }

  formData.append(key, JSON.stringify(value))
}

export function buildNotificationFormData(
  payload: Partial<NotificationCreatePayload>,
) {
  const formData = new FormData()

  appendStringValue(formData, 'channel', payload.channel)
  appendStringValue(formData, 'scope', payload.scope)
  appendStringValue(formData, 'sendAfter', payload.sendAfter)

  const normalizedChannel =
    typeof payload.channel === 'string'
      ? payload.channel.toUpperCase()
      : undefined

  if (normalizedChannel === 'PUSH') {
    appendStringValue(formData, 'topic', payload.topic)
    appendStringValue(formData, 'pushTitle', payload.pushTitle)
    appendStringValue(formData, 'pushSubtitle', payload.pushSubtitle)
    appendStringValue(formData, 'pushContent', payload.pushContent)
    appendJsonValue(formData, 'scopeTarget', payload.scopeTarget)
  } else if (normalizedChannel === 'SMS') {
    appendStringValue(formData, 'smsContent', payload.smsContent)
    appendStringValue(formData, 'smsSenderName', payload.smsSenderName)
    appendJsonValue(formData, 'scopeTarget', payload.scopeTarget)
  } else {
    appendJsonValue(formData, 'recipients', payload.recipients)
    appendJsonValue(formData, 'emailRecipientsCc', payload.emailRecipientsCc)
    appendJsonValue(formData, 'emailRecipientsBcc', payload.emailRecipientsBcc)
    appendJsonValue(
      formData,
      'emailRecipientsReplyTo',
      payload.emailRecipientsReplyTo,
    )
    appendStringValue(formData, 'emailSenderEmail', payload.emailSenderEmail)
    appendStringValue(formData, 'emailSenderName', payload.emailSenderName)
    appendStringValue(formData, 'templateId', payload.templateId)
    appendStringValue(formData, 'emailSubject', payload.emailSubject)
    appendStringValue(formData, 'emailContentPlain', payload.emailContentPlain)
    appendStringValue(formData, 'emailContentHtml', payload.emailContentHtml)
  }

  return formData
}

export function buildNotificationBatchFormData(
  payload: Partial<NotificationBatchPayload>,
) {
  const formData = new FormData()

  appendStringValue(formData, 'channel', payload.channel)
  appendJsonValue(formData, 'recipients', payload.recipients)
  appendStringValue(formData, 'emailSenderEmail', payload.emailSenderEmail)
  appendStringValue(formData, 'emailSenderName', payload.emailSenderName)
  appendStringValue(formData, 'templateId', payload.templateId)
  appendStringValue(formData, 'emailSubject', payload.emailSubject)
  appendStringValue(formData, 'emailContentPlain', payload.emailContentPlain)
  appendStringValue(formData, 'emailContentHtml', payload.emailContentHtml)
  appendStringValue(formData, 'scope', payload.scope)
  appendStringValue(formData, 'sendAfter', payload.sendAfter)

  return formData
}
