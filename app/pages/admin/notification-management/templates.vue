<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'

import AdminDataTable from '~/components/Admin/AdminDataTable.vue'
import AppButton from '~/components/ui/AppButton.vue'
import { Notify } from '~/stores/notification'
import { useNotificationTemplatesStore } from '~/stores/notificationTemplates'
import {
  createDateFormatter,
  formatDateValue,
  type DateInput,
} from '~/utils/formatters'
import type { NotificationTemplate } from '~/types/notification'

const { t, locale } = useI18n()

definePageMeta({
  title: 'notificationManagement.navigation.templates',
  icon: 'mdi-file-document-multiple-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const templateStore = useNotificationTemplatesStore()
const {
  templates,
  templatesPending: pending,
  templatesError: error,
  uploadPending,
  uploadError,
} = storeToRefs(templateStore)

await templateStore.fetchTemplates()

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('notificationManagement.templates.table.name'), key: 'name' },
  {
    title: t('notificationManagement.templates.table.templateId'),
    key: 'templateId',
  },
  { title: t('notificationManagement.templates.table.locale'), key: 'locale' },
  {
    title: t('notificationManagement.templates.table.updatedAt'),
    key: 'updatedAt',
  },
  {
    title: t('notificationManagement.templates.table.createdAt'),
    key: 'createdAt',
  },
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

const filteredTemplates = computed<NotificationTemplate[]>(() => {
  const items = templates.value ?? []
  const term = normalizeSearch(search.value)

  if (!term) {
    return items
  }

  return items.filter((template) => {
    const fields = [
      template.name,
      template.locale,
      template.id,
      template.templateId,
      template.updatedAt,
      template.createdAt,
    ]
      .filter((field) => field != null)
      .map((field) => String(field).toLowerCase())

    return fields.some((field) => field.includes(term))
  })
})

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

const tableError = computed(() => {
  if (!error.value) {
    return null
  }

  return resolveErrorMessage(
    error.value,
    t('notificationManagement.templates.notifications.loadFailed'),
  )
})

const dateFormatter = createDateFormatter(locale)

const formatDate = (value: DateInput) =>
  formatDateValue(
    value,
    dateFormatter.value,
    t('notificationManagement.labels.notAvailable'),
  )

function formatLocale(value: string | null | undefined) {
  if (!value) {
    return t('notificationManagement.templates.labels.anyLocale')
  }

  return value
}

const viewDialog = ref(false)
const viewTemplate = ref<NotificationTemplate | null>(null)
const viewTemplateId = computed(() => viewTemplate.value?.id ?? null)
const viewDetail = computed<NotificationTemplate | null>(() => {
  const id = viewTemplateId.value
  if (!id) {
    return null
  }

  return templateStore.templateDetails[id] ?? null
})

const resolvedViewTemplate = computed<NotificationTemplate | null>(
  () => viewDetail.value ?? viewTemplate.value,
)

const viewPending = computed(() => {
  const id = viewTemplateId.value
  if (!id) {
    return false
  }

  return Boolean(templateStore.templateDetailPending[id])
})

const viewErrorMessage = computed(() => {
  const id = viewTemplateId.value
  if (!id) {
    return ''
  }

  const templateError = templateStore.templateDetailError[id]
  if (!templateError) {
    return ''
  }

  return resolveErrorMessage(
    templateError,
    t('notificationManagement.templates.notifications.detailLoadFailed'),
  )
})

const hasVariables = computed(() => {
  const template = resolvedViewTemplate.value
  if (!template || !template.variables) {
    return false
  }

  return Object.keys(template.variables).length > 0
})

async function openView(template: NotificationTemplate) {
  viewTemplate.value = template
  viewDialog.value = true

  const id = template.id?.trim?.() ?? ''
  if (!id) {
    return
  }

  try {
    await templateStore.fetchTemplate(id)
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.templates.notifications.detailLoadFailed'),
    )
    Notify.error(message)
  }
}

function closeView() {
  viewDialog.value = false
}

watch(viewDialog, (value) => {
  if (!value) {
    viewTemplate.value = null
  }
})

async function refresh() {
  try {
    await templateStore.refreshTemplates()
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.templates.notifications.loadFailed'),
    )
    Notify.error(message)
  }
}

const uploadDialog = ref(false)
const uploadFile = ref<File | null>(null)
const uploadErrorMessage = ref('')

watch(uploadDialog, (value) => {
  if (!value) {
    uploadFile.value = null
    uploadErrorMessage.value = ''
  }
})

function handleFileChange(files: File | File[] | null | undefined) {
  if (Array.isArray(files)) {
    uploadFile.value = files[0] ?? null
  } else if (files instanceof File) {
    uploadFile.value = files
  } else {
    uploadFile.value = null
  }
}

async function submitUpload() {
  uploadErrorMessage.value = ''

  if (!uploadFile.value) {
    uploadErrorMessage.value = t(
      'notificationManagement.templates.forms.upload.fileRequired',
    )
    return
  }

  const formData = new FormData()
  formData.append('file', uploadFile.value)

  try {
    await templateStore.uploadTemplate(formData)
    Notify.success(
      t('notificationManagement.templates.notifications.uploadSuccess'),
    )
    uploadDialog.value = false
  } catch (err) {
    const message = resolveErrorMessage(
      err,
      t('notificationManagement.templates.notifications.uploadFailed'),
    )
    uploadErrorMessage.value = message
    Notify.error(message)
  }
}
</script>

<template>
  <v-container fluid class="py-6">
    <AdminDataTable
      v-model:search="search"
      :headers="headers"
      :items="filteredTemplates"
      :loading="pending"
      :error="tableError"
      :title="t('notificationManagement.templates.title')"
      :subtitle="t('notificationManagement.templates.subtitle')"
      :search-placeholder="t('notificationManagement.templates.filters.search')"
      color="primary"
      item-value="id"
      @refresh="refresh"
    >
      <template #header-actions>
        <div class="d-flex gap-2">
          <AppButton
            color="primary"
            variant="tonal"
            :icon="'mdi-upload-outline'"
            :loading="uploadPending"
            @click="uploadDialog = true"
          >
            {{ t('notificationManagement.templates.actions.upload') }}
          </AppButton>
          <AppButton
            color="primary"
            variant="text"
            :icon="'mdi-refresh'"
            :loading="pending"
            @click="refresh"
          >
            {{ t('notificationManagement.templates.actions.refresh') }}
          </AppButton>
        </div>
      </template>

      <template #[`item.locale`]="{ value }">
        {{ formatLocale(value) }}
      </template>

      <template #[`item.updatedAt`]="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #[`item.createdAt`]="{ value }">
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
            :aria-label="t('notificationManagement.templates.actions.view', { name: item.name })"
            @click="openView(item)"
          >
            {{ t('notificationManagement.templates.actions.viewLabel') }}
          </AppButton>
        </div>
      </template>
    </AdminDataTable>

    <v-dialog v-model="viewDialog" max-width="720" scrollable>
      <v-card>
        <v-toolbar density="comfortable" color="primary" dark>
          <v-toolbar-title>
            {{ t('notificationManagement.templates.dialogs.view.title') }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="closeView" />
        </v-toolbar>

        <v-card-text>
          <v-skeleton-loader
            v-if="viewPending"
            type="article, list-item"
            class="mb-6"
          />

          <v-alert
            v-else-if="viewErrorMessage"
            type="error"
            border="start"
            class="mb-6"
            :text="viewErrorMessage"
          />

          <div v-else-if="resolvedViewTemplate" class="d-flex flex-column gap-4">
            <div>
              <h3 class="text-subtitle-1 mb-1">
                {{ t('notificationManagement.templates.labels.name') }}
              </h3>
              <p class="text-body-2">
                {{ resolvedViewTemplate.name }}
              </p>
            </div>

            <div class="d-flex flex-wrap gap-4">
              <div class="flex-grow-1 min-w-0">
                <h3 class="text-subtitle-1 mb-1">
                  {{ t('notificationManagement.templates.labels.identifier') }}
                </h3>
                <p class="text-body-2">
                  {{ resolvedViewTemplate.id }}
                </p>
              </div>

              <div class="flex-grow-1 min-w-0">
                <h3 class="text-subtitle-1 mb-1">
                  {{ t('notificationManagement.templates.labels.templateId') }}
                </h3>
                <p class="text-body-2">
                  {{ resolvedViewTemplate.templateId }}
                </p>
              </div>

              <div class="flex-grow-1 min-w-0">
                <h3 class="text-subtitle-1 mb-1">
                  {{ t('notificationManagement.templates.labels.locale') }}
                </h3>
                <p class="text-body-2">
                  {{ formatLocale(resolvedViewTemplate.locale) }}
                </p>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-4">
              <div class="flex-grow-1 min-w-0">
                <h3 class="text-subtitle-1 mb-1">
                  {{ t('notificationManagement.templates.labels.createdAt') }}
                </h3>
                <p class="text-body-2">
                  {{ formatDate(resolvedViewTemplate.createdAt ?? '') }}
                </p>
              </div>

              <div class="flex-grow-1 min-w-0">
                <h3 class="text-subtitle-1 mb-1">
                  {{ t('notificationManagement.templates.labels.updatedAt') }}
                </h3>
                <p class="text-body-2">
                  {{ formatDate(resolvedViewTemplate.updatedAt ?? '') }}
                </p>
              </div>
            </div>

            <div>
              <h3 class="text-subtitle-1 mb-1">
                {{ t('notificationManagement.templates.labels.variables') }}
              </h3>
              <div v-if="hasVariables" class="pa-4 rounded-lg bg-surface-variant">
                <pre class="text-body-2 mb-0">
{{ JSON.stringify(resolvedViewTemplate.variables, null, 2) }}
                </pre>
              </div>
              <p v-else class="text-body-2 mb-0">
                {{ t('notificationManagement.templates.labels.emptyVariables') }}
              </p>
            </div>
          </div>
          <p v-else class="text-body-2">
            {{ t('notificationManagement.templates.notifications.detailUnavailable') }}
          </p>
        </v-card-text>

        <v-card-actions class="justify-end">
          <AppButton variant="text" @click="closeView">
            {{ t('common.actions.close') }}
          </AppButton>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="uploadDialog" max-width="520">
      <v-card>
        <v-toolbar density="comfortable" color="primary" dark>
          <v-toolbar-title>
            {{ t('notificationManagement.templates.dialogs.upload.title') }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="uploadDialog = false" />
        </v-toolbar>

        <v-card-text class="d-flex flex-column gap-4">
          <p class="text-body-2">
            {{ t('notificationManagement.templates.dialogs.upload.description') }}
          </p>

          <v-file-input
            :label="t('notificationManagement.templates.forms.upload.fileLabel')"
            :hint="t('notificationManagement.templates.forms.upload.fileHint')"
            show-size
            accept=".json,.zip,.yaml,.yml,.txt"
            prepend-icon="mdi-file-upload-outline"
            :disabled="uploadPending"
            @update:model-value="handleFileChange"
          />

          <v-alert
            v-if="uploadErrorMessage"
            type="error"
            border="start"
            :text="uploadErrorMessage"
          />

          <v-alert
            v-else-if="uploadError.value"
            type="error"
            border="start"
            :text="resolveErrorMessage(uploadError.value, t('notificationManagement.templates.notifications.uploadFailed'))"
          />
        </v-card-text>

        <v-card-actions class="justify-end">
          <AppButton variant="text" @click="uploadDialog = false">
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="primary"
            :loading="uploadPending"
            @click="submitUpload"
          >
            {{ t('notificationManagement.templates.forms.upload.submit') }}
          </AppButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
