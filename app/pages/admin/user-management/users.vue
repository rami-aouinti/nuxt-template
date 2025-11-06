<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import type { User, UserPayload } from '~/types/user'
import { Notify } from '~/stores/notification'

definePageMeta({
  title: 'Users',
  icon: 'mdi-account-multiple-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const search = ref('')

const headers: DataTableHeader[] = [
  { title: "Nom d'utilisateur", key: 'username' },
  { title: 'Prénom', key: 'firstName' },
  { title: 'Nom', key: 'lastName' },
  { title: 'Adresse e-mail', key: 'email' },
  { title: 'Statut', key: 'enabled' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: 150 },
]

const { data, pending, error, refresh } = await useFetch<User[]>('/api/v1/user')

const items = computed<User[]>(() => data.value ?? [])

type UserFormState = {
  username: string
  firstName: string
  lastName: string
  email: string
  language: string
  locale: string
  timezone: string
  password: string
  enabled: boolean
}

const defaultFormState = (): UserFormState => ({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  language: '',
  locale: '',
  timezone: '',
  password: '',
  enabled: true,
})

const form = reactive<UserFormState>(defaultFormState())
const formError = ref('')
const actionLoading = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const viewLoading = ref(false)
const viewError = ref('')
const deleteError = ref('')
const deleteLoading = ref(false)
const viewUser = ref<User | null>(null)
const editingUser = ref<User | null>(null)
const deletingUser = ref<User | null>(null)

const canSubmit = computed(() => {
  const hasBasics =
    form.username.trim().length > 0 && form.email.trim().length > 0
  if (createDialog.value) {
    return hasBasics && form.password.trim().length > 0 && !actionLoading.value
  }
  return hasBasics && !actionLoading.value
})

function resetForm() {
  Object.assign(form, defaultFormState())
}

function populateForm(user: User) {
  form.username = user.username ?? ''
  form.firstName = user.firstName ?? ''
  form.lastName = user.lastName ?? ''
  form.email = user.email ?? ''
  form.language = user.language ?? ''
  form.locale = user.locale ?? ''
  form.timezone = user.timezone ?? ''
  form.enabled = Boolean(user.enabled)
  form.password = ''
}

function ensureFormValid(requirePassword: boolean) {
  formError.value = ''
  if (!form.username.trim() || !form.email.trim()) {
    formError.value =
      "Les champs Nom d'utilisateur et Adresse e-mail sont obligatoires."
    return false
  }
  if (requirePassword && !form.password.trim()) {
    formError.value =
      'Un mot de passe est requis pour créer un nouvel utilisateur.'
    return false
  }
  return true
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

function buildPayload(): UserPayload {
  const payload: UserPayload = {
    username: form.username.trim(),
    email: form.email.trim(),
    enabled: form.enabled,
  }

  const optionalFields: Array<
    'firstName' | 'lastName'
  > = ['firstName', 'lastName']

  for (const field of optionalFields) {
    const value = form[field].trim()
    if (value.length > 0) {
      payload[field] = value
    }
  }

  if (form.password.trim().length > 0) {
    payload.password = form.password
  }

  return payload
}

function openCreate() {
  resetForm()
  form.enabled = true
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
  if (!ensureFormValid(true)) {
    if (formError.value) {
      Notify.error(formError.value)
    }
    return
  }

  actionLoading.value = true
  try {
    await $fetch('/api/v1/user', {
      method: 'POST',
      body: buildPayload(),
    })
    Notify.success('Utilisateur créé avec succès')
    createDialog.value = false
    resetForm()
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      "Impossible de créer l'utilisateur.",
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openEdit(user: User) {
  editingUser.value = user
  populateForm(user)
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
  if (!editingUser.value) {
    return
  }

  if (!ensureFormValid(false)) {
    if (formError.value) {
      Notify.error(formError.value)
    }
    return
  }

  actionLoading.value = true
  try {
    await $fetch(`/api/v1/user/${editingUser.value.id}`, {
      method: 'PUT',
      body: buildPayload(),
    })
    Notify.success('Utilisateur mis à jour avec succès')
    editDialog.value = false
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      "Impossible de mettre à jour l'utilisateur.",
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openView(user: User) {
  viewDialog.value = true
  viewError.value = ''
  viewUser.value = { ...user }
  loadUserDetails(user.id)
}

async function loadUserDetails(id: string) {
  viewLoading.value = true
  try {
    viewUser.value = await $fetch<User>(`/api/v1/user/${id}`)
  } catch (error) {
    viewError.value = extractRequestError(
      error,
      "Impossible de récupérer les détails de l'utilisateur.",
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

function openDelete(user: User) {
  deletingUser.value = user
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
  if (!deletingUser.value) {
    return
  }

  deleteError.value = ''
  deleteLoading.value = true
  try {
    await $fetch(`/api/v1/user/${deletingUser.value.id}`, { method: 'DELETE' })
    Notify.success('Utilisateur supprimé avec succès')
    deleteDialog.value = false
    await refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      "Impossible de supprimer l'utilisateur.",
    )
    Notify.error(deleteError.value)
  } finally {
    deleteLoading.value = false
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
    editingUser.value = null
    resetForm()
  }
})

watch(deleteDialog, (value) => {
  if (!value) {
    deleteLoading.value = false
    deleteError.value = ''
    deletingUser.value = null
  }
})

watch(viewDialog, (value) => {
  if (!value) {
    viewLoading.value = false
    viewError.value = ''
    viewUser.value = null
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
            <span class="text-h6">Gestion des utilisateurs</span>
            <div class="d-flex align-center" style="gap: 8px">
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                :disabled="pending"
                @click="openCreate"
              >
                Nouvel utilisateur
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
              Une erreur est survenue lors du chargement des utilisateurs.
            </v-alert>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="pending"
              :search="search"
              item-value="id"
              class="elevation-0"
            >
              <template #item.firstName="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.lastName="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.language="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.locale="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.timezone="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.enabled="{ value }">
                <v-chip :color="value ? 'success' : 'grey'" size="small" label>
                  {{ value ? 'Actif' : 'Inactif' }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex align-center justify-end" style="gap: 4px">
                  <v-btn
                    icon
                    variant="text"
                    color="primary"
                    :title="`Afficher ${item.raw?.username ?? ''}`"
                    @click="openView(item.raw)"
                  >
                    <v-icon icon="mdi-eye-outline" />
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    color="warning"
                    :title="`Modifier ${item.raw?.username ?? ''}`"
                    @click="openEdit(item.raw)"
                  >
                    <v-icon icon="mdi-pencil-outline" />
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    color="error"
                    :title="`Supprimer ${item.raw?.username ?? ''}`"
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

    <v-dialog v-model="createDialog" max-width="640">
      <v-card>
        <v-card-title>Créer un utilisateur</v-card-title>
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
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.username"
                  label="Nom d'utilisateur"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Adresse e-mail"
                  type="email"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstName"
                  label="Prénom"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.lastName"
                  label="Nom"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.language"
                  label="Langue"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.locale"
                  label="Locale"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.timezone"
                  label="Fuseau horaire"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  label="Mot de passe"
                  type="password"
                  required
                  :disabled="actionLoading"
                  autocomplete="new-password"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="form.enabled"
                  :disabled="actionLoading"
                  inset
                  color="primary"
                  label="Utilisateur actif"
                />
              </v-col>
            </v-row>
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
            :disabled="!canSubmit"
            @click="submitCreate"
          >
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="640">
      <v-card>
        <v-card-title>
          Modifier {{ editingUser?.username ?? "l'utilisateur" }}
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
          <v-form @submit.prevent="submitEdit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.username"
                  label="Nom d'utilisateur"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Adresse e-mail"
                  type="email"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstName"
                  label="Prénom"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.lastName"
                  label="Nom"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.language"
                  label="Langue"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.locale"
                  label="Locale"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.timezone"
                  label="Fuseau horaire"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  label="Nouveau mot de passe (optionnel)"
                  type="password"
                  :disabled="actionLoading"
                  autocomplete="new-password"
                  hint="Laissez vide pour conserver le mot de passe actuel"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="form.enabled"
                  :disabled="actionLoading"
                  inset
                  color="primary"
                  label="Utilisateur actif"
                />
              </v-col>
            </v-row>
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
            :disabled="!canSubmit"
            @click="submitEdit"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="520">
      <v-card>
        <v-card-title>Détails de l'utilisateur</v-card-title>
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
          <template v-if="viewUser && !viewLoading">
            <div class="d-flex flex-column" style="row-gap: 12px">
              <div>
                <div class="text-caption text-medium-emphasis">
                  Nom d'utilisateur
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ viewUser.username }}
                </div>
              </div>
              <div class="d-flex flex-wrap" style="gap: 16px">
                <div>
                  <div class="text-caption text-medium-emphasis">Prénom</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.firstName || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">Nom</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.lastName || '—' }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  Adresse e-mail
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewUser.email }}
                </div>
              </div>
              <div class="d-flex flex-wrap" style="gap: 16px">
                <div>
                  <div class="text-caption text-medium-emphasis">Langue</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.language || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">Locale</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.locale || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    Fuseau horaire
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.timezone || '—' }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">Statut</div>
                <v-chip :color="viewUser.enabled ? 'success' : 'grey'" size="small" label>
                  {{ viewUser.enabled ? 'Actif' : 'Inactif' }}
                </v-chip>
              </div>
            </div>
          </template>
          <div v-else-if="!viewLoading" class="text-body-2 text-medium-emphasis">
            Aucun utilisateur sélectionné.
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
        <v-card-title>Supprimer un utilisateur</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            Cette action est irréversible. Voulez-vous vraiment supprimer
            <strong>{{ deletingUser?.username ?? 'cet utilisateur' }}</strong>
            ?
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
            :disabled="!deletingUser"
            @click="confirmDelete"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
