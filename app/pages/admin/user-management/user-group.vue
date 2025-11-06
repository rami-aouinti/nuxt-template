<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { User } from '~/types/user'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'navigation.userGroups',
  icon: 'mdi-account-group-outline',
  drawerIndex: 2,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

type UserGroup = {
  id: string
  name: string
  description?: string | null
}

type UserGroupPayload = {
  name: string
  description?: string
}

const search = ref('')

const headers: DataTableHeader[] = [
  { title: 'Nom', key: 'name' },
  { title: 'Identifiant', key: 'id' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: 150 },
]

const { data, pending, error, refresh } = await useFetch<UserGroup[]>(
  '/api/v1/user_group',
)

const items = computed<UserGroup[]>(() => data.value ?? [])

const form = reactive({
  name: '',
  description: '',
})

const formError = ref('')
const actionLoading = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const viewLoading = ref(false)
const viewError = ref('')
const deleteLoading = ref(false)
const deleteError = ref('')
const viewingGroup = ref<UserGroup | null>(null)
const editingGroup = ref<UserGroup | null>(null)
const deletingGroup = ref<UserGroup | null>(null)

const groupUsers = ref<User[]>([])
const groupUsersLoading = ref(false)
const groupUsersError = ref('')
const userActionLoading = ref(false)
const attachUserDialog = ref(false)
const attachUserError = ref('')
const attachUserForm = reactive({ userId: '' })

const { data: usersData, refresh: refreshUsers } = await useFetch<User[]>(
  '/api/v1/user',
)

const allUsers = computed<User[]>(() => usersData.value ?? [])

const availableUsersForGroup = computed(() => {
  if (!viewingGroup.value) {
    return [] as User[]
  }

  const existingUserIds = new Set(groupUsers.value.map((user) => user.id))
  return allUsers.value.filter((user) => !existingUserIds.has(user.id))
})

const canSubmit = computed(
  () => form.name.trim().length > 0 && !actionLoading.value,
)

function defaultFormState() {
  return {
    name: '',
    description: '',
  }
}

function resetForm() {
  Object.assign(form, defaultFormState())
}

function populateForm(group: UserGroup) {
  form.name = group.name ?? ''
  form.description = group.description ?? ''
}

function ensureFormValid() {
  formError.value = ''
  if (!form.name.trim()) {
    formError.value = 'Le nom du groupe est obligatoire.'
    return false
  }
  return true
}

function buildPayload(): UserGroupPayload {
  const payload: UserGroupPayload = {
    name: form.name.trim(),
  }

  const description = form.description.trim()
  if (description.length > 0) {
    payload.description = description
  }

  return payload
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

function openCreate() {
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
  if (!ensureFormValid()) {
    if (formError.value) {
      Notify.error(formError.value)
    }
    return
  }

  actionLoading.value = true
  try {
    await $fetch('/api/v1/user_group', {
      method: 'POST',
      body: buildPayload(),
    })
    Notify.success("Groupe d'utilisateurs créé avec succès")
    createDialog.value = false
    resetForm()
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      "Impossible de créer le groupe d'utilisateurs.",
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openEdit(group: UserGroup) {
  editingGroup.value = group
  populateForm(group)
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
  if (!editingGroup.value) {
    return
  }

  if (!ensureFormValid()) {
    if (formError.value) {
      Notify.error(formError.value)
    }
    return
  }

  actionLoading.value = true
  try {
    await $fetch(`/api/v1/user_group/${editingGroup.value.id}`, {
      method: 'PUT',
      body: buildPayload(),
    })
    Notify.success("Groupe d'utilisateurs mis à jour")
    editDialog.value = false
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      "Impossible de mettre à jour le groupe d'utilisateurs.",
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openView(group: UserGroup) {
  viewingGroup.value = { ...group }
  viewDialog.value = true
  viewError.value = ''
  loadGroupDetails(group.id)
  loadGroupUsers(group.id)
}

async function loadGroupDetails(id: string) {
  viewLoading.value = true
  try {
    viewingGroup.value = await $fetch<UserGroup>(`/api/v1/user_group/${id}`)
  } catch (error) {
    viewError.value = extractRequestError(
      error,
      "Impossible de charger les détails du groupe d'utilisateurs.",
    )
    Notify.error(viewError.value)
  } finally {
    viewLoading.value = false
  }
}

async function loadGroupUsers(id: string) {
  groupUsersLoading.value = true
  groupUsersError.value = ''
  try {
    groupUsers.value = await $fetch<User[]>(
      `/api/v1/user_group/${id}/users`,
    )
  } catch (error) {
    groupUsersError.value = extractRequestError(
      error,
      "Impossible de récupérer les utilisateurs de ce groupe.",
    )
    Notify.error(groupUsersError.value)
  } finally {
    groupUsersLoading.value = false
  }
}

function closeView() {
  if (viewLoading.value) {
    return
  }

  viewDialog.value = false
}

function openDelete(group: UserGroup) {
  deletingGroup.value = group
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
  if (!deletingGroup.value) {
    return
  }

  deleteLoading.value = true
  deleteError.value = ''
  try {
    await $fetch(`/api/v1/user_group/${deletingGroup.value.id}`, {
      method: 'DELETE',
    })
    Notify.success("Groupe d'utilisateurs supprimé")
    deleteDialog.value = false
    await refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      "Impossible de supprimer ce groupe d'utilisateurs.",
    )
    Notify.error(deleteError.value)
  } finally {
    deleteLoading.value = false
  }
}

function openAttachUserDialog() {
  attachUserForm.userId = ''
  attachUserError.value = ''
  attachUserDialog.value = true
}

function closeAttachUserDialog() {
  if (userActionLoading.value) {
    return
  }

  attachUserDialog.value = false
}

async function submitAttachUser() {
  if (!viewingGroup.value || !attachUserForm.userId) {
    attachUserError.value =
      'Sélectionnez un utilisateur à associer à ce groupe.'
    Notify.error(attachUserError.value)
    return
  }

  userActionLoading.value = true
  attachUserError.value = ''
  try {
    await $fetch(
      `/api/v1/user_group/${viewingGroup.value.id}/user/${attachUserForm.userId}`,
      { method: 'POST' },
    )
    Notify.success("Utilisateur associé au groupe")
    attachUserDialog.value = false
    await Promise.all([
      loadGroupUsers(viewingGroup.value.id),
      refreshUsers(),
    ])
  } catch (error) {
    attachUserError.value = extractRequestError(
      error,
      "Impossible d'associer cet utilisateur au groupe.",
    )
    Notify.error(attachUserError.value)
  } finally {
    userActionLoading.value = false
  }
}

async function detachUser(userId: string) {
  if (!viewingGroup.value) {
    return
  }

  userActionLoading.value = true
  try {
    await $fetch(
      `/api/v1/user_group/${viewingGroup.value.id}/user/${userId}`,
      { method: 'DELETE' },
    )
    Notify.success("Utilisateur dissocié du groupe")
    await Promise.all([
      loadGroupUsers(viewingGroup.value.id),
      refreshUsers(),
    ])
  } catch (error) {
    const message = extractRequestError(
      error,
      "Impossible de dissocier cet utilisateur du groupe.",
    )
    Notify.error(message)
  } finally {
    userActionLoading.value = false
  }
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
    editingGroup.value = null
    resetForm()
  }
})

watch(viewDialog, (value) => {
  if (!value) {
    viewLoading.value = false
    viewError.value = ''
    viewingGroup.value = null
    groupUsers.value = []
    groupUsersError.value = ''
    groupUsersLoading.value = false
    userActionLoading.value = false
    attachUserDialog.value = false
    attachUserError.value = ''
    attachUserForm.userId = ''
  }
})

watch(deleteDialog, (value) => {
  if (!value) {
    deleteLoading.value = false
    deleteError.value = ''
    deletingGroup.value = null
  }
})

watch(attachUserDialog, (value) => {
  if (!value) {
    userActionLoading.value = false
    attachUserError.value = ''
    attachUserForm.userId = ''
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
                label="Rechercher"
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
          <v-card-title
            class="d-flex align-center justify-space-between flex-wrap"
            style="gap: 12px"
          >
            <span class="text-h6">Groupes d'utilisateurs</span>
            <div class="d-flex align-center" style="gap: 8px">
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                :disabled="pending"
                @click="openCreate"
              >
                Nouveau groupe
              </v-btn>
              <v-btn
                icon="mdi-refresh"
                variant="text"
                :loading="pending"
                @click="refresh()"
              />
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              Impossible de récupérer les groupes d'utilisateurs.
            </v-alert>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="pending"
              :search="search"
              item-value="id"
              class="elevation-0"
            >
              <template #item.description="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex align-center justify-end" style="gap: 4px">
                  <v-btn
                    icon
                    variant="text"
                    color="primary"
                    :title="`Afficher ${item.raw?.name ?? ''}`"
                    @click="openView(item.raw)"
                  >
                    <v-icon icon="mdi-eye-outline" />
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    color="warning"
                    :title="`Modifier ${item.raw?.name ?? ''}`"
                    @click="openEdit(item.raw)"
                  >
                    <v-icon icon="mdi-pencil-outline" />
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    color="error"
                    :title="`Supprimer ${item.raw?.name ?? ''}`"
                    @click="openDelete(item.raw)"
                  >
                    <v-icon icon="mdi-delete-outline" />
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="createDialog" max-width="540">
      <v-card>
        <v-card-title>Créer un groupe d'utilisateurs</v-card-title>
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
              v-model="form.name"
              label="Nom du groupe"
              :disabled="actionLoading"
              required
              autocomplete="off"
            />
            <v-textarea
              v-model="form.description"
              label="Description"
              :disabled="actionLoading"
              auto-grow
              rows="3"
              autocomplete="off"
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
            :disabled="!canSubmit"
            :loading="actionLoading"
            @click="submitCreate"
          >
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="540">
      <v-card>
        <v-card-title>Modifier le groupe d'utilisateurs</v-card-title>
        <v-card-text>
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ formError }}
          </v-alert>
          <v-form @submit.prevent="submitEdit">
            <v-text-field
              v-model="form.name"
              label="Nom du groupe"
              :disabled="actionLoading"
              required
              autocomplete="off"
            />
            <v-textarea
              v-model="form.description"
              label="Description"
              :disabled="actionLoading"
              auto-grow
              rows="3"
              autocomplete="off"
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
            :disabled="!canSubmit"
            :loading="actionLoading"
            @click="submitEdit"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="560">
      <v-card>
        <v-card-title>Détails du groupe d'utilisateurs</v-card-title>
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
          <template v-if="viewingGroup && !viewLoading">
            <div class="d-flex flex-column" style="row-gap: 12px">
              <div>
                <div class="text-caption text-medium-emphasis">Nom</div>
                <div class="text-body-1 font-weight-medium">
                  {{ viewingGroup.name }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Identifiant</div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingGroup.id }}
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Description</div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewingGroup.description || '—' }}
                </div>
              </div>
              <div>
                <div
                  class="d-flex align-center justify-space-between mb-2"
                  style="gap: 12px"
                >
                  <span class="text-caption text-medium-emphasis">Utilisateurs</span>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-account-plus"
                    :disabled="userActionLoading"
                    @click="openAttachUserDialog"
                  >
                    Associer un utilisateur
                  </v-btn>
                </div>
                <v-progress-linear
                  v-if="groupUsersLoading"
                  color="primary"
                  indeterminate
                  class="mb-2"
                />
                <v-alert
                  v-else-if="groupUsersError"
                  type="error"
                  variant="tonal"
                  class="mb-2"
                >
                  {{ groupUsersError }}
                </v-alert>
                <v-list
                  v-else-if="groupUsers.length > 0"
                  density="comfortable"
                  class="py-0"
                >
                  <v-list-item
                    v-for="user in groupUsers"
                    :key="user.id"
                    :title="user.username"
                    :subtitle="user.email || '—'"
                  >
                    <template #append>
                      <v-btn
                        icon="mdi-close"
                        variant="text"
                        color="error"
                        :disabled="userActionLoading"
                        @click="detachUser(user.id)"
                      />
                    </template>
                  </v-list-item>
                </v-list>
                <div v-else class="text-body-2 text-medium-emphasis">
                  Aucun utilisateur associé.
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!viewLoading" class="text-body-2 text-medium-emphasis">
            Aucun groupe sélectionné.
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

    <v-dialog v-model="attachUserDialog" max-width="520">
      <v-card>
        <v-card-title>Associer un utilisateur</v-card-title>
        <v-card-text>
          <v-alert
            v-if="attachUserError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ attachUserError }}
          </v-alert>
          <v-select
            v-model="attachUserForm.userId"
            :items="availableUsersForGroup"
            item-title="username"
            item-value="id"
            label="Utilisateur"
            :disabled="userActionLoading || groupUsersLoading"
            :loading="groupUsersLoading"
            density="comfortable"
            placeholder="Sélectionnez un utilisateur"
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="userActionLoading"
            @click="closeAttachUserDialog"
          >
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            :disabled="userActionLoading || !attachUserForm.userId"
            :loading="userActionLoading"
            @click="submitAttachUser"
          >
            Associer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="520">
      <v-card>
        <v-card-title>Supprimer le groupe d'utilisateurs</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            Cette action est irréversible. Voulez-vous vraiment supprimer
            <strong>{{ deletingGroup?.name ?? 'ce groupe' }}</strong> ?
          </v-alert>
          <v-alert
            v-if="deleteError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ deleteError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="deleteLoading" @click="closeDelete">
            Annuler
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteLoading"
            :disabled="!deletingGroup"
            @click="confirmDelete"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
