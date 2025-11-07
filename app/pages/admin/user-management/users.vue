<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import type { User, UserPayload } from '~/types/user'

definePageMeta({
  title: 'navigation.users',
  icon: 'mdi-account-multiple-outline',
  drawerIndex: 1,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
const adminStore = useAdminStore()

await Promise.all([
  adminStore.fetchUsers(),
  adminStore.fetchUserGroups(),
])

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('userManagement.users.table.username'), key: 'username' },
  { title: t('userManagement.users.table.firstName'), key: 'firstName' },
  { title: t('userManagement.users.table.lastName'), key: 'lastName' },
  { title: t('userManagement.users.table.email'), key: 'email' },
  { title: t('userManagement.users.table.status'), key: 'enabled' },
  { title: '', key: 'actions', sortable: false, align: 'end', width: 150 },
])

const pending = adminStore.usersPending
const error = adminStore.usersError
const tableError = computed(() =>
  error.value ? t('userManagement.users.alerts.loadFailed') : null,
)
const refresh = () => adminStore.refreshUsers()

type UserGroup = {
  id: string
  name: string
  description?: string | null
}

type Group = {
  id: string
  name: string
}

const refreshUserGroups = () => adminStore.refreshUserGroups()

const items = computed<User[]>(() => adminStore.users.value ?? [])
const userGroups = computed<UserGroup[]>(
  () => adminStore.userGroups.value ?? [],
)

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
const userGroupsLoading = ref(false)
const userGroupsError = ref('')
const viewUserGroups = ref<Group[]>([])
const groupActionLoading = ref(false)
const attachDialog = ref(false)
const attachError = ref('')
const attachForm = reactive({ groupId: '' })

const availableGroupsForUser = computed(() => {
  if (!viewUser.value) {
    return [] as UserGroup[]
  }

  const existingIds = new Set(viewUserGroups.value.map((group) => group.id))
  return userGroups.value.filter((group) => !existingIds.has(group.id))
})

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
    formError.value = t('userManagement.users.errors.usernameEmailRequired')
    return false
  }
  if (requirePassword && !form.password.trim()) {
    formError.value = t('userManagement.users.errors.passwordRequired')
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
    Notify.success(t('userManagement.users.notifications.createSuccess'))
    createDialog.value = false
    resetForm()
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.users.errors.createFailed'),
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
    Notify.success(t('userManagement.users.notifications.updateSuccess'))
    editDialog.value = false
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.users.errors.updateFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openView(user?: User | null) {
  console.debug(t('userManagement.users.logs.openDetail'), user)
  if (!user || !user.id) {
    Notify.error(t('userManagement.users.errors.openView'))
    return
  }

  viewDialog.value = true
  viewError.value = ''
  viewUser.value = { ...user }
  loadUserDetails(user.id)
  //loadUserGroups(user.id)
}

async function loadUserDetails(id: string) {
  viewLoading.value = true
  try {
    viewUser.value = await $fetch<User>(`/api/v1/user/${id}`)
  } catch (error) {
    viewError.value = extractRequestError(
      error,
      t('userManagement.users.errors.loadDetails'),
    )
    Notify.error(viewError.value)
  } finally {
    viewLoading.value = false
  }
}

async function loadUserGroups(id: string) {
  userGroupsLoading.value = true
  userGroupsError.value = ''
  try {
    viewUserGroups.value = await $fetch<Group[]>(
      `/api/v1/user/${id}/groups`,
    )
  } catch (error) {
    userGroupsError.value = extractRequestError(
      error,
      t('userManagement.users.errors.loadGroups'),
    )
    Notify.error(userGroupsError.value)
  } finally {
    userGroupsLoading.value = false
  }
}

function closeView() {
  if (viewLoading.value) {
    return
  }

  viewDialog.value = false
}

function openAttachDialog() {
  attachForm.groupId = ''
  attachError.value = ''
  attachDialog.value = true
}

function closeAttachDialog() {
  if (groupActionLoading.value) {
    return
  }

  attachDialog.value = false
}

async function submitAttach() {
  if (!viewUser.value || !attachForm.groupId) {
    attachError.value = t('userManagement.users.errors.selectGroup')
    Notify.error(attachError.value)
    return
  }

  groupActionLoading.value = true
  attachError.value = ''
  try {
    await $fetch(
      `/api/v1/user/${viewUser.value.id}/group/${attachForm.groupId}`,
      {
        method: 'POST',
      },
    )
    Notify.success(t('userManagement.users.notifications.attachSuccess'))
    attachDialog.value = false
    await Promise.all([loadUserGroups(viewUser.value.id), refreshUserGroups()])
  } catch (error) {
    attachError.value = extractRequestError(
      error,
      t('userManagement.users.errors.attachFailed'),
    )
    Notify.error(attachError.value)
  } finally {
    groupActionLoading.value = false
  }
}

async function detachGroup(groupId: string) {
  if (!viewUser.value) {
    return
  }

  groupActionLoading.value = true
  try {
    await $fetch(
      `/api/v1/user/${viewUser.value.id}/group/${groupId}`,
      {
        method: 'DELETE',
      },
    )
    Notify.success(t('userManagement.users.notifications.detachSuccess'))
    await Promise.all([loadUserGroups(viewUser.value.id), refreshUserGroups()])
  } catch (error) {
    const message = extractRequestError(
      error,
      t('userManagement.users.errors.detachFailed'),
    )
    Notify.error(message)
  } finally {
    groupActionLoading.value = false
  }
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
    Notify.success(t('userManagement.users.notifications.deleteSuccess'))
    deleteDialog.value = false
    await refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      t('userManagement.users.errors.deleteFailed'),
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
    userGroupsLoading.value = false
    userGroupsError.value = ''
    viewUserGroups.value = []
    groupActionLoading.value = false
    attachDialog.value = false
    attachError.value = ''
    attachForm.groupId = ''
  }
})

watch(attachDialog, (value) => {
  if (!value) {
    groupActionLoading.value = false
    attachError.value = ''
    attachForm.groupId = ''
  }
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <AdminDataTable
          :headers="headers"
          :items="items"
          :loading="pending"
          :error="tableError"
          v-model:search="search"
          :title="t('userManagement.users.cardTitle')"
          :subtitle="t('navigation.userManagement')"
          item-value="id"
          @refresh="refresh()"
        >
          <template #header-actions>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :disabled="pending"
              @click="openCreate"
            >
              {{ t('userManagement.users.actions.new') }}
            </v-btn>
          </template>
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
              {{
                value
                  ? t('userManagement.users.status.active')
                  : t('userManagement.users.status.inactive')
              }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex align-center justify-end" style="gap: 4px">
              <v-btn
                icon
                variant="text"
                color="primary"
                :title="
                  t('userManagement.users.actions.viewTooltip', {
                    username:
                      item.raw?.username ??
                      t('userManagement.users.labels.userFallback'),
                  })
                "
                @click="openView(item)"
              >
                <v-icon icon="mdi-eye-outline" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="warning"
                :title="
                  t('userManagement.users.actions.editTooltip', {
                    username:
                      item.raw?.username ??
                      t('userManagement.users.labels.userFallback'),
                  })
                "
                @click="openEdit(item)"
              >
                <v-icon icon="mdi-pencil-outline" />
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                :title="
                  t('userManagement.users.actions.deleteTooltip', {
                    username:
                      item.raw?.username ??
                      t('userManagement.users.labels.userFallback'),
                  })
                "
                @click="openDelete(item)"
              >
                <v-icon icon="mdi-delete-outline" />
              </v-btn>
            </div>
          </template>
        </AdminDataTable>
      </v-col>
    </v-row>

    <v-dialog v-model="createDialog" max-width="640">
      <v-card>
        <v-card-title>{{ t('userManagement.users.dialogs.create.title') }}</v-card-title>
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
                  :label="t('userManagement.users.fields.username')"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  :label="t('userManagement.users.fields.email')"
                  type="email"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstName"
                  :label="t('userManagement.users.fields.firstName')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.lastName"
                  :label="t('userManagement.users.fields.lastName')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.language"
                  :label="t('userManagement.users.fields.language')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.locale"
                  :label="t('userManagement.users.fields.locale')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.timezone"
                  :label="t('userManagement.users.fields.timezone')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  :label="t('userManagement.users.fields.password')"
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
                  :label="t('userManagement.users.fields.enabled')"
                />
              </v-col>
            </v-row>
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
            :disabled="!canSubmit"
            @click="submitCreate"
          >
            {{ t('common.actions.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="640">
      <v-card>
        <v-card-title>
          {{
            t('userManagement.users.dialogs.edit.title', {
              username:
                editingUser?.username ??
                t('userManagement.users.labels.userFallback'),
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
          <v-form @submit.prevent="submitEdit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.username"
                  :label="t('userManagement.users.fields.username')"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  :label="t('userManagement.users.fields.email')"
                  type="email"
                  required
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstName"
                  :label="t('userManagement.users.fields.firstName')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.lastName"
                  :label="t('userManagement.users.fields.lastName')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.language"
                  :label="t('userManagement.users.fields.language')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.locale"
                  :label="t('userManagement.users.fields.locale')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.timezone"
                  :label="t('userManagement.users.fields.timezone')"
                  :disabled="actionLoading"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  :label="t('userManagement.users.fields.newPassword')"
                  type="password"
                  :disabled="actionLoading"
                  autocomplete="new-password"
                  :hint="t('userManagement.users.hints.keepPassword')"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="form.enabled"
                  :disabled="actionLoading"
                  inset
                  color="primary"
                  :label="t('userManagement.users.fields.enabled')"
                />
              </v-col>
            </v-row>
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
            :disabled="!canSubmit"
            @click="submitEdit"
          >
            {{ t('common.actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="520">
      <v-card>
        <v-card-title>{{ t('userManagement.users.dialogs.view.title') }}</v-card-title>
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
                  {{ t('userManagement.users.fields.username') }}
                </div>
                <div class="text-body-1 font-weight-medium">
                  {{ viewUser.username }}
                </div>
              </div>
              <div class="d-flex flex-wrap" style="gap: 16px">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.fields.firstName') }}
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.firstName || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.fields.lastName') }}
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.lastName || '—' }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('userManagement.users.fields.email') }}
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ viewUser.email }}
                </div>
              </div>
              <div class="d-flex flex-wrap" style="gap: 16px">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.fields.language') }}
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.language || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.fields.locale') }}
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.locale || '—' }}
                  </div>
                </div>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.fields.timezone') }}
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ viewUser.timezone || '—' }}
                  </div>
                </div>
              </div>
              <div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('userManagement.users.fields.status') }}
                </div>
                <v-chip :color="viewUser.enabled ? 'success' : 'grey'" size="small" label>
                  {{
                    viewUser.enabled
                      ? t('userManagement.users.status.active')
                      : t('userManagement.users.status.inactive')
                  }}
                </v-chip>
              </div>
              <div>
                <div
                  class="d-flex align-center justify-space-between mb-2"
                  style="gap: 12px"
                >
                  <span class="text-caption text-medium-emphasis">
                    {{ t('userManagement.users.details.groups.title') }}
                  </span>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-account-group"
                    :disabled="groupActionLoading"
                    @click="openAttachDialog"
                  >
                    {{ t('userManagement.users.details.groups.actions.link') }}
                  </v-btn>
                </div>
                <v-progress-linear
                  v-if="userGroupsLoading"
                  color="primary"
                  indeterminate
                  class="mb-2"
                />
                <v-alert
                  v-else-if="userGroupsError"
                  type="error"
                  variant="tonal"
                  class="mb-2"
                >
                  {{ userGroupsError }}
                </v-alert>
                <div
                  v-else-if="viewUserGroups.length > 0"
                  class="d-flex flex-wrap"
                  style="gap: 8px"
                >
                  <v-chip
                    v-for="group in viewUserGroups"
                    :key="group.id"
                    color="primary"
                    variant="tonal"
                    closable
                    :disabled="groupActionLoading"
                    @click:close="detachGroup(group.id)"
                  >
                    {{ group.name }}
                  </v-chip>
                </div>
                <div v-else class="text-body-2 text-medium-emphasis">
                  {{ t('userManagement.users.details.groups.empty') }}
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!viewLoading" class="text-body-2 text-medium-emphasis">
            {{ t('userManagement.users.details.empty') }}
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

    <v-dialog v-model="attachDialog" max-width="480">
      <v-card>
        <v-card-title>{{ t('userManagement.users.dialogs.attachGroup.title') }}</v-card-title>
        <v-card-text>
          <v-alert
            v-if="attachError"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ attachError }}
          </v-alert>
          <v-select
            v-model="attachForm.groupId"
            :items="availableGroupsForUser"
            item-title="name"
            item-value="id"
            :label="t('common.labels.group')"
            :disabled="groupActionLoading || userGroupsLoading"
            :loading="userGroupsLoading"
            density="comfortable"
            :placeholder="t('common.placeholders.selectGroup')"
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="groupActionLoading" @click="closeAttachDialog">
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="groupActionLoading || !attachForm.groupId"
            :loading="groupActionLoading"
            @click="submitAttach"
          >
            {{ t('common.actions.link') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title>{{ t('userManagement.users.dialogs.delete.title') }}</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            {{ t('userManagement.users.dialogs.delete.warningPrefix') }}
            <strong>
              {{
                deletingUser?.username ??
                  t('userManagement.users.labels.userFallback')
              }}
            </strong>
            {{ t('userManagement.users.dialogs.delete.warningSuffix') }}
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
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteLoading"
            :disabled="!deletingUser"
            @click="confirmDelete"
          >
            {{ t('common.actions.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
