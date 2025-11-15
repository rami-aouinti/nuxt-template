<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { normalizeRequestHeaders } from '~/utils/headers'
import type { NotificationCreatePayload } from '~/types/notification'

const { t } = useI18n()

definePageMeta({
  title: 'notificationManagement.navigation.send',
  icon: 'mdi-email-send-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = import.meta.server
  ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
  : undefined

const form = reactive({
  channel: 'email',
  scope: '',
  sendAfter: '',
  scopeTarget: '',
  topic: '',
  pushTitle: '',
  pushSubtitle: '',
  pushContent: '',
  smsContent: '',
  smsSenderName: '',
  recipients: '',
  emailRecipientsCc: '',
  emailRecipientsBcc: '',
  emailRecipientsReplyTo: '',
  emailSenderEmail: '',
  emailSenderName: '',
  templateId: '',
  emailSubject: '',
  emailContentPlain: '',
  emailContentHtml: '',
})

const sending = ref(false)
const formError = ref('')

const channelOptions = computed(() => [
  {
    value: 'email',
    title: t('notificationManagement.send.channels.email'),
  },
  { value: 'sms', title: t('notificationManagement.send.channels.sms') },
  { value: 'push', title: t('notificationManagement.send.channels.push') },
])

const isSms = computed(() => form.channel === 'sms')
const isPush = computed(() => form.channel === 'push')

function parseOptionalString(value: string) {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function parseJsonInput(value: string) {
  const normalized = value.trim()
  if (normalized.length === 0) {
    return undefined
  }

  try {
    return JSON.parse(normalized)
  } catch {
    return normalized
  }
}

function parseSendAfter(value: string) {
  const normalized = value.trim()
  if (normalized.length === 0) {
    return undefined
  }

  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    return normalized
  }

  return date
}

function parseTemplateId(value: string) {
  const normalized = value.trim()
  if (!normalized) {
    return undefined
  }

  const numericValue = Number.parseInt(normalized, 10)
  if (Number.isNaN(numericValue)) {
    return normalized
  }

  return numericValue
}

function buildPayload(): Partial<NotificationCreatePayload> {
  const payload: Partial<NotificationCreatePayload> = {
    channel: form.channel,
    scope: parseOptionalString(form.scope),
    sendAfter: parseSendAfter(form.sendAfter),
    scopeTarget: parseJsonInput(form.scopeTarget),
  }

  if (isPush.value) {
    payload.topic = parseOptionalString(form.topic)
    payload.pushTitle = parseOptionalString(form.pushTitle)
    payload.pushSubtitle = parseOptionalString(form.pushSubtitle)
    payload.pushContent = parseOptionalString(form.pushContent)
  } else if (isSms.value) {
    payload.smsContent = parseOptionalString(form.smsContent)
    payload.smsSenderName = parseOptionalString(form.smsSenderName)
  } else {
    payload.recipients = parseJsonInput(form.recipients)
    payload.emailRecipientsCc = parseJsonInput(form.emailRecipientsCc)
    payload.emailRecipientsBcc = parseJsonInput(form.emailRecipientsBcc)
    payload.emailRecipientsReplyTo = parseJsonInput(form.emailRecipientsReplyTo)
    payload.emailSenderEmail = parseOptionalString(form.emailSenderEmail)
    payload.emailSenderName = parseOptionalString(form.emailSenderName)
    payload.templateId = parseTemplateId(form.templateId)
    payload.emailSubject = parseOptionalString(form.emailSubject)
    payload.emailContentPlain = parseOptionalString(form.emailContentPlain)
    payload.emailContentHtml = parseOptionalString(form.emailContentHtml)
  }

  return payload
}

function resetForm() {
  form.scope = ''
  form.sendAfter = ''
  form.scopeTarget = ''
  form.topic = ''
  form.pushTitle = ''
  form.pushSubtitle = ''
  form.pushContent = ''
  form.smsContent = ''
  form.smsSenderName = ''
  form.recipients = ''
  form.emailRecipientsCc = ''
  form.emailRecipientsBcc = ''
  form.emailRecipientsReplyTo = ''
  form.emailSenderEmail = ''
  form.emailSenderName = ''
  form.templateId = ''
  form.emailSubject = ''
  form.emailContentPlain = ''
  form.emailContentHtml = ''
}

function resolveErrorMessage(error: unknown, fallback: string) {
  if (!error) {
    return fallback
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message && error.message.trim().length > 0
      ? error.message
      : fallback
  }

  if (typeof error === 'object') {
    const data = (error as { data?: { message?: unknown; error?: unknown } })
      .data
    if (data) {
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message
      }
      if (typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error
      }
    }

    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }
  }

  return fallback
}

async function submit() {
  formError.value = ''
  sending.value = true

  try {
    const payload = buildPayload()
    await $fetch('/api/v1/notification/platform/notifications', {
      method: 'POST',
      body: payload,
      headers: requestHeaders,
      credentials: 'include',
    })

    Notify.success(t('notificationManagement.send.notifications.success'))
    resetForm()
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.send.notifications.failed'),
    )
    formError.value = message
    Notify.error(message)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <v-container fluid class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-4 pa-md-6" rounded="xl" :elevation="2">
          <div class="d-flex flex-column gap-2 mb-6">
            <h1 class="text-h5 font-weight-bold">
              {{ t('notificationManagement.send.title') }}
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              {{ t('notificationManagement.send.subtitle') }}
            </p>
          </div>

          <v-alert
            v-if="formError"
            type="error"
            border="start"
            class="mb-6"
            :text="formError"
          />

          <v-form class="d-flex flex-column gap-6" @submit.prevent="submit">
            <v-row class="gap-y-4">
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.channel"
                  :items="channelOptions"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.channel')"
                  :hint="t('notificationManagement.send.hints.channel')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.scope"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.scope')"
                  :hint="t('notificationManagement.send.hints.scope')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.sendAfter"
                  variant="outlined"
                  density="comfortable"
                  type="datetime-local"
                  :label="t('notificationManagement.send.fields.sendAfter')"
                  :hint="t('notificationManagement.send.hints.sendAfter')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.scopeTarget"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                  :label="t('notificationManagement.send.fields.scopeTarget')"
                  :hint="t('notificationManagement.send.hints.scopeTarget')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>
            </v-row>

            <template v-if="isPush">
              <v-divider />
              <div class="d-flex flex-column gap-4">
                <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                  {{ t('notificationManagement.send.sections.push') }}
                </h2>
                <v-text-field
                  v-model="form.topic"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.topic')"
                  :hint="t('notificationManagement.send.hints.topic')"
                  persistent-hint
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.pushTitle"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.pushTitle')"
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.pushSubtitle"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.pushSubtitle')"
                  :disabled="sending"
                />
                <v-textarea
                  v-model="form.pushContent"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  auto-grow
                  :label="t('notificationManagement.send.fields.pushContent')"
                  :disabled="sending"
                />
              </div>
            </template>

            <template v-else-if="isSms">
              <v-divider />
              <div class="d-flex flex-column gap-4">
                <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                  {{ t('notificationManagement.send.sections.sms') }}
                </h2>
                <v-textarea
                  v-model="form.smsContent"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  auto-grow
                  :label="t('notificationManagement.send.fields.smsContent')"
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.smsSenderName"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.smsSenderName')"
                  :disabled="sending"
                />
              </div>
            </template>

            <template v-else>
              <v-divider />
              <div class="d-flex flex-column gap-4">
                <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                  {{ t('notificationManagement.send.sections.email') }}
                </h2>
                <v-textarea
                  v-model="form.recipients"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  auto-grow
                  :label="t('notificationManagement.send.fields.recipients')"
                  :hint="t('notificationManagement.send.hints.recipients')"
                  persistent-hint
                  :disabled="sending"
                />
                <v-textarea
                  v-model="form.emailRecipientsCc"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                  :label="
                    t('notificationManagement.send.fields.emailRecipientsCc')
                  "
                  :hint="
                    t('notificationManagement.send.hints.emailRecipientsCc')
                  "
                  persistent-hint
                  :disabled="sending"
                />
                <v-textarea
                  v-model="form.emailRecipientsBcc"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                  :label="
                    t('notificationManagement.send.fields.emailRecipientsBcc')
                  "
                  :hint="
                    t('notificationManagement.send.hints.emailRecipientsBcc')
                  "
                  persistent-hint
                  :disabled="sending"
                />
                <v-textarea
                  v-model="form.emailRecipientsReplyTo"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                  :label="
                    t(
                      'notificationManagement.send.fields.emailRecipientsReplyTo',
                    )
                  "
                  :hint="
                    t(
                      'notificationManagement.send.hints.emailRecipientsReplyTo',
                    )
                  "
                  persistent-hint
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.emailSenderEmail"
                  variant="outlined"
                  density="comfortable"
                  :label="
                    t('notificationManagement.send.fields.emailSenderEmail')
                  "
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.emailSenderName"
                  variant="outlined"
                  density="comfortable"
                  :label="
                    t('notificationManagement.send.fields.emailSenderName')
                  "
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.templateId"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.templateId')"
                  :hint="t('notificationManagement.send.hints.templateId')"
                  persistent-hint
                  :disabled="sending"
                />
                <v-text-field
                  v-model="form.emailSubject"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.send.fields.emailSubject')"
                  :disabled="sending"
                />
                <v-textarea
                  v-model="form.emailContentPlain"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  auto-grow
                  :label="
                    t('notificationManagement.send.fields.emailContentPlain')
                  "
                  :disabled="sending"
                />
                <v-textarea
                  v-model="form.emailContentHtml"
                  variant="outlined"
                  density="comfortable"
                  rows="6"
                  auto-grow
                  :label="
                    t('notificationManagement.send.fields.emailContentHtml')
                  "
                  :disabled="sending"
                />
              </div>
            </template>

            <div class="d-flex justify-end">
              <AppButton
                type="submit"
                color="primary"
                size="large"
                :loading="sending"
              >
                {{ t('notificationManagement.send.actions.submit') }}
              </AppButton>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
