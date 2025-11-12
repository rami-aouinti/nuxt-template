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
  drawerIndex: 5,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
const adminStore = useAdminStore()
const apiKeysByVersion = computed(() => adminStore.apiKeysByVersion)

function getVersionEntry(version: ApiVersion) {
  return apiKeysByVersion.value?.[version]
}

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

const pendingV1 = computed(() => getVersionEntry('v1')?.pending?.value ?? false)
const errorV1 = computed(() => getVersionEntry('v1')?.error?.value ?? null)
const refreshV1 = () => adminStore.refreshApiKeys('v1')

const pendingV2 = computed(() => getVersionEntry('v2')?.pending?.value ?? false)
const errorV2 = computed(() => getVersionEntry('v2')?.error?.value ?? null)
const refreshV2 = () => adminStore.refreshApiKeys('v2')

const itemsV1 = computed<ApiKey[]>(
  () => getVersionEntry('v1')?.data?.value ?? [],
)
const itemsV2 = computed<ApiKey[]>(
  () => getVersionEntry('v2')?.data?.value ?? [],
)

const currentVersion = computed(() => tab.value)
const currentItems = computed<ApiKey[]>(() =>
  currentVersion.value === 'v1' ? itemsV1.value : itemsV2.value,
)
const currentPending = computed(() =>
  currentVersion.value === 'v1' ? pendingV1.value : pendingV2.value,
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
  token: '',
})

const form = reactive<ApiKeyFormState>(defaultFormState())

const canSubmitCreate = computed(
  () => form.description.trim().length > 0 && !actionLoading.value,
)

const versionLabels = computed<Record<ApiVersion, string>>(() => ({
  v1: t('userManagement.apiKeys.labels.v1'),
  v2: t('userManagement.apiKeys.labels.v2'),
}))

const tableError = computed(() => {
  const version = currentVersion.value
  const error = version === 'v1' ? errorV1.value : errorV2.value
  if (!error) {
    return null
  }
  return t('userManagement.apiKeys.alerts.loadFailed', {
    version: versionLabels.value[version],
  })
})

const currentVersionLabel = computed(
  () => versionLabels.value[currentVersion.value],
)

const fetchContext: Record<
  ApiVersion,
  {
    refresh: () => ReturnType<typeof refreshV1>
  }
> = {
  v1: { refresh: refreshV1 },
  v2: { refresh: refreshV2 },
}

function refreshCurrent() {
  fetchContext[currentVersion.value].refresh()
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
        <AdminDataTable
          v-model:search="search"
          :headers="headers"
          :items="currentItems"
          :loading="currentPending"
          :error="tableError"
          :title="t('userManagement.apiKeys.cardTitle')"
          :subtitle="t('navigation.userManagement')"
          item-value="id"
          @refresh="refreshCurrent"
        >
          <template #header-actions>
            <div class="d-flex align-center flex-wrap" style="gap: 8px">
              <v-btn-toggle
                v-model="tab"
                variant="text"
                divided
                density="compact"
                color="primary"
              >
                <AppButton value="v1">{{ versionLabels.v1 }}</AppButton>
                <AppButton value="v2">{{ versionLabels.v2 }}</AppButton>
              </v-btn-toggle>
              <AppButton
                color="primary"
                prepend-icon="mdi-plus"
                :disabled="currentPending"
                @click="openCreate(tab)"
              >
                {{
                  t('userManagement.apiKeys.actions.new', {
                    version: currentVersionLabel,
                  })
                }}
              </AppButton>
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex align-center justify-end" style="gap: 4px">
              <AppButton
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
                @click="openView(tab, item.raw)"
              >
                <v-icon icon="mdi-eye-outline" />
              </AppButton>
              <AppButton
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
                @click="openEdit(tab, item.raw)"
              >
                <v-icon icon="mdi-pencil-outline" />
              </AppButton>
              <AppButton
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
                @click="openDelete(tab, item.raw)"
              >
                <v-icon icon="mdi-delete-outline" />
              </AppButton>
            </div>
          </template>
        </AdminDataTable>
      </v-col>
    </v-row>
    <AppModal
      v-model="createDialog"
      :max-width="520"
      :close-disabled="actionLoading"
      icon="mdi-key-plus"
      :title="
        t('userManagement.apiKeys.dialogs.create.title', {
          version: versionLabels[actionVersion],
        })
      "
      @close="closeCreate"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
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

      <template #actions>
        <AppButton variant="text" :disabled="actionLoading" @click="closeCreate">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :loading="actionLoading"
          :disabled="!canSubmitCreate"
          @click="submitCreate"
        >
          {{ t('common.actions.create') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="editDialog"
      :max-width="520"
      :close-disabled="actionLoading"
      icon="mdi-key-change"
      :title="
        t('userManagement.apiKeys.dialogs.edit.title', {
          version: versionLabels[actionVersion],
        })
      "
      @close="closeEdit"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
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
        <AppButton value="PUT">Remplacer (PUT)</AppButton>
        <AppButton value="PATCH">Modifier (PATCH)</AppButton>
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

      <template #actions>
        <AppButton variant="text" :disabled="actionLoading" @click="closeEdit">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :loading="actionLoading"
          :disabled="actionLoading"
          @click="submitEdit"
        >
          {{ t('common.actions.save') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="viewDialog"
      :max-width="500"
      :close-disabled="viewLoading"
      icon="mdi-eye-lock-open"
      :title="
        t('userManagement.apiKeys.dialogs.view.title', {
          version: versionLabels[actionVersion],
        })
      "
      @close="closeView"
    >
      <v-progress-linear
        v-if="viewLoading"
        color="primary"
        indeterminate
        class="mb-4"
      />
      <v-alert v-if="viewError" type="error" variant="tonal" class="mb-4">
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

      <template #actions>
        <AppButton variant="text" :disabled="viewLoading" @click="closeView">
          {{ t('common.actions.close') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal v-model="deleteDialog" max-width="480">
      <AppCard>
        <v-card-title>{{
          t('userManagement.apiKeys.dialogs.delete.title')
        }}</v-card-title>
        <v-card-text>
          <v-alert v-if="deleteError" type="error" variant="tonal" class="mb-4">
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
          <AppButton variant="text" :disabled="deleteLoading" @click="closeDelete">
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="error"
            :loading="deleteLoading"
            :disabled="deleteLoading"
            @click="confirmDelete"
          >
            {{ t('common.actions.delete') }}
          </AppButton>
        </v-card-actions>
      </AppCard>
    </AppModal>
  </v-container>
</template>
