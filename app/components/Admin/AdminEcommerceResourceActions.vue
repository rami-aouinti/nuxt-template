<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

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
const responsePreview = ref<unknown>(null)
const deleteSuccess = ref(false)
const updateSuccess = ref(false)
const entityFields = ref<EntityField[]>([])
const entityRelations = ref<EntityRelationGroup[]>([])
const entityTitle = ref('')
const editForm = reactive<Record<string, EntityFieldValue | undefined>>({})

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
  responsePreview.value = null
  deleteSuccess.value = false
  updateSuccess.value = false
  entityFields.value = []
  entityRelations.value = []
  entityTitle.value = ''
  resetEditForm()
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
  responsePreview.value = null
  deleteSuccess.value = false
  updateSuccess.value = false

  if (action === 'delete') {
    // Try to use previously loaded data to display a summary in the dialog.
    if (!responsePreview.value && normalizedLinks.value.show) {
      await loadResource(normalizedLinks.value.show)
    }
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
    hydrateEntityState(data)
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

  const payload = buildEditPayload()
  if (!payload) {
    actionError.value = t('admin.ecommerce.entityManager.errors.payloadInvalid')
    return
  }

  try {
    actionLoading.value = true
    const data = await requestFetch(actionEndpoint.value, {
      method: 'PUT',
      body: payload,
    })
    responsePreview.value = data
    hydrateEntityState(data)
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
const hasEditableFields = computed(() => entityFields.value.length > 0)
const hasRelations = computed(() => entityRelations.value.length > 0)

type EntityFieldValue = string | number | boolean | null
type EntityFieldType = 'string' | 'number' | 'boolean'

interface EntityField {
  key: string
  label: string
  type: EntityFieldType
  value: EntityFieldValue
}

interface EntityRelationItem {
  id: string
  primary: string
  secondary?: string | null
}

interface EntityRelationGroup {
  title: string
  items: EntityRelationItem[]
}

function hydrateEntityState(value: unknown) {
  if (!value || typeof value !== 'object') {
    entityFields.value = []
    entityRelations.value = []
    entityTitle.value = ''
    resetEditForm()
    return
  }

  const entity = value as Record<string, unknown>
  entityFields.value = extractEntityFields(entity)
  entityRelations.value = extractEntityRelations(entity)
  entityTitle.value = resolveEntityTitle(entity)
  resetEditForm(entityFields.value)
}

function resetEditForm(fields: EntityField[] = []) {
  Object.keys(editForm).forEach((key) => {
    editForm[key] = undefined
  })
  for (const field of fields) {
    editForm[field.key] = field.value
  }
}

function extractEntityFields(entity: Record<string, unknown>): EntityField[] {
  return Object.entries(entity)
    .filter(([key, entry]) => isScalarField(key, entry))
    .map(([key, entry]) => ({
      key,
      label: formatFieldLabel(key),
      type: resolveFieldType(entry),
      value: normalizeScalar(entry),
    }))
}

function isScalarField(key: string, value: unknown): boolean {
  if (key.startsWith('@')) {
    return false
  }
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}

function resolveFieldType(value: unknown): EntityFieldType {
  if (typeof value === 'number') {
    return 'number'
  }
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  return 'string'
}

function normalizeScalar(value: unknown): EntityFieldValue {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  return null
}

function extractEntityRelations(
  entity: Record<string, unknown>,
): EntityRelationGroup[] {
  const relations: EntityRelationGroup[] = []

  Object.entries(entity).forEach(([key, value]) => {
    if (value === null || key.startsWith('@')) {
      return
    }

    if (Array.isArray(value)) {
      const items = buildRelationItemsFromArray(key, value)
      if (items.length) {
        relations.push({
          title: formatFieldLabel(key),
          items,
        })
      }
      return
    }

    if (typeof value === 'object') {
      const item = buildRelationItemFromObject(
        key,
        value as Record<string, unknown>,
      )
      if (item) {
        relations.push({
          title: formatFieldLabel(key),
          items: [item],
        })
      }
    }
  })

  return relations
}

function buildRelationItemsFromArray(
  key: string,
  value: unknown[],
): EntityRelationItem[] {
  return value
    .map((entry, index) => buildRelationItem(`${key}-${index}`, entry))
    .filter((item): item is EntityRelationItem => Boolean(item))
}

function buildRelationItem(id: string, value: unknown): EntityRelationItem | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return {
      id,
      primary: String(value),
    }
  }

  if (typeof value === 'boolean') {
    return {
      id,
      primary: value ? 'true' : 'false',
    }
  }

  if (typeof value === 'object') {
    return buildRelationItemFromObject(id, value as Record<string, unknown>)
  }

  return null
}

function buildRelationItemFromObject(
  id: string,
  value: Record<string, unknown>,
): EntityRelationItem | null {
  const labelKeys = ['name', 'code', 'title', 'label']
  for (const key of labelKeys) {
    const entry = value[key]
    if (typeof entry === 'string' && entry.trim().length > 0) {
      return {
        id,
        primary: entry,
        secondary: formatRelationSubtitle(value),
      }
    }
  }

  if (typeof value.id === 'string' || typeof value.id === 'number') {
    return {
      id,
      primary: String(value.id),
      secondary: formatRelationSubtitle(value),
    }
  }

  return null
}

function formatRelationSubtitle(value: Record<string, unknown>): string | null {
  const subtitleKeys = ['code', 'id', 'locale', 'type']
  for (const key of subtitleKeys) {
    const entry = value[key]
    if (
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean'
    ) {
      return `${formatFieldLabel(key)}: ${entry}`
    }
  }
  return null
}

function resolveEntityTitle(entity: Record<string, unknown>): string {
  const titleKeys = ['name', 'code', 'title', 'identifier', 'username']
  for (const key of titleKeys) {
    const entry = entity[key]
    if (typeof entry === 'string' && entry.trim().length > 0) {
      return entry
    }
  }

  if (typeof entity.id === 'string' || typeof entity.id === 'number') {
    return String(entity.id)
  }

  return t('admin.ecommerce.entityManager.fields.entity')
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function buildEditPayload(): Record<string, unknown> | null {
  if (!entityFields.value.length) {
    return null
  }

  const payload: Record<string, unknown> = {}
  for (const field of entityFields.value) {
    const value = editForm[field.key]
    if (value === undefined) {
      continue
    }

    if (field.type === 'number') {
      const parsed = typeof value === 'string' ? Number(value) : value
      if (Number.isFinite(parsed as number)) {
        payload[field.key] = parsed
      }
      continue
    }

    if (field.type === 'boolean') {
      payload[field.key] = Boolean(value)
      continue
    }

    if (typeof value === 'string') {
      payload[field.key] = value
    } else if (value === null) {
      payload[field.key] = null
    } else {
      payload[field.key] = value
    }
  }

  return Object.keys(payload).length > 0 ? payload : null
}

function formatFieldValue(value: EntityFieldValue): string {
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value === 'boolean') {
    return value ? t('common.enabled') : t('common.disabled')
  }
  return String(value)
}
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

  <v-dialog v-model="dialog" max-width="960">
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
          <p class="text-body-2 mb-2">
            {{ t('admin.ecommerce.entityManager.dialogs.deleteConfirm') }}
          </p>
          <p v-if="entityTitle" class="text-subtitle-1 font-weight-medium">
            {{ entityTitle }}
          </p>
        </div>

        <div v-else-if="activeAction === 'edit'" class="admin-ecommerce-actions__form">
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('admin.ecommerce.entityManager.forms.subtitle') }}
          </p>

          <v-alert
            v-if="!hasEditableFields && !actionLoading"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            {{ t('admin.ecommerce.entityManager.forms.empty') }}
          </v-alert>

          <v-form v-else @submit.prevent="submitUpdate">
            <v-row>
              <v-col
                v-for="field in entityFields"
                :key="field.key"
                cols="12"
                md="6"
              >
                <v-text-field
                  v-if="field.type === 'string'"
                  v-model="(editForm[field.key] as string | null)"
                  :label="field.label"
                  variant="outlined"
                  density="comfortable"
                  :disabled="actionLoading"
                />
                <v-text-field
                  v-else-if="field.type === 'number'"
                  v-model.number="(editForm[field.key] as number | null)"
                  type="number"
                  :label="field.label"
                  variant="outlined"
                  density="comfortable"
                  :disabled="actionLoading"
                />
                <v-switch
                  v-else-if="field.type === 'boolean'"
                  v-model="(editForm[field.key] as boolean | null)"
                  :label="field.label"
                  color="primary"
                  hide-details
                  :disabled="actionLoading"
                />
              </v-col>
            </v-row>
          </v-form>
        </div>

        <div v-else-if="activeAction === 'show'" class="admin-ecommerce-actions__details">
          <v-card variant="tonal" class="mb-4">
            <div class="admin-ecommerce-actions__details-header">
              <div>
                <p class="text-subtitle-1 mb-1">{{ entityTitle }}</p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ t('admin.ecommerce.entityManager.detailsCard.title') }}
                </p>
              </div>
            </div>

            <div v-if="entityFields.length" class="admin-ecommerce-actions__details-grid">
              <div
                v-for="field in entityFields"
                :key="field.key"
                class="admin-ecommerce-actions__details-item"
              >
                <p class="text-caption text-medium-emphasis mb-1">
                  {{ field.label }}
                </p>
                <p class="text-body-2 mb-0">
                  {{ formatFieldValue(field.value) }}
                </p>
              </div>
            </div>
            <p v-else class="text-body-2 mb-0">
              {{ t('admin.ecommerce.entityManager.detailsCard.empty') }}
            </p>
          </v-card>

          <v-card variant="outlined" class="mb-4">
            <div class="admin-ecommerce-actions__relations-header">
              <p class="text-subtitle-2 mb-1">
                {{ t('admin.ecommerce.entityManager.relations.title') }}
              </p>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ hasRelations
                  ? t('admin.ecommerce.entityManager.relations.subtitle')
                  : t('admin.ecommerce.entityManager.relations.empty')
                }}
              </p>
            </div>
            <div v-if="hasRelations" class="admin-ecommerce-actions__relations-content">
              <div
                v-for="group in entityRelations"
                :key="group.title"
                class="admin-ecommerce-actions__relation-group"
              >
                <p class="text-caption text-medium-emphasis mb-2">
                  {{ group.title }}
                </p>
                <div class="admin-ecommerce-actions__chips">
                  <v-chip
                    v-for="item in group.items"
                    :key="item.id"
                    variant="tonal"
                    color="primary"
                    size="small"
                    class="admin-ecommerce-actions__chip"
                  >
                    <span class="d-block">{{ item.primary }}</span>
                    <span
                      v-if="item.secondary"
                      class="text-caption text-medium-emphasis d-block"
                    >
                      {{ item.secondary }}
                    </span>
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card>

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
          :disabled="actionLoading || !hasEditableFields"
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

.admin-ecommerce-actions__form {
  min-height: 120px;
}

.admin-ecommerce-actions__details-header,
.admin-ecommerce-actions__relations-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.admin-ecommerce-actions__details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.admin-ecommerce-actions__details-item {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
}

.admin-ecommerce-actions__relations-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-ecommerce-actions__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-ecommerce-actions__chip {
  border-radius: 999px;
}

</style>
