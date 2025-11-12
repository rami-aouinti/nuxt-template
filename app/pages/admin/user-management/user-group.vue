<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { DataTableHeader } from 'vuetify'
import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import type { User } from '~/types/user'
import AppButton from "~/components/ui/AppButton.vue";
import AppCard from "~/components/ui/AppCard.vue";

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

const { t } = useI18n()
const adminStore = useAdminStore()
const { userGroups, userGroupsPending, userGroupsError, users } =
  storeToRefs(adminStore)

await Promise.all([adminStore.fetchUserGroups(), adminStore.fetchUsers()])

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('userManagement.groups.table.name'), key: 'name' },
  { title: t('userManagement.groups.table.id'), key: 'id' },
  {
    title: t('userManagement.groups.table.actions'),
    key: 'actions',
    sortable: false,
    align: 'end',
    width: 150,
  },
])

const pending = userGroupsPending
const error = userGroupsError
const refresh = () => adminStore.refreshUserGroups()

const items = computed<UserGroup[]>(() => userGroups.value ?? [])
const tableError = computed(() =>
  error.value ? t('userManagement.groups.alerts.loadFailed') : null,
)

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

const refreshUsers = () => adminStore.refreshUsers()

const allUsers = computed<User[]>(() => users.value ?? [])

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
    formError.value = t('userManagement.groups.errors.nameRequired')
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
    Notify.success(t('userManagement.groups.notifications.createSuccess'))
    createDialog.value = false
    resetForm()
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.groups.errors.createFailed'),
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
    Notify.success(t('userManagement.groups.notifications.updateSuccess'))
    editDialog.value = false
    await refresh()
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.groups.errors.updateFailed'),
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
      t('userManagement.groups.errors.loadDetails'),
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
    groupUsers.value = await $fetch<User[]>(`/api/v1/user_group/${id}/users`)
  } catch (error) {
    groupUsersError.value = extractRequestError(
      error,
      t('userManagement.groups.errors.loadUsers'),
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
    Notify.success(t('userManagement.groups.notifications.deleteSuccess'))
    deleteDialog.value = false
    await refresh()
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      t('userManagement.groups.errors.deleteFailed'),
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
    attachUserError.value = t('userManagement.groups.errors.selectUser')
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
    Notify.success(t('userManagement.groups.notifications.attachSuccess'))
    attachUserDialog.value = false
    await Promise.all([loadGroupUsers(viewingGroup.value.id), refreshUsers()])
  } catch (error) {
    attachUserError.value = extractRequestError(
      error,
      t('userManagement.groups.errors.attachFailed'),
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
    await $fetch(`/api/v1/user_group/${viewingGroup.value.id}/user/${userId}`, {
      method: 'DELETE',
    })
    Notify.success(t('userManagement.groups.notifications.detachSuccess'))
    await Promise.all([loadGroupUsers(viewingGroup.value.id), refreshUsers()])
  } catch (error) {
    const message = extractRequestError(
      error,
      t('userManagement.groups.errors.detachFailed'),
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
        <AdminDataTable
          v-model:search="search"
          :headers="headers"
          :items="items"
          :loading="pending"
          :error="tableError"
          :title="t('userManagement.groups.cardTitle')"
          :subtitle="t('navigation.userManagement')"
          item-value="id"
          @refresh="refresh()"
        >
          <template #header-actions>
            <AppButton
              color="primary"
              prepend-icon="mdi-plus"
              :disabled="pending"
              @click="openCreate"
            >
              {{ t('userManagement.groups.actions.new') }}
            </AppButton>
          </template>
          <template #item.description="{ value }">
            {{ value || '—' }}
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex align-center justify-end" style="gap: 4px">
              <AppButton
                icon
                variant="text"
                color="primary"
                :title="
                  t('userManagement.groups.actions.viewTooltip', {
                    name:
                      item.raw?.name ??
                      t('userManagement.groups.labels.groupFallback'),
                  })
                "
                @click="openView(item.raw)"
              >
                <v-icon icon="mdi-eye-outline" />
              </AppButton>
              <AppButton
                icon
                variant="text"
                color="warning"
                :title="
                  t('userManagement.groups.actions.editTooltip', {
                    name:
                      item.raw?.name ??
                      t('userManagement.groups.labels.groupFallback'),
                  })
                "
                @click="openEdit(item.raw)"
              >
                <v-icon icon="mdi-pencil-outline" />
              </AppButton>
              <AppButton
                icon
                variant="text"
                color="error"
                :title="
                  t('userManagement.groups.actions.deleteTooltip', {
                    name:
                      item.raw?.name ??
                      t('userManagement.groups.labels.groupFallback'),
                  })
                "
                @click="openDelete(item.raw)"
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
      :max-width="540"
      :close-disabled="actionLoading"
      icon="mdi-account-group-outline"
      :title="t('userManagement.groups.dialogs.create.title')"
      @close="closeCreate"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
        {{ formError }}
      </v-alert>
      <v-form @submit.prevent="submitCreate">
        <v-text-field
          v-model="form.name"
          :label="t('userManagement.groups.fields.name')"
          :disabled="actionLoading"
          required
          autocomplete="off"
        />
        <v-textarea
          v-model="form.description"
          :label="t('userManagement.groups.fields.description')"
          :disabled="actionLoading"
          auto-grow
          rows="3"
          autocomplete="off"
        />
      </v-form>

      <template #actions>
        <AppButton variant="text" :disabled="actionLoading" @click="closeCreate">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :disabled="!canSubmit"
          :loading="actionLoading"
          @click="submitCreate"
        >
          {{ t('common.actions.create') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="editDialog"
      :max-width="540"
      :close-disabled="actionLoading"
      icon="mdi-account-edit-outline"
      :title="t('userManagement.groups.dialogs.edit.title')"
      @close="closeEdit"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
        {{ formError }}
      </v-alert>
      <v-form @submit.prevent="submitEdit">
        <v-text-field
          v-model="form.name"
          :label="t('userManagement.groups.fields.name')"
          :disabled="actionLoading"
          required
          autocomplete="off"
        />
        <v-textarea
          v-model="form.description"
          :label="t('userManagement.groups.fields.description')"
          :disabled="actionLoading"
          auto-grow
          rows="3"
          autocomplete="off"
        />
      </v-form>

      <template #actions>
        <AppButton variant="text" :disabled="actionLoading" @click="closeEdit">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          color="primary"
          :disabled="!canSubmit"
          :loading="actionLoading"
          @click="submitEdit"
        >
          {{ t('common.actions.save') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal
      v-model="viewDialog"
      :max-width="560"
      :close-disabled="viewLoading"
      icon="mdi-eye-outline"
      :title="t('userManagement.groups.dialogs.view.title')"
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
      <template v-if="viewingGroup && !viewLoading">
        <div class="d-flex flex-column" style="row-gap: 12px">
          <div>
            <div class="text-caption text-medium-emphasis">
              {{ t('userManagement.groups.fields.name') }}
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ viewingGroup.name }}
            </div>
          </div>
          <div>
            <div class="text-caption text-medium-emphasis">
              {{ t('userManagement.groups.fields.id') }}
            </div>
            <div class="text-body-2 font-weight-medium">
              {{ viewingGroup.id }}
            </div>
          </div>
          <div>
            <div class="text-caption text-medium-emphasis">
              {{ t('userManagement.groups.fields.description') }}
            </div>
            <div class="text-body-2 font-weight-medium">
              {{ viewingGroup.description || '—' }}
            </div>
          </div>
          <div>
            <div
              class="d-flex align-center justify-space-between mb-2"
              style="gap: 12px"
            >
              <span class="text-caption text-medium-emphasis">
                {{ t('userManagement.groups.details.users.title') }}
              </span>
              <AppButton
                size="small"
                color="primary"
                variant="tonal"
                prepend-icon="mdi-account-plus"
                :disabled="userActionLoading"
                @click="openAttachUserDialog"
              >
                {{ t('userManagement.groups.details.users.actions.link') }}
              </AppButton>
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
            <AppList
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
                  <AppButton
                    icon="mdi-close"
                    variant="text"
                    color="error"
                    :disabled="userActionLoading"
                    @click="detachUser(user.id)"
                  />
                </template>
              </v-list-item>
            </AppList>
            <div v-else class="text-body-2 text-medium-emphasis">
              {{ t('userManagement.groups.details.users.empty') }}
            </div>
          </div>
        </div>
      </template>
      <div v-else-if="!viewLoading" class="text-body-2 text-medium-emphasis">
        {{ t('userManagement.groups.details.empty') }}
      </div>

      <template #actions>
        <AppButton variant="text" :disabled="viewLoading" @click="closeView">
          {{ t('common.actions.close') }}
        </AppButton>
      </template>
    </AppModal>

    <AppModal v-model="attachUserDialog" max-width="520">
      <AppCard>
        <v-card-title>{{
          t('userManagement.groups.dialogs.attachUser.title')
        }}</v-card-title>
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
            :label="t('common.labels.user')"
            :disabled="userActionLoading || groupUsersLoading"
            :loading="groupUsersLoading"
            density="comfortable"
            :placeholder="t('common.placeholders.selectUser')"
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <AppButton
            variant="text"
            :disabled="userActionLoading"
            @click="closeAttachUserDialog"
          >
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="primary"
            :disabled="userActionLoading || !attachUserForm.userId"
            :loading="userActionLoading"
            @click="submitAttachUser"
          >
            {{ t('common.actions.link') }}
          </AppButton>
        </v-card-actions>
      </AppCard>
    </AppModal>

    <AppModal v-model="deleteDialog" max-width="520">
      <AppCard>
        <v-card-title>{{
          t('userManagement.groups.dialogs.delete.title')
        }}</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            {{ t('userManagement.groups.dialogs.delete.warningPrefix') }}
            <strong>
              {{
                deletingGroup?.name ??
                t('userManagement.groups.labels.groupFallback')
              }}
            </strong>
            {{ t('userManagement.groups.dialogs.delete.warningSuffix') }}
          </v-alert>
          <v-alert v-if="deleteError" type="error" variant="tonal" class="mb-4">
            {{ deleteError }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <AppButton variant="text" :disabled="deleteLoading" @click="closeDelete">
            {{ t('common.actions.cancel') }}
          </AppButton>
          <AppButton
            color="error"
            :loading="deleteLoading"
            :disabled="!deletingGroup"
            @click="confirmDelete"
          >
            {{ t('common.actions.delete') }}
          </AppButton>
        </v-card-actions>
      </AppCard>
    </AppModal>
  </v-container>
</template>
