<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import AdminEntityTreePreview from '~/components/Admin/AdminEntityTreePreview.vue'
import AppModal from '~/components/App/AppModal.vue'
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

const { t, locale } = useI18n()
const requestFetch = useRequestFetch()

const ECOMMERCE_BASE_URL = 'https://ecommerce.bro-world.org'
const ECOMMERCE_HOST = new URL(ECOMMERCE_BASE_URL).host
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])

const normalizedLinks = computed(() => ({
  show: normalizeUrl(props.showUrl),
  edit: normalizeUrl(props.editUrl),
  delete: normalizeUrl(props.deleteUrl),
}))

const actionButtons = computed<ActionButton[]>(() =>
  (Object.entries(ACTION_METADATA) as [ActionType, ActionMetadata][]).map(
    ([type, metadata]) => {
      const endpoint = normalizedLinks.value[type]
      return {
        ...metadata,
        type,
        endpoint,
        disabled: !endpoint,
      }
    },
  ),
)

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

interface ActionMetadata {
  icon: string
  color: string
  translationKey: string
}

interface ActionButton extends ActionMetadata {
  type: ActionType
  endpoint: string | null
  disabled: boolean
}

const ACTION_METADATA: Record<ActionType, ActionMetadata> = {
  show: {
    icon: 'mdi-eye-outline',
    color: 'primary',
    translationKey: 'common.actions.view',
  },
  edit: {
    icon: 'mdi-pencil-outline',
    color: 'warning',
    translationKey: 'common.actions.edit',
  },
  delete: {
    icon: 'mdi-delete-outline',
    color: 'error',
    translationKey: 'common.actions.delete',
  },
}

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

const relationDialog = ref(false)
const relationDialogTitle = ref('')
const relationDialogSubtitle = ref('')
const relationDialogEndpoint = ref<string | null>(null)
const relationDialogLoading = ref(false)
const relationDialogError = ref<string | null>(null)
const relationDialogPreview = ref<unknown>(null)

const actionEndpoint = computed(() =>
  activeAction.value ? normalizedLinks.value[activeAction.value] : null,
)

const relationPreviewTree = computed<AdminEntityPreviewNode[]>(() =>
  buildPreviewTree(relationDialogPreview.value ?? null),
)

const relationHelperText = computed(() => {
  if (!relationDialogEndpoint.value) {
    return null
  }

  return t('admin.ecommerce.entityManager.helper', {
    path: relationDialogEndpoint.value,
  })
})

watch(dialog, (isOpen) => {
  if (!isOpen) {
    resetDialog()
  }
})

watch(relationDialog, (isOpen) => {
  if (!isOpen) {
    resetRelationDialog()
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

function resetRelationDialog() {
  relationDialogTitle.value = ''
  relationDialogSubtitle.value = ''
  relationDialogEndpoint.value = null
  relationDialogLoading.value = false
  relationDialogError.value = null
  relationDialogPreview.value = null
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

const hasEditableFields = computed(() => entityFields.value.length > 0)
const hasRelations = computed(() => entityRelations.value.length > 0)

type EntityFieldValue = string | number | boolean | null
type EntityFieldType = 'string' | 'number' | 'boolean'
type EntityFieldDisplayType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'link'

interface EntityField {
  key: string
  label: string
  type: EntityFieldType
  value: EntityFieldValue
  displayType: EntityFieldDisplayType
  endpoint: string | null
}

interface EntityRelationItem {
  id: string
  primary: string
  secondary?: string | null
  endpoint?: string | null
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
      displayType: resolveFieldDisplayType(entry),
      endpoint: typeof entry === 'string' ? normalizeEndpoint(entry) : null,
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

function resolveFieldDisplayType(value: unknown): EntityFieldDisplayType {
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  if (typeof value === 'number') {
    return 'number'
  }
  if (typeof value === 'string') {
    const temporalType = detectTemporalType(value)
    if (temporalType) {
      return temporalType
    }
    if (normalizeEndpoint(value)) {
      return 'link'
    }
    if (isNumericString(value)) {
      return 'number'
    }
  }
  return 'text'
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

function isNumericString(value: string): boolean {
  if (!value.trim()) {
    return false
  }
  return !Number.isNaN(Number(value))
}

type TemporalFieldType = Extract<EntityFieldDisplayType, 'date' | 'datetime'>

function detectTemporalType(value: string): TemporalFieldType | null {
  const trimmed = value.trim()
  if (trimmed.length < 8 || !/[tT:\-\/]/.test(trimmed)) {
    return null
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return 'date'
  }

  if (
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/i.test(
      trimmed,
    )
  ) {
    return 'datetime'
  }

  const parsed = Date.parse(trimmed)
  if (Number.isNaN(parsed)) {
    return null
  }

  if (/[T ]\d{2}:\d{2}/.test(trimmed)) {
    return 'datetime'
  }

  return 'date'
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
      endpoint: extractEndpointFromValue(value),
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
  const endpoint = extractEndpointFromValue(value)
  const labelKeys = ['name', 'code', 'title', 'label']
  for (const key of labelKeys) {
    const entry = value[key]
    if (typeof entry === 'string' && entry.trim().length > 0) {
      return {
        id,
        primary: entry,
        secondary: formatRelationSubtitle(value),
        endpoint,
      }
    }
  }

  if (typeof value.id === 'string' || typeof value.id === 'number') {
    return {
      id,
      primary: String(value.id),
      secondary: formatRelationSubtitle(value),
      endpoint,
    }
  }

  return null
}

function extractEndpointFromValue(value: unknown): string | null {
  if (typeof value === 'string') {
    return normalizeEndpoint(value)
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  const candidateKeys = ['@id', 'href', 'endpoint'] as const
  for (const key of candidateKeys) {
    const entry = (value as Record<string, unknown>)[key]
    if (typeof entry === 'string') {
      const normalized = normalizeEndpoint(entry)
      if (normalized) {
        return normalized
      }
    }
  }

  return null
}

function normalizeEndpoint(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeAbsoluteEndpoint(trimmed)
  }

  const normalizedPath = normalizeRelativeEndpointPath(trimmed)
  if (!normalizedPath) {
    return null
  }

  return buildEcommerceEndpoint(normalizedPath)
}

function normalizeAbsoluteEndpoint(value: string): string | null {
  try {
    const url = new URL(value)

    if (url.host === ECOMMERCE_HOST) {
      return url.href
    }

    if (LOCAL_HOSTNAMES.has(url.hostname)) {
      return buildEcommerceEndpoint(`${url.pathname}${url.search}`)
    }

    return url.href
  } catch {
    return null
  }
}

function normalizeRelativeEndpointPath(value: string): string | null {
  if (!value) {
    return null
  }

  if (value.startsWith('/')) {
    return value
  }

  if (value.startsWith('api/')) {
    return `/${value}`
  }

  if (value.includes('/api/')) {
    const apiIndex = value.indexOf('/api/')
    return value.slice(apiIndex)
  }

  return null
}

function buildEcommerceEndpoint(path: string): string {
  return `${ECOMMERCE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
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

function formatDisplayValue(field: EntityField): string {
  const { value } = field
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (field.displayType === 'boolean' && typeof value === 'boolean') {
    return value ? t('common.enabled') : t('common.disabled')
  }

  if (field.displayType === 'number') {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat(locale.value || undefined, {
        maximumFractionDigits: 4,
      }).format(numeric)
    }
  }

  if (
    (field.displayType === 'date' || field.displayType === 'datetime') &&
    typeof value === 'string'
  ) {
    const formattedDate = formatTemporalDisplayValue(value, field.displayType)
    if (formattedDate) {
      return formattedDate
    }
  }

  return String(value)
}

function formatTemporalDisplayValue(
  value: string,
  type: TemporalFieldType,
): string | null {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  if (type === 'date') {
    return date.toLocaleDateString(locale.value || undefined, {
      dateStyle: 'medium',
    })
  }

  return date.toLocaleString(locale.value || undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

async function inspectRelation(item: EntityRelationItem) {
  if (!item.endpoint) {
    return
  }

  relationDialog.value = true
  relationDialogTitle.value = item.primary
  relationDialogSubtitle.value = item.secondary ?? ''
  relationDialogEndpoint.value = item.endpoint
  relationDialogLoading.value = true
  relationDialogError.value = null
  relationDialogPreview.value = null

  try {
    const data = await requestFetch(item.endpoint, {
      method: 'GET',
    })
    relationDialogPreview.value = data
  } catch (error) {
    console.error(error)
    relationDialogError.value = resolveErrorMessage(error)
  } finally {
    relationDialogLoading.value = false
  }
}
</script>

<template>
  <div class="admin-ecommerce-actions">
    <template v-for="action in actionButtons" :key="action.type">
      <v-tooltip
        v-if="action.endpoint"
        :text="t(action.translationKey)"
        :location="tooltipLocation"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="{ ...buttonProps, ...tooltipProps }"
            :disabled="action.disabled"
            :icon="action.icon"
            :color="action.color"
            @click="openAction(action.type)"
          />
        </template>
      </v-tooltip>
    </template>
  </div>

  <AppModal v-model="dialog" :title="entityTitle || t('admin.ecommerce.entityManager.fields.entity')" :max-width="1040" :scrollable="true" :shadow="true">

    <v-card-text class="pt-6">
      <div class="admin-ecommerce-actions__modal-body">
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

        <div v-if="activeAction === 'delete'" class="admin-ecommerce-actions__delete">
          <v-icon icon="mdi-alert-outline" color="warning" size="36" class="mb-3" />
          <p class="text-body-1 font-weight-medium mb-2">
            {{ t('admin.ecommerce.entityManager.dialogs.deleteConfirm') }}
          </p>
          <p v-if="entityTitle" class="text-subtitle-1">
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
          <section class="admin-ecommerce-actions__summary">
            <header>
              <p class="text-caption text-medium-emphasis mb-1">
                {{ t('admin.ecommerce.entityManager.detailsCard.title') }}
              </p>
              <p class="text-h6 mb-0">{{ entityTitle }}</p>
            </header>
            <div v-if="entityFields.length" class="admin-ecommerce-actions__details-grid">
              <div
                v-for="field in entityFields"
                :key="field.key"
                class="admin-ecommerce-actions__details-item"
              >
                <div class="admin-ecommerce-actions__details-field">
                  <span class="admin-ecommerce-actions__details-label">
                    {{ field.label }}
                  </span>
                  <div class="admin-ecommerce-actions__details-value">
                    <template v-if="field.displayType === 'boolean'">
                      <v-chip
                        size="small"
                        :color="field.value ? 'success' : 'grey-darken-1'"
                        variant="flat"
                        class="text-uppercase"
                      >
                        <v-icon
                          start
                          :icon="field.value ? 'mdi-check-circle' : 'mdi-close-circle'"
                        />
                        {{ formatDisplayValue(field) }}
                      </v-chip>
                    </template>
                    <template v-else-if="field.displayType === 'link' && field.endpoint">
                      <div class="admin-ecommerce-actions__details-link">
                        <v-btn
                          :href="field.endpoint"
                          target="_blank"
                          rel="noopener"
                          size="small"
                          color="primary"
                          variant="tonal"
                          append-icon="mdi-open-in-new"
                        >
                          {{ t('admin.ecommerce.entityManager.table.endpoint') }}
                        </v-btn>
                        <span class="admin-ecommerce-actions__details-endpoint">
                          {{ field.endpoint }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <span
                        class="admin-ecommerce-actions__details-text"
                        :class="{
                          'text-end': field.displayType === 'number',
                        }"
                      >
                        {{ formatDisplayValue(field) }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-body-2">
              {{ t('admin.ecommerce.entityManager.detailsCard.empty') }}
            </p>
          </section>

          <section class="admin-ecommerce-actions__relations">
            <header>
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  {{ t('admin.ecommerce.entityManager.relations.title') }}
                </p>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ hasRelations
                  ? t('admin.ecommerce.entityManager.relations.subtitle')
                  : t('admin.ecommerce.entityManager.relations.empty')
                  }}
                </p>
              </div>
            </header>
            <div v-if="hasRelations" class="admin-ecommerce-actions__relations-content">
              <div
                v-for="group in entityRelations"
                :key="group.title"
                class="admin-ecommerce-actions__relation-group"
              >
                <p class="text-caption text-uppercase text-medium-emphasis">
                  {{ group.title }}
                </p>
                <div class="admin-ecommerce-actions__relation-items">
                  <div
                    v-for="item in group.items"
                    :key="item.id"
                    class="admin-ecommerce-actions__relation-item"
                  >
                    <div>
                      <p class="text-body-2 mb-0">{{ item.primary }}</p>
                      <p
                        v-if="item.secondary"
                        class="text-caption text-medium-emphasis mb-0"
                      >
                        {{ item.secondary }}
                      </p>
                    </div>
                    <v-btn
                      v-if="item.endpoint"
                      size="small"
                      variant="tonal"
                      color="primary"
                      append-icon="mdi-open-in-new"
                      @click="inspectRelation(item)"
                    >
                      {{ t('admin.ecommerce.entityManager.actions.load') }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-actions class="justify-space-between align-center flex-wrap gap-3">
      <div class="admin-ecommerce-actions__modal-actions">
        <v-btn
          v-if="actionEndpoint"
          :href="actionEndpoint"
          target="_blank"
          rel="noopener"
          variant="text"
        >
          {{ t('admin.ecommerce.entityManager.table.endpoint') }}
        </v-btn>
        <div class="admin-ecommerce-actions__actions-gap" />
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
      </div>
    </v-card-actions>
  </AppModal>

  <AppModal
    v-model="relationDialog"
    :max-width="840"
    :scrollable="true"
    :shadow="true"
  >
    <template #header>
      <div class="admin-ecommerce-actions__modal-header">
        <div>
          <p class="text-overline text-medium-emphasis mb-1">
            {{ t('admin.ecommerce.entityManager.actions.load') }}
          </p>
          <h3 class="text-h5 mb-1">{{ relationDialogTitle }}</h3>
          <p v-if="relationDialogSubtitle" class="text-body-2 text-medium-emphasis">
            {{ relationDialogSubtitle }}
          </p>
          <p v-if="relationHelperText" class="text-body-2 text-medium-emphasis">
            {{ relationHelperText }}
          </p>
        </div>
        <div v-if="relationDialogEndpoint" class="admin-ecommerce-actions__endpoint">
          <span class="text-caption text-medium-emphasis">
            {{ t('admin.ecommerce.entityManager.table.endpoint') }}
          </span>
          <span class="text-body-2">{{ relationDialogEndpoint }}</span>
        </div>
      </div>
    </template>

    <div class="admin-ecommerce-actions__modal-body">
      <v-progress-linear
        v-if="relationDialogLoading"
        color="primary"
        indeterminate
        class="mb-4"
      />
      <v-alert
        v-if="relationDialogError"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ relationDialogError }}
      </v-alert>
      <AdminEntityTreePreview
        :title="t('admin.ecommerce.entityManager.preview.title')"
        :empty-text="t('admin.ecommerce.entityManager.preview.empty')"
        :nodes="relationPreviewTree"
      />
    </div>

    <template #actions>
      <div class="admin-ecommerce-actions__modal-actions">
        <v-btn
          v-if="relationDialogEndpoint"
          :href="relationDialogEndpoint"
          target="_blank"
          rel="noopener"
          variant="text"
        >
          {{ t('admin.ecommerce.entityManager.table.endpoint') }}
        </v-btn>
        <div class="admin-ecommerce-actions__actions-gap" />
        <v-btn variant="text" @click="relationDialog = false">
          {{ t('common.actions.close') }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<style scoped>
.admin-ecommerce-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.admin-ecommerce-actions__modal-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 24px 0;
}

@media (min-width: 768px) {
  .admin-ecommerce-actions__modal-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.admin-ecommerce-actions__modal-body {
  padding: 24px;
}

.admin-ecommerce-actions__modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 24px;
}

.admin-ecommerce-actions__actions-gap {
  flex: 1;
}

.admin-ecommerce-actions__endpoint {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.08);
  max-width: 320px;
  word-break: break-all;
}

.admin-ecommerce-actions__details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-ecommerce-actions__summary,
.admin-ecommerce-actions__relations {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 16px;
  padding: 20px;
}

.admin-ecommerce-actions__details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.admin-ecommerce-actions__details-item {
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid rgba(var(--v-border-color), 0.24);
  background: linear-gradient(
      145deg,
      rgba(var(--v-theme-surface), 0.92),
      rgba(var(--v-theme-surface-variant), 0.6)
    ),
    rgba(var(--v-theme-surface), 0.7);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.admin-ecommerce-actions__details-field {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-ecommerce-actions__details-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(var(--v-theme-on-surface), 0.65);
  flex: 1;
  min-width: 120px;
}

.admin-ecommerce-actions__details-value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 0;
  margin-left: auto;
}

.admin-ecommerce-actions__details-text {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.92);
  word-break: break-word;
}

.admin-ecommerce-actions__details-link {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  max-width: 100%;
}

.admin-ecommerce-actions__details-endpoint {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.65);
  max-width: 100%;
  word-break: break-all;
}

.admin-ecommerce-actions__relations-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.admin-ecommerce-actions__relation-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-ecommerce-actions__relation-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-ecommerce-actions__relation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.8);
  border: 1px solid rgba(var(--v-border-color), 0.2);
}

.admin-ecommerce-actions__form {
  min-height: 120px;
}

.admin-ecommerce-actions__delete {
  text-align: center;
  padding: 32px 16px;
  border-radius: 16px;
  background: rgba(var(--v-theme-warning), 0.1);
}

</style>
