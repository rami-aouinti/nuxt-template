<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminEntityTreePreview from '~/components/Admin/AdminEntityTreePreview.vue'
import AppModal from '~/components/App/AppModal.vue'

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

type EntityField = { key: string; value: unknown }
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
const { t } = useI18n()

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
const editPayload = ref('')
const deleteSuccess = ref(false)
const updateSuccess = ref(false)
const relationDialogEndpoint = ref<string | null>(null)
const relationDialogLoading = ref(false)
const relationDialogError = ref<string | null>(null)
const relationDialogPreview = ref<unknown>(null)
const entityTitle = ref('')

const entityFields = ref<EntityField[]>([])
const entityRelations = ref<EntityRelationGroup[]>([])

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
  editPayload.value = ''
  deleteSuccess.value = false
  updateSuccess.value = false
  entityFields.value = []
  entityRelations.value = []
  entityTitle.value = ''
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

function formatPrimitive(value: string | number | boolean | null) {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return value.toString()
  return value
}

function buildEntityFields(value: unknown) {
  if (!value || typeof value !== 'object') {
    return []
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => isPrimitive(v) || typeof v === 'string')
    .map(([key, v]) => ({ key, value: v }))
}

function buildEntityRelations(value: unknown): EntityRelationGroup[] {
  if (!value || typeof value !== 'object') {
    return []
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => Array.isArray(v) || (v && typeof v === 'object'))
    .map(([key, v]) => ({
      key,
      items: Array.isArray(v)
        ? v.map((item) => ({ value: item }))
        : [{ value: v }],
    }))
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
    editPayload.value = JSON.stringify(data, null, 2)
    entityFields.value = buildEntityFields(data)
    entityRelations.value = buildEntityRelations(data)
    entityTitle.value =
      typeof data === 'object' && data && 'name' in (data as any)
        ? String((data as any).name)
        : ''
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

  let parsed: unknown

  try {
    parsed = editPayload.value ? JSON.parse(editPayload.value) : {}
  } catch (error) {
    actionError.value = formatError(error)
    return
  }

  actionLoading.value = true
  actionError.value = null

  try {
    const data = await requestFetch(actionEndpoint.value, {
      method: 'PUT',
      body: parsed,
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
            <div class="admin-crm-actions__details">
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
                        {{ field.key }}
                      </div>
                      <div class="admin-crm-actions__details-value">
                        {{ field.value ?? t('common.labels.none') }}
                      </div>
                    </div>
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
                        {{ relation.key }}
                      </div>
                      <v-btn
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
              <v-textarea
                v-model="editPayload"
                rows="8"
                auto-grow
                :label="t('common.labels.payload')"
                variant="outlined"
              />
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
