<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminEntityTreePreview from '~/components/Admin/AdminEntityTreePreview.vue'
import AppModal from '~/components/App/AppModal.vue'
import { useCrmApi } from '~/composables/useCrmApi'
import {
  createDateFormatter,
  formatDateValue,
  formatRelativePublishedAt,
} from '~/utils/formatters'

type ActionType = 'show' | 'edit' | 'delete'

type ActionMetadata = {
  icon: string
  color: string
  label: string
}

type ActionButton = ActionMetadata & {
  type: ActionType
  endpoint: string | null
  disabled: boolean
}

type EntityField = {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean'
  value: unknown
  displayType: 'text' | 'number' | 'boolean' | 'date' | 'datetime'
  endpoint?: string | null
}
type EntityRelation = { value: unknown }
type EntityRelationGroup = { key: string; items: EntityRelation[] }

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

const requestFetch = useRequestFetch()
const { t, locale } = useI18n()
const { jsonLdHeaders } = useCrmApi()

const HIDDEN_FIELD_KEYS = new Set([
  '@context',
  '@id',
  '@type',
  'id',
  'createdAt',
  'updatedAt',
])

const dateFormatter = createDateFormatter(locale, { dateStyle: 'medium' })
const dateTimeFormatter = createDateFormatter(locale)

const normalizedLinks = computed(() => ({
  show: normalizeUrl(props.showUrl),
  edit: normalizeUrl(props.editUrl),
  delete: normalizeUrl(props.deleteUrl),
}))

const ACTION_METADATA: Record<ActionType, ActionMetadata> = {
  show: {
    icon: 'mdi-eye-outline',
    color: 'primary',
    label: t('common.actions.view'),
  },
  edit: {
    icon: 'mdi-pencil-outline',
    color: 'warning',
    label: t('common.actions.edit'),
  },
  delete: {
    icon: 'mdi-delete-outline',
    color: 'error',
    label: t('common.actions.delete'),
  },
}

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

const dialog = ref(false)
const relationDialog = ref(false)
const activeAction = ref<ActionType | null>(null)
const actionLoading = ref(false)
const actionError = ref<string | null>(null)
const responsePreview = ref<unknown>(null)
const editForm = ref<Record<string, unknown>>({})
const deleteSuccess = ref(false)
const updateSuccess = ref(false)
const relationDialogEndpoint = ref<string | null>(null)
const relationDialogLoading = ref(false)
const relationDialogError = ref<string | null>(null)
const relationDialogPreview = ref<unknown>(null)
const entityTitle = ref('')

const entityFields = ref<EntityField[]>([])
const entityRelations = ref<EntityRelationGroup[]>([])
const fieldTypes = ref<Record<string, 'string' | 'number' | 'boolean'>>({})
const relationSelections = ref<Record<string, string | string[]>>({})

const relationHelperText = computed(() =>
  relationDialogEndpoint.value
    ? `${t('common.labels.endpoint')}: ${relationDialogEndpoint.value}`
    : null,
)

const actionEndpoint = computed(() =>
  activeAction.value ? normalizedLinks.value[activeAction.value] : null,
)

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

function normalizeUrl(url?: string | null) {
  if (typeof url !== 'string') {
    return null
  }
  const trimmed = url.trim()
  return trimmed.length > 0 ? trimmed : null
}

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
  fieldTypes.value = {}
  relationSelections.value = {}
  editForm.value = {}
}

function resetRelationDialog() {
  relationDialogEndpoint.value = null
  relationDialogLoading.value = false
  relationDialogError.value = null
  relationDialogPreview.value = null
}

function isPrimitive(value: unknown) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}

function buildEntityFields(value: unknown) {
  if (!value || typeof value !== 'object') {
    return []
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([key, v]) =>
      Boolean(
        !HIDDEN_FIELD_KEYS.has(key) &&
          !key.startsWith('@') &&
          (isPrimitive(v) || typeof v === 'string'),
      ),
    )
    .map(([key, v]) => {
      const type = resolveFieldType(v)
      return {
        key,
        label: formatFieldLabel(key),
        type,
        value: v,
        displayType: resolveFieldDisplayType(v),
        endpoint: typeof v === 'string' ? normalizeEndpoint(v) : null,
      }
    })
}

function buildEntityRelations(value: unknown): EntityRelationGroup[] {
  if (!value || typeof value !== 'object') {
    return []
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([key, v]) =>
      Boolean(
        !HIDDEN_FIELD_KEYS.has(key) &&
          !key.startsWith('@') &&
          (Array.isArray(v) || (v && typeof v === 'object')),
      ),
    )
    .map(([key, v]) => ({
      key,
      items: Array.isArray(v)
        ? v.map((item) => ({ value: item }))
        : [{ value: v }],
    }))
}

function resolveFieldType(value: unknown): 'string' | 'number' | 'boolean' {
  if (typeof value === 'number') {
    return 'number'
  }
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  return 'string'
}

function resolveFieldDisplayType(
  value: unknown,
): EntityField['displayType'] {
  if (typeof value === 'boolean') {
    return 'boolean'
  }
  if (typeof value === 'number' || isNumericString(String(value))) {
    return 'number'
  }
  if (typeof value === 'string') {
    const temporalType = detectTemporalType(value)
    if (temporalType) {
      return temporalType
    }
  }
  return 'text'
}

function detectTemporalType(value: string): Extract<EntityField['displayType'], 'date' | 'datetime'> | null {
  const trimmed = value.trim()
  if (trimmed.length < 8 || !/[tT:/-]/.test(trimmed)) {
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

function isNumericString(value: string): boolean {
  if (!value.trim()) {
    return false
  }
  return !Number.isNaN(Number(value))
}

async function openAction(action: ActionType) {
  if (!normalizedLinks.value[action]) {
    return
  }
  activeAction.value = action
  dialog.value = true
  await loadAction()
}

async function loadAction() {
  if (!actionEndpoint.value || activeAction.value === 'delete') {
    return
  }

  actionLoading.value = true
  actionError.value = null

  try {
    const data = await requestFetch(actionEndpoint.value, {
      method: 'GET',
    })
    responsePreview.value = data
    entityFields.value = buildEntityFields(data)
    entityRelations.value = buildEntityRelations(data)
    entityTitle.value =
      typeof data === 'object' && data && 'name' in (data as any)
        ? String((data as any).name)
        : ''
    hydrateEditForm()
  } catch (error) {
    actionError.value = formatError(error)
  } finally {
    actionLoading.value = false
  }
}

async function handleDelete() {
  if (!actionEndpoint.value) return
  actionLoading.value = true
  actionError.value = null

  try {
    await requestFetch(actionEndpoint.value, {
      method: 'DELETE',
    })
    deleteSuccess.value = true
  } catch (error) {
    actionError.value = formatError(error)
  } finally {
    actionLoading.value = false
  }
}

async function handleUpdate() {
  if (!actionEndpoint.value) return

  actionLoading.value = true
  actionError.value = null

  try {
    const payload = buildUpdatePayload()
    const data = await requestFetch(actionEndpoint.value, {
      method: 'PUT',
      headers: jsonLdHeaders.value,
      body: payload,
    })
    responsePreview.value = data
    updateSuccess.value = true
  } catch (error) {
    actionError.value = formatError(error)
  } finally {
    actionLoading.value = false
  }
}

async function loadRelation(endpoint: string | null) {
  if (!endpoint) return

  relationDialogEndpoint.value = endpoint
  relationDialog.value = true
  relationDialogLoading.value = true
  relationDialogError.value = null

  try {
    relationDialogPreview.value = await requestFetch(endpoint, {
      method: 'GET',
    })
  } catch (error) {
    relationDialogError.value = formatError(error)
  } finally {
    relationDialogLoading.value = false
  }
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return t('common.unexpectedError')
}

function hydrateEditForm() {
  const normalizedFields: Record<string, unknown> = {}
  const normalizedTypes: Record<string, 'string' | 'number' | 'boolean'> = {}

  entityFields.value.forEach(({ key, value, type }) => {
    normalizedTypes[key] = type

    if (type === 'number') {
      normalizedFields[key] =
        typeof value === 'number' ? value : Number(value ?? '') || null
      return
    }

    if (type === 'boolean') {
      normalizedFields[key] = Boolean(value)
      return
    }

    normalizedFields[key] = typeof value === 'string' ? value : value ?? ''
  })

  fieldTypes.value = normalizedTypes
  editForm.value = normalizedFields

  const relationPayload: Record<string, string | string[]> = {}

  entityRelations.value.forEach((group) => {
    const values = group.items.map((item) => normalizeRelationValue(item.value))
    const filtered = values.filter((value): value is string => Boolean(value))

    relationPayload[group.key] = group.items.length > 1
      ? filtered
      : filtered[0] ?? ''
  })

  relationSelections.value = relationPayload
}

function normalizeRelationValue(value: unknown) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && '@id' in (value as any)) {
    const id = (value as { ['@id']?: string })['@id']
    if (typeof id === 'string') {
      return id
    }
  }

  if (value && typeof value === 'object' && 'id' in (value as any)) {
    const maybeId = (value as { id?: string | number }).id
    if (typeof maybeId === 'number' || typeof maybeId === 'string') {
      return String(maybeId)
    }
  }

  return null
}

const relationSelectOptions = computed(() => {
  return entityRelations.value.map((group) => ({
    key: group.key,
    multiple: group.items.length > 1,
    options: group.items.map((item) => {
      const value = normalizeRelationValue(item.value)
      return {
        title: resolveRelationLabel(item.value),
        value: value || resolveRelationLabel(item.value),
      }
    }),
  }))
})

function resolveRelationLabel(value: unknown) {
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>
    if (typeof objectValue.name === 'string') return objectValue.name
    if (typeof objectValue.title === 'string') return objectValue.title
    if (typeof objectValue.value === 'string') return objectValue.value
    if (typeof objectValue.id === 'string' || typeof objectValue.id === 'number') {
      return `#${objectValue.id}`
    }
  }
  if (typeof value === 'string') return value
  return t('common.labels.entity')
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function buildUpdatePayload() {
  const payload: Record<string, unknown> = {}

  Object.entries(editForm.value).forEach(([key, value]) => {
    const type = fieldTypes.value[key]

    if (type === 'number') {
      const parsed = typeof value === 'number' ? value : Number(value)
      if (!Number.isNaN(parsed)) {
        payload[key] = parsed
      }
      return
    }

    if (type === 'boolean') {
      payload[key] = Boolean(value)
      return
    }

    if (typeof value === 'string') {
      const normalized = value.trim()
      if (normalized.length > 0) {
        payload[key] = normalized
      }
    }
  })

  Object.entries(relationSelections.value).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const filtered = value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter((entry) => entry.length > 0)
      payload[key] = filtered
      return
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      payload[key] = value.trim()
    }
  })

  return payload
}

function normalizeEndpoint(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  try {
    const url = new URL(trimmed)
    return url.href
  } catch {
    return trimmed.startsWith('/') ? trimmed : null
  }
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

  if (field.displayType === 'date' || field.displayType === 'datetime') {
    const dateString = typeof value === 'string' ? value : String(value)
    const formatted = formatDateValue(
      dateString,
      field.displayType === 'date'
        ? dateFormatter.value
        : dateTimeFormatter.value,
      '',
    )
    const relative = formatRelativePublishedAt(dateString, locale.value)
    return relative || formatted || dateString
  }

  return String(value)
}
</script>

<template>
  <div class="admin-crm-actions">
    <v-tooltip
      v-for="action in actionButtons"
      :key="action.type"
      :text="action.label"
      location="bottom"
    >
      <template #activator="{ props: tooltipProps }">
        <span>
          <v-btn
            v-bind="tooltipProps"
            :icon="action.icon"
            :color="action.color"
            variant="text"
            size="small"
            :disabled="action.disabled"
            @click="openAction(action.type)"
          />
        </span>
      </template>
    </v-tooltip>

    <AppModal
      v-model="dialog"
      :title="entityTitle || t('common.labels.entity')"
    >
      <template #default>
        <div class="admin-crm-actions__body">
          <div v-if="actionError" class="admin-crm-actions__error">
            {{ actionError }}
          </div>

          <div v-if="deleteSuccess" class="admin-crm-actions__success">
            {{ t('common.actions.delete') }} OK
          </div>
          <div v-if="updateSuccess" class="admin-crm-actions__success">
            {{ t('common.actions.edit') }} OK
          </div>

          <div v-if="actionLoading" class="text-center my-4">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <template v-else>
            <div v-if="activeAction !== 'edit'" class="admin-crm-actions__details">
              <section class="admin-crm-actions__summary">
                <h3 class="admin-crm-actions__section-title">
                  {{ t('common.labels.details') }}
                </h3>
                <div class="admin-crm-actions__details-grid">
                  <div
                    v-for="field in entityFields"
                    :key="field.key"
                    class="admin-crm-actions__details-item"
                  >
                    <div class="admin-crm-actions__details-field">
                      <div class="admin-crm-actions__details-label">
                        {{ field.label }}
                      </div>
                      <div class="admin-crm-actions__details-value">
                        <template v-if="field.displayType === 'boolean'">
                          <v-chip
                            size="small"
                            :color="field.value ? 'success' : 'grey-darken-1'"
                            variant="flat"
                            class="text-uppercase"
                          >
                            <v-icon
                              start
                              :icon="
                                field.value
                                  ? 'mdi-check-circle'
                                  : 'mdi-close-circle'
                              "
                            />
                            {{ formatDisplayValue(field) }}
                          </v-chip>
                        </template>
                        <template v-else-if="field.endpoint">
                          <div class="admin-crm-actions__details-link">
                            <v-btn
                              :href="field.endpoint"
                              target="_blank"
                              rel="noopener"
                              size="x-small"
                              color="primary"
                              variant="tonal"
                              append-icon="mdi-open-in-new"
                            >
                              {{ t('common.labels.endpoint') }}
                            </v-btn>
                            <span class="admin-crm-actions__details-endpoint">
                              {{ field.endpoint }}
                            </span>
                          </div>
                        </template>
                        <template v-else>
                          {{ formatDisplayValue(field) }}
                        </template>
                      </div>
                    </div>
                  </div>
                  <div v-if="entityFields.length === 0" class="text-medium-emphasis">
                    {{ t('common.labels.none') }}
                  </div>
                </div>
              </section>

              <section class="admin-crm-actions__relations">
                <div class="admin-crm-actions__relations-header">
                  <h3 class="admin-crm-actions__section-title">
                    {{ t('common.labels.relations') }}
                  </h3>
                  <p v-if="actionEndpoint" class="admin-crm-actions__helper">
                    {{ t('common.labels.endpoint') }}: {{ actionEndpoint }}
                  </p>
                </div>
                <div class="admin-crm-actions__relations-content">
                  <div
                    v-for="relation in entityRelations"
                    :key="relation.key"
                    class="admin-crm-actions__relation-group"
                  >
                    <div class="admin-crm-actions__relation-header">
                      <div class="admin-crm-actions__relation-key">
                        {{ formatFieldLabel(relation.key) }}
                      </div>
                      <v-btn
                        v-if="relation.items[0]?.value?.['@id']"
                        variant="tonal"
                        size="x-small"
                        color="primary"
                        prepend-icon="mdi-arrow-top-right"
                        @click="
                          loadRelation(
                            relation.items[0]?.value?.['@id'] || null,
                          )
                        "
                      >
                        {{ t('common.actions.view') }}
                      </v-btn>
                    </div>
                    <div class="admin-crm-actions__relation-items">
                      <div
                        v-for="(item, index) in relation.items"
                        :key="`${relation.key}-${index}`"
                        class="admin-crm-actions__relation-item"
                      >
                        <AdminEntityTreePreview
                          :value="item.value"
                          :title="t('common.labels.entity')"
                          :empty-text="t('common.labels.none')"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="entityRelations.length === 0"
                    class="text-medium-emphasis"
                  >
                    {{ t('common.labels.none') }}
                  </div>
                </div>
              </section>
            </div>

            <section
              v-if="activeAction === 'edit'"
              class="admin-crm-actions__form"
            >
              <h3 class="admin-crm-actions__section-title">
                {{ t('common.actions.edit') }}
              </h3>
              <v-row class="mb-2" dense>
                <v-col
                  v-for="field in entityFields"
                  :key="field.key"
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-if="fieldTypes[field.key] === 'boolean'"
                    v-model="editForm[field.key]"
                    color="primary"
                    inset
                    :label="field.label"
                  />
                  <v-text-field
                    v-else
                    v-model="editForm[field.key]"
                    :label="field.label"
                    :type="fieldTypes[field.key] === 'number' ? 'number' : 'text'"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <div v-if="relationSelectOptions.length" class="mt-2">
                <h4 class="admin-crm-actions__section-title">
                  {{ t('common.labels.relations') }}
                </h4>
                <v-row dense>
                  <v-col
                    v-for="relation in relationSelectOptions"
                    :key="relation.key"
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="relationSelections[relation.key]"
                      :items="relation.options"
                      :multiple="relation.multiple"
                      :label="formatFieldLabel(relation.key)"
                      chips
                      clearable
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>
            </section>

            <section
              v-if="activeAction === 'delete'"
              class="admin-crm-actions__delete"
            >
              <h3 class="admin-crm-actions__section-title">
                {{ t('common.actions.delete') }}?
              </h3>
              <p class="text-medium-emphasis">
                {{ t('common.labels.endpoint') }}: {{ actionEndpoint }}
              </p>
            </section>

            <section
              v-if="responsePreview && activeAction === 'show'"
              class="mt-4"
            >
              <AdminEntityTreePreview
                :value="responsePreview"
                :title="t('common.labels.preview')"
                :empty-text="t('common.labels.none')"
              />
            </section>
          </template>
        </div>
      </template>

      <template #actions>
        <div class="admin-crm-actions__modal-actions">
          <v-btn
            variant="tonal"
            color="primary"
            :disabled="!actionEndpoint"
            prepend-icon="mdi-reload"
            @click="loadAction"
          >
            {{ t('common.actions.refresh') }}
          </v-btn>
          <div class="admin-crm-actions__actions-gap" />
          <v-btn
            v-if="activeAction === 'edit'"
            color="primary"
            :loading="actionLoading"
            prepend-icon="mdi-content-save"
            @click="handleUpdate"
          >
            {{ t('common.actions.save') || 'Save' }}
          </v-btn>
          <v-btn
            v-else-if="activeAction === 'delete'"
            color="error"
            :loading="actionLoading"
            prepend-icon="mdi-delete"
            @click="handleDelete"
          >
            {{ t('common.actions.delete') }}
          </v-btn>
          <v-btn color="primary" variant="tonal" @click="dialog = false">
            {{ t('common.actions.close') }}
          </v-btn>
        </div>
      </template>
    </AppModal>

    <AppModal v-model="relationDialog" :title="t('common.labels.relations')">
      <template #default>
        <div class="admin-crm-actions__body">
          <div v-if="relationDialogError" class="admin-crm-actions__error">
            {{ relationDialogError }}
          </div>
          <div v-if="relationDialogLoading" class="text-center my-4">
            <v-progress-circular indeterminate color="primary" />
          </div>
          <template v-else>
            <p v-if="relationHelperText" class="admin-crm-actions__helper">
              {{ relationHelperText }}
            </p>
            <AdminEntityTreePreview
              :value="relationDialogPreview"
              :title="t('common.labels.preview')"
              :empty-text="t('common.labels.none')"
            />
          </template>
        </div>
      </template>
      <template #actions>
        <div class="admin-crm-actions__modal-actions">
          <v-btn
            variant="tonal"
            color="primary"
            @click="relationDialog = false"
          >
            {{ t('common.actions.close') }}
          </v-btn>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.admin-crm-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.admin-crm-actions__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-crm-actions__details {
  display: grid;
  gap: 16px;
}

.admin-crm-actions__details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.admin-crm-actions__details-item {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
}

.admin-crm-actions__details-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-crm-actions__details-value {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.7);
  word-break: break-word;
}

.admin-crm-actions__relations {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 12px;
}

.admin-crm-actions__relations-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-crm-actions__relation-group {
  border: 1px dashed rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 10px;
}

.admin-crm-actions__relation-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-top: 8px;
}

.admin-crm-actions__relation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.admin-crm-actions__relation-key {
  font-weight: 600;
}

.admin-crm-actions__form,
.admin-crm-actions__delete {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
}

.admin-crm-actions__error {
  color: #c62828;
}

.admin-crm-actions__success {
  color: #2e7d32;
}

.admin-crm-actions__section-title {
  margin: 0 0 6px;
  font-weight: 700;
}

.admin-crm-actions__helper {
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
}

.admin-crm-actions__modal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-crm-actions__actions-gap {
  flex: 1 1 auto;
}
</style>
