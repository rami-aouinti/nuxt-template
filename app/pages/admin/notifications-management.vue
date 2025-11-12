<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { useNotificationManagementStore } from '~/stores/notificationManagement'
import { Notify } from '~/stores/notification'
import {
  createDateFormatter,
  formatDateValue,
  type DateInput,
} from '~/utils/formatters'
import type {
  AdminNotification,
  AdminNotificationDetail,
} from '~/types/notification'

const { t, locale } = useI18n()

definePageMeta({
  title: 'navigation.notificationManagement',
  icon: 'mdi-bell-cog-outline',
  drawerIndex: 5,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const notificationStore = useNotificationManagementStore()
const {
  notifications: notificationsRef,
  notificationsPending: pending,
  notificationsError: error,
} = storeToRefs(notificationStore)

await notificationStore.fetchNotifications()

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('notificationManagement.table.subject'), key: 'subject' },
  { title: t('notificationManagement.table.channel'), key: 'channel' },
  { title: t('notificationManagement.table.recipient'), key: 'recipient' },
  {
    title: t('notificationManagement.table.status'),
    key: 'status',
    sortable: false,
    align: 'start',
    width: 140,
  },
  { title: t('notificationManagement.table.createdAt'), key: 'createdAt' },
  { title: t('notificationManagement.table.scheduledFor'), key: 'scheduledFor' },
  { title: t('notificationManagement.table.sentAt'), key: 'sentAt' },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'end',
    width: 160,
    exportable: false,
  },
])

const normalizeSearch = (value: string) => value.trim().toLowerCase()

const filteredNotifications = computed<AdminNotification[]>(() => {
  const items = notificationsRef.value ?? []
  const term = normalizeSearch(search.value)

  if (!term) {
    return items
  }

  return items.filter((notification) => {
    const fields = [
      notification.subject,
      notification.recipient,
      notification.channel,
      notification.status,
      notification.id,
    ]
      .filter((field) => typeof field === 'string')
      .map((field) => field!.toLowerCase())

    return fields.some((field) => field.includes(term))
  })
})

const tableError = computed(() => {
  if (!error.value) {
    return null
  }

  return resolveErrorMessage(
    error.value,
    t('notificationManagement.notifications.loadFailed'),
  )
})

const dateFormatter = createDateFormatter(locale)

const formatDate = (value: DateInput) =>
  formatDateValue(
    value,
    dateFormatter.value,
    t('notificationManagement.labels.notAvailable'),
  )

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

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

const statusPriority: Record<string, number> = {
  pending: 0,
  processing: 1,
  sent: 2,
  failed: 3,
  cancelled: 4,
}

function resolveStatusColor(status: string | null | undefined) {
  if (!status) {
    return 'secondary'
  }

  const key = normalizeKey(status)
  switch (key) {
    case 'pending':
      return 'warning'
    case 'processing':
    case 'queued':
      return 'info'
    case 'sent':
    case 'delivered':
      return 'success'
    case 'failed':
    case 'errored':
      return 'error'
    case 'cancelled':
    case 'canceled':
      return 'grey'
    default:
      return 'secondary'
  }
}

function resolveStatusLabel(status: string | null | undefined) {
  if (!status) {
    return t('notificationManagement.status.unknown')
  }

  const key = normalizeKey(status)
  const translationKey = `notificationManagement.status.${key}`
  const translated = t(translationKey)

  return translated === translationKey ? status : translated
}

function resolveChannelLabel(channel: string | null | undefined) {
  if (!channel) {
    return t('notificationManagement.channels.unknown')
  }

  const key = normalizeKey(channel)
  const translationKey = `notificationManagement.channels.${key}`
  const translated = t(translationKey)

  return translated === translationKey ? channel : translated
}

const viewDialog = ref(false)
const viewNotification = ref<AdminNotification | null>(null)
const viewError = ref('')

const viewNotificationId = computed(() => viewNotification.value?.id ?? null)

const viewDetail = computed<AdminNotificationDetail | null>(() => {
  const id = viewNotificationId.value
  if (!id) {
    return null
  }

  return notificationStore.notificationDetails[id] ?? null
})

const resolvedViewNotification = computed<AdminNotificationDetail | AdminNotification | null>(
  () => viewDetail.value ?? viewNotification.value,
)

const viewLoading = computed(() => {
  const id = viewNotificationId.value
  if (!id) {
    return false
  }

  return Boolean(notificationStore.notificationDetailPending[id])
})

const viewDetailError = computed(() => {
  const id = viewNotificationId.value
  if (!id) {
    return null
  }

  const detailError = notificationStore.notificationDetailError[id]
  if (!detailError) {
    return viewError.value ? viewError.value : null
  }

  return resolveErrorMessage(
    detailError,
    t('notificationManagement.notifications.detailLoadFailed'),
  )
})

async function openView(notification: AdminNotification) {
  viewNotification.value = notification
  viewError.value = ''
  viewDialog.value = true

  try {
    await notificationStore.fetchNotificationDetail(notification.id)
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.notifications.detailLoadFailed'),
    )
    viewError.value = message
    Notify.error(message)
  }
}

watch(viewDialog, (open) => {
  if (!open) {
    viewNotification.value = null
    viewError.value = ''
  }
})

function closeView() {
  viewDialog.value = false
  viewNotification.value = null
  viewError.value = ''
}

const statusDialog = ref(false)
const statusNotification = ref<AdminNotification | null>(null)
const statusForm = reactive<{ status: string }>({ status: '' })
const statusError = ref('')
const statusLoading = ref(false)

const statusNotificationId = computed(() => statusNotification.value?.id ?? null)

const knownStatuses = ['pending', 'processing', 'sent', 'failed', 'cancelled']

const statusOptions = computed(() => {
  const candidates = new Map<string, string>()

  const registerStatus = (value: string | null | undefined) => {
    if (!value || typeof value !== 'string') {
      return
    }

    const normalized = normalizeKey(value)
    if (!candidates.has(normalized)) {
      candidates.set(normalized, value)
    }
  }

  knownStatuses.forEach(registerStatus)

  for (const item of notificationsRef.value ?? []) {
    registerStatus(item.status)
  }

  const id = statusNotificationId.value
  if (id) {
    const detail = notificationStore.notificationDetails[id]
    registerStatus(detail?.status ?? statusNotification.value?.status ?? '')
    detail?.attempts?.forEach((attempt) => registerStatus(attempt.status))
  }

  return Array.from(candidates.values())
    .sort((a, b) => {
      const normalizedA = normalizeKey(a)
      const normalizedB = normalizeKey(b)
      const priorityA = statusPriority[normalizedA] ?? 100
      const priorityB = statusPriority[normalizedB] ?? 100

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      return resolveStatusLabel(a).localeCompare(resolveStatusLabel(b))
    })
    .map((value) => ({
      value,
      label: resolveStatusLabel(value),
    }))
})

watch(statusDialog, (open) => {
  if (open) {
    if (!statusForm.status && statusOptions.value.length > 0) {
      statusForm.status = statusOptions.value[0]?.value ?? ''
    }
  } else {
    statusNotification.value = null
    statusForm.status = ''
    statusError.value = ''
  }
})

function openStatus(notification: AdminNotification) {
  statusNotification.value = notification
  statusForm.status = notification.status ?? ''
  statusError.value = ''
  statusDialog.value = true
}

async function submitStatus() {
  if (!statusNotificationId.value) {
    return
  }

  statusLoading.value = true
  statusError.value = ''

  try {
    const updated = await notificationStore.updateNotificationStatus(
      statusNotificationId.value,
      { status: statusForm.status },
    )

    const label = resolveStatusLabel(statusForm.status)
    Notify.success(
      t('notificationManagement.notifications.statusUpdated', { status: label }),
    )

    if (updated) {
      statusNotification.value = updated
      viewNotification.value =
        viewNotification.value && viewNotification.value.id === updated.id
          ? updated
          : viewNotification.value
    }

    statusDialog.value = false
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.notifications.statusUpdateFailed'),
    )
    statusError.value = message
    Notify.error(message)
  } finally {
    statusLoading.value = false
  }
}

async function refresh() {
  try {
    await notificationStore.refreshNotifications()
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.notifications.loadFailed'),
    )
    Notify.error(message)
  }
}
</script>

<template>
  <v-container fluid class="py-6">
    <AdminDataTable
      v-model:search="search"
      :headers="headers"
      :items="filteredNotifications"
      :loading="pending"
      :error="tableError"
      :title="t('notificationManagement.title')"
      :subtitle="t('notificationManagement.subtitle')"
      :search-placeholder="t('notificationManagement.filters.search')"
      color="primary"
      item-value="id"
      @refresh="refresh"
    >
      <template #[`item.channel`]="{ value }">
        {{ resolveChannelLabel(value) }}
      </template>

      <template #[`item.status`]="{ value }">
        <v-chip
          :color="resolveStatusColor(value)"
          class="text-uppercase font-weight-semibold"
          size="small"
          variant="flat"
        >
          {{ resolveStatusLabel(value) }}
        </v-chip>
      </template>

      <template #[`item.createdAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.scheduledFor`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.sentAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex align-center justify-end gap-2">
          <AppButton
            variant="text"
            color="primary"
            size="small"
            density="comfortable"
            :icon="'mdi-eye-outline'"
            :aria-label="t('notificationManagement.actions.view', { subject: item.subject })"
            @click="openView(item)"
          />
          <AppButton
            variant="text"
            color="secondary"
            size="small"
            density="comfortable"
            :icon="'mdi-clipboard-check-outline'"
            :aria-label="t('notificationManagement.actions.updateStatus', { subject: item.subject })"
            @click="openStatus(item)"
          />
        </div>
      </template>
    </AdminDataTable>

    <v-dialog v-model="viewDialog" max-width="720" scrollable>
      <v-card>
        <v-card-title class="d-flex flex-column align-start">
          <span class="text-h6 font-weight-semibold">
            {{ t('notificationManagement.dialogs.view.title') }}
          </span>
          <span class="text-caption text-medium-emphasis">
            {{ resolvedViewNotification?.id }}
          </span>
        </v-card-title>

        <v-card-text>
          <v-alert
            v-if="viewDetailError"
            type="error"
            class="mb-4"
            variant="tonal"
            border="start"
            :text="viewDetailError"
          />

          <div v-if="viewLoading" class="d-flex justify-center my-8">
            <v-progress-circular color="primary" indeterminate />
          </div>

          <div v-else-if="resolvedViewNotification" class="d-flex flex-column gap-6">
            <div class="d-grid info-grid">
              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.subject') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ resolvedViewNotification.subject }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.status') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ resolveStatusLabel(resolvedViewNotification.status) }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.recipient') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ resolvedViewNotification.recipient }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.channel') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ resolveChannelLabel(resolvedViewNotification.channel) }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.createdAt') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ formatDate(resolvedViewNotification.createdAt) }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.updatedAt') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ formatDate(resolvedViewNotification.updatedAt) }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.scheduledFor') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ formatDate(resolvedViewNotification.scheduledFor) }}
                </p>
              </div>

              <div>
                <span class="text-caption text-medium-emphasis">
                  {{ t('notificationManagement.labels.sentAt') }}
                </span>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ formatDate(resolvedViewNotification.sentAt) }}
                </p>
              </div>
            </div>

            <div v-if="resolvedViewNotification.message" class="notification-section">
              <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                {{ t('notificationManagement.labels.message') }}
              </h3>
              <v-sheet class="pa-4" border rounded>
                <pre
                  class="mb-0 text-body-2"
                  v-text="resolvedViewNotification.message"
                />
              </v-sheet>
            </div>

            <div
              v-if="resolvedViewNotification.metadata && Object.keys(resolvedViewNotification.metadata).length > 0"
              class="notification-section"
            >
              <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                {{ t('notificationManagement.labels.metadata') }}
              </h3>
              <v-sheet class="pa-4" border rounded>
                <pre
                  class="mb-0 text-body-2"
                  v-text="JSON.stringify(resolvedViewNotification.metadata, null, 2)"
                />
              </v-sheet>
            </div>

            <div
              v-if="viewDetail?.payload && Object.keys(viewDetail.payload).length > 0"
              class="notification-section"
            >
              <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                {{ t('notificationManagement.labels.payload') }}
              </h3>
              <v-sheet class="pa-4" border rounded>
                <pre
                  class="mb-0 text-body-2"
                  v-text="JSON.stringify(viewDetail.payload, null, 2)"
                />
              </v-sheet>
            </div>

            <div
              v-if="viewDetail?.context && Object.keys(viewDetail.context).length > 0"
              class="notification-section"
            >
              <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                {{ t('notificationManagement.labels.context') }}
              </h3>
              <v-sheet class="pa-4" border rounded>
                <pre
                  class="mb-0 text-body-2"
                  v-text="JSON.stringify(viewDetail.context, null, 2)"
                />
              </v-sheet>
            </div>

            <div
              v-if="viewDetail?.attempts && viewDetail.attempts.length > 0"
              class="notification-section"
            >
              <h3 class="text-subtitle-1 font-weight-semibold mb-2">
                {{ t('notificationManagement.labels.attempts') }}
              </h3>
              <v-timeline density="compact" side="end" truncate-line="both">
                <v-timeline-item
                  v-for="attempt in viewDetail.attempts"
                  :key="`${attempt.status}-${attempt.occurredAt}`"
                  :color="resolveStatusColor(attempt.status)"
                  size="small"
                >
                  <v-card elevation="0" border rounded>
                    <v-card-title class="py-3 d-flex flex-column align-start">
                      <span class="text-subtitle-2 font-weight-semibold">
                        {{ resolveStatusLabel(attempt.status) }}
                      </span>
                      <span class="text-caption text-medium-emphasis">
                        {{ formatDate(attempt.occurredAt) }}
                      </span>
                    </v-card-title>
                    <v-card-text v-if="attempt.description" class="pt-0">
                      <p class="text-body-2 mb-0">
                        {{ attempt.description }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </div>
          </div>

          <div v-else class="text-center py-8 text-medium-emphasis">
            {{ t('notificationManagement.labels.emptyMetadata') }}
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <AppButton variant="text" color="secondary" @click="closeView">
            {{ t('common.actions.close') }}
          </AppButton>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="statusDialog" max-width="480">
      <v-card>
        <v-card-title class="text-h6 font-weight-semibold">
          {{ t('notificationManagement.dialogs.status.title') }}
        </v-card-title>
        <v-card-subtitle class="text-body-2">
          {{ t('notificationManagement.dialogs.status.description') }}
        </v-card-subtitle>

        <v-card-text>
          <v-alert
            v-if="statusError"
            type="error"
            class="mb-4"
            variant="tonal"
            border="start"
            :text="statusError"
          />

          <v-select
            v-model="statusForm.status"
            :items="statusOptions"
            :label="t('notificationManagement.forms.status.label')"
            :hint="t('notificationManagement.forms.status.hint')"
            persistent-hint
            item-title="label"
            item-value="value"
            density="comfortable"
          />
        </v-card-text>

        <v-card-actions class="justify-end">
          <AppButton
            variant="text"
            color="secondary"
            :disabled="statusLoading"
            @click="statusDialog = false"
          >
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="primary"
            :loading="statusLoading"
            :disabled="!statusForm.status"
            @click="submitStatus"
          >
            {{ t('notificationManagement.forms.status.submit') }}
          </AppButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.notification-section pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.notification-section :deep(.v-sheet) {
  background-color: rgba(var(--v-theme-surface-variant), 0.24);
}

:deep(.v-select .v-field) {
  border-radius: 16px;
}

:deep(.v-select .v-field__input) {
  padding-top: 18px;
  padding-bottom: 14px;
}
</style>
