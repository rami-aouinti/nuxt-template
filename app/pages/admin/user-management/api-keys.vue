<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { useAdminStore, type ApiVersion } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import type { ApiKey } from '~/types/apiKey'

type ApiKeyFormState = {
  description: string
  token: string
}

definePageMeta({
  title: 'navigation.apiKeys',
  icon: 'mdi-key-outline',
  drawerIndex: 4,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
const adminStore = useAdminStore()

const tab = ref<ApiVersion>('v1')
const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('userManagement.apiKeys.table.description'), key: 'description' },
  { title: t('userManagement.apiKeys.table.token'), key: 'token' },
  { title: t('userManagement.apiKeys.table.id'), key: 'id' },
  {
    title: t('userManagement.apiKeys.table.actions'),
    key: 'actions',
    sortable: false,
    align: 'end',
    width: 150,
  },
])

await Promise.all([
  adminStore.fetchApiKeys('v1'),
  adminStore.fetchApiKeys('v2'),
])

const pendingV1 = adminStore.apiKeysByVersion.v1.pending
const errorV1 = adminStore.apiKeysByVersion.v1.error
const refreshV1 = () => adminStore.refreshApiKeys('v1')

const pendingV2 = adminStore.apiKeysByVersion.v2.pending
const errorV2 = adminStore.apiKeysByVersion.v2.error
const refreshV2 = () => adminStore.refreshApiKeys('v2')

const itemsV1 = computed<ApiKey[]>(
  () => adminStore.apiKeysByVersion.v1.data.value ?? [],
)
const itemsV2 = computed<ApiKey[]>(
  () => adminStore.apiKeysByVersion.v2.data.value ?? [],
)

const actionVersion = ref<ApiVersion>('v1')

const createDialog = ref(false)
const editDialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)

const viewLoading = ref(false)
const viewError = ref('')
const deleteLoading = ref(false)
const deleteError = ref('')
const actionLoading = ref(false)
const formError = ref('')
const editMethod = ref<'PUT' | 'PATCH'>('PUT')

const viewingKey = ref<ApiKey | null>(null)
const editingKey = ref<ApiKey | null>(null)
const deletingKey = ref<ApiKey | null>(null)

const defaultFormState = (): ApiKeyFormState => ({
  description: '',
})

const form = reactive<ApiKeyFormState>(defaultFormState())

const canSubmitCreate = computed(
  () =>
    form.description.trim().length > 0 &&
    !actionLoading.value,
)

const versionLabels = computed<Record<ApiVersion, string>>(() => ({
  v1: t('userManagement.apiKeys.labels.v1'),
  v2: t('userManagement.apiKeys.labels.v2'),
}))

const fetchContext: Record<
  ApiVersion,
  {
    refresh: () => ReturnType<typeof refreshV1>
  }
> = {
  v1: { refresh: refreshV1 },
  v2: { refresh: refreshV2 },
}

function resetForm() {
  Object.assign(form, defaultFormState())
}

function populateForm(key: ApiKey) {
  form.description = key.description ?? ''
}

function ensureFormValid() {
  formError.value = ''
  if (!form.description.trim()) {
    formError.value = t('userManagement.apiKeys.errors.descriptionRequired')
    return false
  }

  return true
}

function buildCreatePayload() {
  return {
    description: form.description.trim(),
  }
}

function buildUpdatePayload(method: 'PUT' | 'PATCH') {
  const payload: Record<string, string> = {}

  const description = form.description.trim()
  const token = form.token.trim()

  if (method === 'PUT') {
    if (!ensureFormValid()) {
      return null
    }
    payload.description = description
    payload.token = token
    return payload
  }

  if (description.length > 0) {
    payload.description = description
  }
  if (token.length > 0) {
    payload.token = token
  }

  if (Object.keys(payload).length === 0) {
    formError.value = t('userManagement.apiKeys.errors.partialUpdateRequired')
    return null
  }

  return payload
}

function setActionVersion(version: ApiVersion) {
  actionVersion.value = version
}

function openCreate(version: ApiVersion) {
  setActionVersion(version)
  resetForm()
  formError.value = ''
  createDialog.value = true
}

function closeCreate() {
  if (actionLoading.value) {
    return
  }

  createDialog.value = false
}

async function submitCreate() {
  const version = actionVersion.value

  if (!ensureFormValid()) {
    if (formError.value) {
      Notify.error(formError.value)
    }
    return
  }

  actionLoading.value = true
  try {
    await $fetch(`/api/${version}/api_key`, {
      method: 'POST',
      body: buildCreatePayload(),
    })
    Notify.success(
      t('userManagement.apiKeys.notifications.createSuccess', {
        version: versionLabels.value[version],
      }),
    )
    createDialog.value = false
    resetForm()
    await fetchContext[version].refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.apiKeys.errors.createFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openEdit(version: ApiVersion, key: ApiKey) {
  setActionVersion(version)
  editingKey.value = key
  populateForm(key)
  editMethod.value = 'PUT'
  formError.value = ''
  editDialog.value = true
}

function closeEdit() {
  if (actionLoading.value) {
    return
  }

  editDialog.value = false
}

async function submitEdit() {
  if (!editingKey.value) {
    return
  }

  const version = actionVersion.value
  const method = editMethod.value

  const payload = buildUpdatePayload(method)
  if (!payload) {
    if (formError.value) {
      Notify.error(formError.value)
    }
    return
  }

  actionLoading.value = true
  try {
    await $fetch(`/api/${version}/api_key/${editingKey.value.id}`, {
      method,
      body: payload,
    })
    Notify.success(
      t('userManagement.apiKeys.notifications.updateSuccess', {
        version: versionLabels.value[version],
      }),
    )
    editDialog.value = false
    await fetchContext[version].refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.apiKeys.errors.updateFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openView(version: ApiVersion, key: ApiKey) {
  setActionVersion(version)
  viewingKey.value = { ...key }
  viewError.value = ''
  viewDialog.value = true
  loadApiKeyDetails(version, key.id)
}

async function loadApiKeyDetails(version: ApiVersion, id: string) {
  viewLoading.value = true
  try {
    viewingKey.value = await $fetch<ApiKey>(`/api/${version}/api_key/${id}`)
  } catch (error) {
    viewError.value = extractRequestError(
      error,
      t('userManagement.apiKeys.errors.loadDetails'),
    )
    Notify.error(viewError.value)
  } finally {
    viewLoading.value = false
  }
}

function closeView() {
  if (viewLoading.value) {
    return
  }

  viewDialog.value = false
}

function openDelete(version: ApiVersion, key: ApiKey) {
  setActionVersion(version)
  deletingKey.value = key
  deleteError.value = ''
  deleteDialog.value = true
}

function closeDelete() {
  if (deleteLoading.value) {
    return
  }

  deleteDialog.value = false
}

async function confirmDelete() {
  if (!deletingKey.value) {
    return
  }

  const version = actionVersion.value

  deleteLoading.value = true
  deleteError.value = ''
  try {
    await $fetch(`/api/${version}/api_key/${deletingKey.value.id}`, {
      method: 'DELETE',
    })
    Notify.success(
      t('userManagement.apiKeys.notifications.deleteSuccess', {
        version: versionLabels.value[version],
      }),
    )
    deleteDialog.value = false
    await fetchContext[version].refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      t('userManagement.apiKeys.errors.deleteFailed'),
    )
    Notify.error(deleteError.value)
  } finally {
    deleteLoading.value = false
  }
}

function extractRequestError(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const withData = error as { data?: unknown; message?: unknown }

    if (withData.data && typeof withData.data === 'object') {
      const data = withData.data as Record<string, unknown>

      if (
        'message' in data &&
        typeof data.message === 'string' &&
        data.message.trim().length > 0
      ) {
        return data.message
      }

      if (
        'error' in data &&
        typeof data.error === 'string' &&
        data.error.trim().length > 0
      ) {
        return data.error
      }
    }

    if (
      typeof withData.message === 'string' &&
      withData.message.trim().length > 0
    ) {
      return withData.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

watch(createDialog, (value) => {
  if (!value) {
    actionLoading.value = false
    formError.value = ''
    resetForm()
  }
})

watch(editDialog, (value) => {
  if (!value) {
    actionLoading.value = false
    formError.value = ''
    editingKey.value = null
    editMethod.value = 'PUT'
    resetForm()
  }
})

watch(viewDialog, (value) => {
  if (!value) {
    viewLoading.value = false
    viewError.value = ''
    viewingKey.value = null
  }
})

watch(deleteDialog, (value) => {
  if (!value) {
    deleteLoading.value = false
    deleteError.value = ''
    deletingKey.value = null
  }
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <client-only>
            <teleport to="#app-bar">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                :label="t('common.labels.search')"
                single-line
                hide-details
                density="compact"
                class="mr-2"
                rounded="xl"
                flat
                icon-color
                glow
                variant="solo"
                style="width: 250px"
              />
            </teleport>
          </client-only>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6">{{ t('userManagement.apiKeys.cardTitle') }}</span>
            <v-btn-toggle
              v-model="tab"
              variant="text"
              divided
              density="compact"
              color="primary"
            >
              <v-btn value="v1">{{ versionLabels.v1 }}</v-btn>
              <v-btn value="v2">{{ versionLabels.v2 }}</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="v1">
                <v-alert v-if="errorV1" type="error" variant="tonal" class="mb-4">
                  {{ t('userManagement.apiKeys.alerts.loadFailed', {
                    version: versionLabels.v1,
                  }) }}
                </v-alert>
                <div
                  class="d-flex justify-end align-center mb-2 flex-wrap"
                  style="gap: 8px"
                >
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    :disabled="pendingV1"
                    @click="openCreate('v1')"
                  >
                    {{
                      t('userManagement.apiKeys.actions.new', {
                        version: versionLabels.v1,
                      })
                    }}
                  </v-btn>
                  <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    :loading="pendingV1"
                    @click="refreshV1()"
                  />
                </div>
                <v-data-table
                  :headers="headers"
                  :items="itemsV1"
                  :loading="pendingV1"
                  :search="search"
                  item-value="id"
                  class="elevation-0"
                >
                  <template #item.actions="{ item }">
                    <div class="d-flex align-center justify-end" style="gap: 4px">
                      <v-btn
                        icon
                        variant="text"
                        color="primary"
                        :title="
                          t('userManagement.apiKeys.actions.viewTooltip', {
                            description:
                              item.raw?.description ??
                              t('userManagement.apiKeys.labels.keyFallback'),
                          })
                        "
                        @click="openView('v1', item.raw)"
                      >
                        <v-icon icon="mdi-eye-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="warning"
                        :title="
                          t('userManagement.apiKeys.actions.editTooltip', {
                            description:
                              item.raw?.description ??
                              t('userManagement.apiKeys.labels.keyFallback'),
                          })
                        "
                        @click="openEdit('v1', item.raw)"
                      >
                        <v-icon icon="mdi-pencil-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="error"
                        :title="
                          t('userManagement.apiKeys.actions.deleteTooltip', {
                            description:
                              item.raw?.description ??
                              t('userManagement.apiKeys.labels.keyFallback'),
                          })
                        "
                        @click="openDelete('v1', item.raw)"
                      >
                        <v-icon icon="mdi-delete-outline" />
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>
              <v-window-item value="v2">
                <v-alert v-if="errorV2" type="error" variant="tonal" class="mb-4">
                  {{ t('userManagement.apiKeys.alerts.loadFailed', {
                    version: versionLabels.v2,
                  }) }}
                </v-alert>
                <div
                  class="d-flex justify-end align-center mb-2 flex-wrap"
                  style="gap: 8px"
                >
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    :disabled="pendingV2"
                    @click="openCreate('v2')"
                  >
                    {{
                      t('userManagement.apiKeys.actions.new', {
                        version: versionLabels.v2,
                      })
                    }}
                  </v-btn>
                  <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    :loading="pendingV2"
                    @click="refreshV2()"
                  />
                </div>
                <v-data-table
                  :headers="headers"
                  :items="itemsV2"
                  :loading="pendingV2"
                  :search="search"
                  item-value="id"
                  class="elevation-0"
                >
                  <template #item.actions="{ item }">
                    <div class="d-flex align-center justify-end" style="gap: 4px">
                      <v-btn
                        icon
                        variant="text"
                        color="primary"
                        :title="
                          t('userManagement.apiKeys.actions.viewTooltip', {
                            description:
                              item.raw?.description ??
                              t('userManagement.apiKeys.labels.keyFallback'),
                          })
                        "
                        @click="openView('v2', item.raw)"
                      >
                        <v-icon icon="mdi-eye-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="warning"
                        :title="
                          t('userManagement.apiKeys.actions.editTooltip', {
                            description:
                              item.raw?.description ??
                              t('userManagement.apiKeys.labels.keyFallback'),
                          })
                        "
                        @click="openEdit('v2', item.raw)"
                      >
                        <v-icon icon="mdi-pencil-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="error"
                        :title="
                          t('userManagement.apiKeys.actions.deleteTooltip', {
                            description:
                              item.raw?.description ??
                              t('userManagement.apiKeys.labels.keyFallback'),
                          })
                        "
                        @click="openDelete('v2', item.raw)"
                      >
                        <v-icon icon="mdi-delete-outline" />
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="createDialog" max-width="520">
      <v-card>
        <v-card-title>
          {{
            t('userManagement.apiKeys.dialogs.create.title', {
              version: versionLabels[actionVersion],
            })
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ formError }}
          </v-alert>
          <v-form @submit.prevent="submitCreate">
            <v-text-field
              v-model="form.description"
              :label="t('userManagement.apiKeys.fields.description')"
              :disabled="actionLoading"
              autocomplete="off"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="actionLoading" @click="closeCreate">
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="actionLoading"
            :disabled="!canSubmitCreate"
            @click="submitCreate"
          >
            {{ t('common.actions.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title>
          {{
            t('userManagement.apiKeys.dialogs.edit.title', {
              version: versionLabels[actionVersion],
            })
          }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ formError }}
          </v-alert>
          <v-alert type="info" variant="tonal" class="mb-4">
            Sélectionnez la méthode de mise à jour à utiliser.
          </v-alert>
          <v-btn-toggle
            v-model="editMethod"
            mandatory
            variant="outlined"
            divided
            color="primary"
            class="mb-4"
          >
            <v-btn value="PUT">Remplacer (PUT)</v-btn>
            <v-btn value="PATCH">Modifier (PATCH)</v-btn>
          </v-btn-toggle>
          <v-form @submit.prevent="submitEdit">
            <v-text-field
              v-model="form.description"
              :label="t('userManagement.apiKeys.fields.description')"
              :disabled="actionLoading"
              autocomplete="off"
              required
            />
            <v-text-field
              v-model="form.token"
              :label="t('userManagement.apiKeys.fields.token')"
              :disabled="actionLoading"
              autocomplete="off"
              :required="editMethod === 'PUT'"
              :hint="t('userManagement.apiKeys.hints.keepToken')"
              persistent-hint
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="actionLoading" @click="closeEdit">
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="actionLoading"
            :disabled="actionLoading"
            @click="submitEdit"
          >
            {{ t('common.actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{
            t('userManagement.apiKeys.dialogs.view.title', {
              version: versionLabels[actionVersion],
            })
          }}
        </v-card-title>
        <v-card-text>
          <v-progress-linear
            v-if="viewLoading"
            color="primary"
            indeterminate
            class="mb-4"
          />
          <v-alert
            v-if="viewError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ viewError }}
          </v-alert>
          <template v-if="viewingKey && !viewLoading">
            <div class="d-flex flex-column" style="row-gap: 12px">
              <div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('userManagement.apiKeys.fields.id') }}
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingKey.id }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('userManagement.apiKeys.fields.description') }}
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingKey.description }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('userManagement.apiKeys.fields.token') }}
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingKey.token }}
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!viewLoading" class="text-body-2 text-medium-emphasis">
            {{ t('userManagement.apiKeys.dialogs.view.empty') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="viewLoading" @click="closeView">
            {{ t('common.actions.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title>{{ t('userManagement.apiKeys.dialogs.delete.title') }}</v-card-title>
        <v-card-text>
          <v-alert
            v-if="deleteError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ deleteError }}
          </v-alert>
          <p class="text-body-2">
            {{ t('userManagement.apiKeys.dialogs.delete.warningPrefix') }}
            <strong>
              {{
                deletingKey?.description ??
                  t('userManagement.apiKeys.labels.keyFallback')
              }}
            </strong>
            {{ t('userManagement.apiKeys.dialogs.delete.warningSuffix') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="deleteLoading" @click="closeDelete">
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteLoading"
            :disabled="deleteLoading"
            @click="confirmDelete"
          >
            {{ t('common.actions.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
