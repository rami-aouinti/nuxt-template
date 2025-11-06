<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { Notify } from '~/stores/notification'

type ApiVersion = 'v1' | 'v2'

type ApiKey = {
  id: string
  token: string
  description: string
}

type ApiKeyFormState = {
  description: string
  token: string
}

definePageMeta({
  title: 'API Keys',
  icon: 'mdi-key-outline',
  drawerIndex: 4,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const tab = ref<ApiVersion>('v1')
const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Description', key: 'description' },
  { title: 'Token', key: 'token' },
  { title: 'Identifiant', key: 'id' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: 150 },
]

const {
  data: apiKeysV1,
  pending: pendingV1,
  error: errorV1,
  refresh: refreshV1,
} = await useFetch<ApiKey[]>('/api/v1/api_key')

const {
  data: apiKeysV2,
  pending: pendingV2,
  error: errorV2,
  refresh: refreshV2,
} = await useFetch<ApiKey[]>('/api/v2/api_key')

const itemsV1 = computed<ApiKey[]>(() => apiKeysV1.value ?? [])
const itemsV2 = computed<ApiKey[]>(() => apiKeysV2.value ?? [])

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
  () =>
    form.description.trim().length > 0 &&
    form.token.trim().length > 0 &&
    !actionLoading.value,
)

const versionLabels: Record<ApiVersion, string> = {
  v1: 'API v1',
  v2: 'API v2',
}

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
  form.token = key.token ?? ''
}

function ensureFormValid(requireToken: boolean) {
  formError.value = ''
  if (!form.description.trim()) {
    formError.value = 'La description est obligatoire.'
    return false
  }

  if (requireToken && !form.token.trim()) {
    formError.value = 'Le token est obligatoire.'
    return false
  }

  return true
}

function buildCreatePayload() {
  return {
    description: form.description.trim(),
    token: form.token.trim(),
  }
}

function buildUpdatePayload(method: 'PUT' | 'PATCH') {
  const payload: Record<string, string> = {}

  const description = form.description.trim()
  const token = form.token.trim()

  if (method === 'PUT') {
    if (!ensureFormValid(true)) {
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
    formError.value =
      'Renseignez au moins un champ pour mettre à jour la clé API.'
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

  if (!ensureFormValid(true)) {
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
    Notify.success(`Clé API créée avec succès (${versionLabels[version]})`)
    createDialog.value = false
    resetForm()
    await fetchContext[version].refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      'Impossible de créer la clé API.',
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
      `Clé API mise à jour avec succès (${versionLabels[version]})`,
    )
    editDialog.value = false
    await fetchContext[version].refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      'Impossible de mettre à jour la clé API.',
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
      'Impossible de charger les détails de la clé API.',
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
    Notify.success(`Clé API supprimée (${versionLabels[version]})`)
    deleteDialog.value = false
    await fetchContext[version].refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      'Impossible de supprimer la clé API.',
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
                label="Search"
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
            <span class="text-h6">Clés API</span>
            <v-btn-toggle
              v-model="tab"
              variant="text"
              divided
              density="compact"
              color="primary"
            >
              <v-btn value="v1">API v1</v-btn>
              <v-btn value="v2">API v2</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="v1">
                <v-alert v-if="errorV1" type="error" variant="tonal" class="mb-4">
                  Les clés de l'API v1 n'ont pas pu être chargées.
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
                    Nouvelle clé API
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
                        :title="`Afficher ${item.raw?.description ?? ''}`"
                        @click="openView('v1', item.raw)"
                      >
                        <v-icon icon="mdi-eye-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="warning"
                        :title="`Modifier ${item.raw?.description ?? ''}`"
                        @click="openEdit('v1', item.raw)"
                      >
                        <v-icon icon="mdi-pencil-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="error"
                        :title="`Supprimer ${item.raw?.description ?? ''}`"
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
                  Les clés de l'API v2 n'ont pas pu être chargées.
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
                    Nouvelle clé API
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
                        :title="`Afficher ${item.raw?.description ?? ''}`"
                        @click="openView('v2', item.raw)"
                      >
                        <v-icon icon="mdi-eye-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="warning"
                        :title="`Modifier ${item.raw?.description ?? ''}`"
                        @click="openEdit('v2', item.raw)"
                      >
                        <v-icon icon="mdi-pencil-outline" />
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="error"
                        :title="`Supprimer ${item.raw?.description ?? ''}`"
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
          Créer une clé API ({{ versionLabels[actionVersion] }})
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
              label="Description"
              :disabled="actionLoading"
              autocomplete="off"
              required
            />
            <v-text-field
              v-model="form.token"
              label="Token"
              :disabled="actionLoading"
              autocomplete="off"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="actionLoading" @click="closeCreate">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            :loading="actionLoading"
            :disabled="!canSubmitCreate"
            @click="submitCreate"
          >
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="520">
      <v-card>
        <v-card-title>
          Modifier la clé API ({{ versionLabels[actionVersion] }})
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
              label="Description"
              :disabled="actionLoading"
              autocomplete="off"
              required
            />
            <v-text-field
              v-model="form.token"
              label="Token"
              :disabled="actionLoading"
              autocomplete="off"
              :required="editMethod === 'PUT'"
              hint="Laissez vide pour ne pas modifier (PATCH seulement)."
              persistent-hint
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="actionLoading" @click="closeEdit">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            :loading="actionLoading"
            :disabled="actionLoading"
            @click="submitEdit"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="500">
      <v-card>
        <v-card-title>
          Détails de la clé API ({{ versionLabels[actionVersion] }})
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
                <div class="text-caption text-medium-emphasis">Identifiant</div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingKey.id }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Description</div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingKey.description }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Token</div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingKey.token }}
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!viewLoading" class="text-body-2 text-medium-emphasis">
            Aucune clé API sélectionnée.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="viewLoading" @click="closeView">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title>Supprimer la clé API</v-card-title>
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
            Êtes-vous sûr de vouloir supprimer cette clé API
            <strong>{{ deletingKey?.description }}</strong> ?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="deleteLoading" @click="closeDelete">
            Annuler
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteLoading"
            :disabled="deleteLoading"
            @click="confirmDelete"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
