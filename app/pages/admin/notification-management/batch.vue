<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { normalizeRequestHeaders } from '~/utils/headers'
import type { NotificationBatchPayload } from '~/types/notification'

const { t } = useI18n()

definePageMeta({
  title: 'notificationManagement.navigation.batch',
  icon: 'mdi-source-branch-sync',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const requestHeaders = import.meta.server
  ? normalizeRequestHeaders(useRequestHeaders(['cookie', 'authorization']))
  : undefined

const form = reactive({
  channel: 'email',
  recipients: '',
  emailSenderEmail: '',
  emailSenderName: '',
  templateId: '',
  emailSubject: '',
  emailContentPlain: '',
  emailContentHtml: '',
  scope: '',
  sendAfter: '',
})

const sending = ref(false)
const formError = ref('')

const channelOptions = computed(() => [
  {
    value: 'email',
    title: t('notificationManagement.batch.channels.email'),
  },
  { value: 'sms', title: t('notificationManagement.batch.channels.sms') },
  { value: 'push', title: t('notificationManagement.batch.channels.push') },
])

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

function parseSendAfter(value: string) {
  const normalized = value.trim()
  if (!normalized) {
    return undefined
  }

  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    return normalized
  }

  return date
}

function buildPayload(): Partial<NotificationBatchPayload> {
  return {
    channel: form.channel,
    recipients: parseJsonInput(form.recipients),
    emailSenderEmail: parseOptionalString(form.emailSenderEmail),
    emailSenderName: parseOptionalString(form.emailSenderName),
    templateId: parseTemplateId(form.templateId),
    emailSubject: parseOptionalString(form.emailSubject),
    emailContentPlain: parseOptionalString(form.emailContentPlain),
    emailContentHtml: parseOptionalString(form.emailContentHtml),
    scope: parseOptionalString(form.scope),
    sendAfter: parseSendAfter(form.sendAfter),
  }
}

function resetForm() {
  form.recipients = ''
  form.emailSenderEmail = ''
  form.emailSenderName = ''
  form.templateId = ''
  form.emailSubject = ''
  form.emailContentPlain = ''
  form.emailContentHtml = ''
  form.scope = ''
  form.sendAfter = ''
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
    const data = (error as { data?: { message?: unknown; error?: unknown } }).data
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
    await $fetch('/api/v1/notification/platform/notifications/batch', {
      method: 'POST',
      body: payload,
      headers: requestHeaders,
      credentials: 'include',
    })

    Notify.success(t('notificationManagement.batch.notifications.success'))
    resetForm()
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.batch.notifications.failed'),
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
              {{ t('notificationManagement.batch.title') }}
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              {{ t('notificationManagement.batch.subtitle') }}
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
                  :label="t('notificationManagement.batch.fields.channel')"
                  :hint="t('notificationManagement.batch.hints.channel')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.scope"
                  variant="outlined"
                  density="comfortable"
                  :label="t('notificationManagement.batch.fields.scope')"
                  :hint="t('notificationManagement.batch.hints.scope')"
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
                  :label="t('notificationManagement.batch.fields.sendAfter')"
                  :hint="t('notificationManagement.batch.hints.sendAfter')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.recipients"
                  variant="outlined"
                  density="comfortable"
                  rows="4"
                  auto-grow
                  :label="t('notificationManagement.batch.fields.recipients')"
                  :hint="t('notificationManagement.batch.hints.recipients')"
                  persistent-hint
                  :disabled="sending"
                />
              </v-col>
            </v-row>

            <v-divider />

            <div class="d-flex flex-column gap-4">
              <h2 class="text-subtitle-1 font-weight-semibold mb-1">
                {{ t('notificationManagement.batch.sections.email') }}
              </h2>
              <v-text-field
                v-model="form.emailSenderEmail"
                variant="outlined"
                density="comfortable"
                :label="t('notificationManagement.batch.fields.emailSenderEmail')"
                :disabled="sending"
              />
              <v-text-field
                v-model="form.emailSenderName"
                variant="outlined"
                density="comfortable"
                :label="t('notificationManagement.batch.fields.emailSenderName')"
                :disabled="sending"
              />
              <v-text-field
                v-model="form.templateId"
                variant="outlined"
                density="comfortable"
                :label="t('notificationManagement.batch.fields.templateId')"
                :hint="t('notificationManagement.batch.hints.templateId')"
                persistent-hint
                :disabled="sending"
              />
              <v-text-field
                v-model="form.emailSubject"
                variant="outlined"
                density="comfortable"
                :label="t('notificationManagement.batch.fields.emailSubject')"
                :disabled="sending"
              />
              <v-textarea
                v-model="form.emailContentPlain"
                variant="outlined"
                density="comfortable"
                rows="4"
                auto-grow
                :label="t('notificationManagement.batch.fields.emailContentPlain')"
                :disabled="sending"
              />
              <v-textarea
                v-model="form.emailContentHtml"
                variant="outlined"
                density="comfortable"
                rows="6"
                auto-grow
                :label="t('notificationManagement.batch.fields.emailContentHtml')"
                :disabled="sending"
              />
            </div>

            <div class="d-flex justify-end">
              <AppButton
                type="submit"
                color="primary"
                size="large"
                :loading="sending"
              >
                {{ t('notificationManagement.batch.actions.submit') }}
              </AppButton>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
