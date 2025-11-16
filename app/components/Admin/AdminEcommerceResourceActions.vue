<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AdminEntityTreePreview from '~/components/Admin/AdminEntityTreePreview.vue'
import type { AdminEntityPreviewNode } from '~/types/adminEntityPreview'

const props = withDefaults(
  defineProps<{
    showUrl?: string | null
    editUrl?: string | null
    deleteUrl?: string | null
  }>(),
  {
    showUrl: null,
    editUrl: null,
    deleteUrl: null,
  },
)

const { t } = useI18n()
const requestFetch = useRequestFetch()

const normalizedLinks = computed(() => ({
  show: normalizeUrl(props.showUrl),
  edit: normalizeUrl(props.editUrl),
  delete: normalizeUrl(props.deleteUrl),
}))

function normalizeUrl(url?: string | null) {
  if (typeof url !== 'string') {
    return null
  }

  const trimmed = url.trim()
  return trimmed.length > 0 ? trimmed : null
}

const tooltipLocation = 'bottom' as const

const buttonProps = {
  variant: 'text',
  size: 'small',
}

type ActionType = 'show' | 'edit' | 'delete'

const dialog = ref(false)
const activeAction = ref<ActionType | null>(null)
const actionLoading = ref(false)
const actionError = ref<string | null>(null)
const actionPayload = ref<string>('')
const responsePreview = ref<unknown>(null)
const deleteSuccess = ref(false)
const updateSuccess = ref(false)

const actionEndpoint = computed(() =>
  activeAction.value ? normalizedLinks.value[activeAction.value] : null,
)

const responseTree = computed<AdminEntityPreviewNode[]>(() =>
  buildPreviewTree(responsePreview.value ?? null),
)

const dialogTitle = computed(() => {
  switch (activeAction.value) {
    case 'show':
      return t('admin.ecommerce.entityManager.actions.load')
    case 'edit':
      return t('admin.ecommerce.entityManager.actions.update')
    case 'delete':
      return t('admin.ecommerce.entityManager.actions.delete')
    default:
      return ''
  }
})

const helperText = computed(() => {
  if (!actionEndpoint.value) {
    return null
  }

  return t('admin.ecommerce.entityManager.helper', {
    path: actionEndpoint.value,
  })
})

watch(dialog, (isOpen) => {
  if (!isOpen) {
    resetDialog()
  }
})

function resetDialog() {
  activeAction.value = null
  actionLoading.value = false
  actionError.value = null
  actionPayload.value = ''
  responsePreview.value = null
  deleteSuccess.value = false
  updateSuccess.value = false
}

function buildPreviewTree(
  value: unknown,
  path = 'root',
): AdminEntityPreviewNode[] {
  if (value === null || value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const id = `${path}-${index}`
      if (isPrimitive(item)) {
        return {
          id,
          title: `[${index}]`,
          value: formatPrimitive(item),
        }
      }

      return {
        id,
        title: `[${index}]`,
        children: buildPreviewTree(item, id),
      }
    })
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(
      ([key, entry]) => {
        const id = `${path}-${key}`
        if (isPrimitive(entry)) {
          return {
            id,
            title: key,
            value: formatPrimitive(entry),
          }
        }

        return {
          id,
          title: key,
          children: buildPreviewTree(entry, id),
        }
      },
    )
  }

  return [
    {
      id: path,
      title: path,
      value: formatPrimitive(value),
    },
  ]
}

function isPrimitive(value: unknown): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

function formatPrimitive(value: string | number | boolean | null): string {
  if (value === null) {
    return 'null'
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return String(value)
}

async function openAction(action: ActionType) {
  const endpoint = normalizedLinks.value[action]
  if (!endpoint) {
    return
  }

  activeAction.value = action
  dialog.value = true
  actionError.value = null
  actionPayload.value = ''
  responsePreview.value = null
  deleteSuccess.value = false
  updateSuccess.value = false

  if (action === 'delete') {
    return
  }

  await loadResource(endpoint)
}

async function loadResource(endpoint: string) {
  try {
    actionLoading.value = true
    const data = await requestFetch(endpoint, {
      method: 'GET',
    })
    responsePreview.value = data
    actionPayload.value = JSON.stringify(data, null, 2)
  } catch (error) {
    console.error(error)
    actionError.value = resolveErrorMessage(error)
  } finally {
    actionLoading.value = false
  }
}

async function submitUpdate() {
  if (!actionEndpoint.value) {
    return
  }

  let parsedPayload: unknown
  try {
    parsedPayload = actionPayload.value
      ? JSON.parse(actionPayload.value)
      : undefined
  } catch {
    actionError.value = t('admin.ecommerce.entityManager.errors.payloadInvalid')
    return
  }

  try {
    actionLoading.value = true
    const data = await requestFetch(actionEndpoint.value, {
      method: 'PUT',
      body: parsedPayload,
    })
    responsePreview.value = data
    actionPayload.value = JSON.stringify(data, null, 2)
    updateSuccess.value = true
  } catch (error) {
    console.error(error)
    actionError.value = resolveErrorMessage(error)
  } finally {
    actionLoading.value = false
  }
}

async function confirmDelete() {
  if (!actionEndpoint.value) {
    return
  }

  try {
    actionLoading.value = true
    await requestFetch(actionEndpoint.value, {
      method: 'DELETE',
    })
    deleteSuccess.value = true
  } catch (error) {
    console.error(error)
    actionError.value = resolveErrorMessage(error)
  } finally {
    actionLoading.value = false
  }
}

function resolveErrorMessage(error: unknown): string {
  const defaultMessage = t('common.unexpectedError')

  if (!error) {
    return defaultMessage
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message || defaultMessage
  }

  if (typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data
    if (data?.message) {
      return data.message
    }
  }

  return defaultMessage
}

const isShowDisabled = computed(() => !normalizedLinks.value.show)
const isEditDisabled = computed(() => !normalizedLinks.value.edit)
const isDeleteDisabled = computed(() => !normalizedLinks.value.delete)
</script>

<template>
  <div class="admin-ecommerce-actions">
    <v-tooltip
      v-if="normalizedLinks.show"
      :text="t('common.actions.view')"
      :location="tooltipLocation"
    >
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="{ ...buttonProps, ...tooltipProps }"
          :disabled="isShowDisabled"
          icon="mdi-eye-outline"
          color="primary"
          @click="openAction('show')"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      v-if="normalizedLinks.edit"
      :text="t('common.actions.edit')"
      :location="tooltipLocation"
    >
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="{ ...buttonProps, ...tooltipProps }"
          :disabled="isEditDisabled"
          icon="mdi-pencil-outline"
          color="warning"
          @click="openAction('edit')"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      v-if="normalizedLinks.delete"
      :text="t('common.actions.delete')"
      :location="tooltipLocation"
    >
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="{ ...buttonProps, ...tooltipProps }"
          :disabled="isDeleteDisabled"
          icon="mdi-delete-outline"
          color="error"
          @click="openAction('delete')"
        />
      </template>
    </v-tooltip>
  </div>

  <v-dialog v-model="dialog" max-width="720">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <div v-if="helperText" class="mb-4">
          <v-alert type="info" variant="tonal">
            {{ helperText }}
          </v-alert>
        </div>

        <v-progress-linear
          v-if="actionLoading"
          color="primary"
          indeterminate
          class="mb-4"
        />

        <v-alert v-if="actionError" type="error" variant="tonal" class="mb-4">
          {{ actionError }}
        </v-alert>

        <v-alert
          v-if="deleteSuccess && activeAction === 'delete'"
          type="success"
          variant="tonal"
          class="mb-4"
        >
          {{ t('admin.ecommerce.entityManager.notifications.deleteSuccess') }}
        </v-alert>

        <v-alert
          v-if="updateSuccess && activeAction === 'edit'"
          type="success"
          variant="tonal"
          class="mb-4"
        >
          {{ t('admin.ecommerce.entityManager.notifications.updateSuccess') }}
        </v-alert>

        <div v-if="activeAction === 'delete'" class="mb-4">
          <p class="text-body-2">
            {{ t('admin.ecommerce.entityManager.dialogs.deleteConfirm') }}
          </p>
        </div>

        <div v-else-if="activeAction === 'edit'">
          <v-textarea
            v-model="actionPayload"
            :label="t('admin.ecommerce.entityManager.fields.payload')"
            auto-grow
            rows="8"
            variant="outlined"
            class="mb-4"
            :disabled="actionLoading"
          />

          <AdminEntityTreePreview
            :title="t('admin.ecommerce.entityManager.preview.title')"
            :empty-text="t('admin.ecommerce.entityManager.preview.empty')"
            :nodes="responseTree"
          />
        </div>

        <div v-else-if="activeAction === 'show'">
          <AdminEntityTreePreview
            :title="t('admin.ecommerce.entityManager.preview.title')"
            :empty-text="t('admin.ecommerce.entityManager.preview.empty')"
            :nodes="responseTree"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="actionEndpoint"
          :href="actionEndpoint"
          target="_blank"
          rel="noopener"
          variant="text"
        >
          {{ t('admin.ecommerce.entityManager.table.endpoint') }}
        </v-btn>
        <v-btn variant="text" @click="dialog = false">
          {{ t('common.actions.close') }}
        </v-btn>
        <v-btn
          v-if="activeAction === 'edit'"
          color="primary"
          :loading="actionLoading"
          :disabled="actionLoading"
          @click="submitUpdate"
        >
          {{ t('admin.ecommerce.entityManager.actions.update') }}
        </v-btn>
        <v-btn
          v-else-if="activeAction === 'delete'"
          color="error"
          :loading="actionLoading"
          :disabled="actionLoading"
          @click="confirmDelete"
        >
          {{ t('admin.ecommerce.entityManager.actions.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.admin-ecommerce-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

</style>
