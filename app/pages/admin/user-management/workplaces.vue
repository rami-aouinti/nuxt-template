<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { DataTableHeader } from 'vuetify'
import { useAdminStore } from '~/stores/admin'
import { Notify } from '~/stores/notification'
import type { Workplace, WorkplacePayload } from '~/types/workplace'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'navigation.workplaces',
  icon: 'mdi-office-building',
  drawerIndex: 3,
  roles: ['ROLE_ADMIN', 'ROLE_ROOT'],
})

const { t } = useI18n()
const adminStore = useAdminStore()
const { workplaces, workplacesPending, workplacesError } =
  storeToRefs(adminStore)

await adminStore.fetchWorkplaces()

const search = ref('')

const headers = computed<DataTableHeader[]>(() => [
  { title: t('userManagement.workplaces.table.name'), key: 'name' },
  { title: t('userManagement.workplaces.table.slug'), key: 'slug' },
  { title: t('userManagement.workplaces.table.id'), key: 'id' },
  {
    title: t('userManagement.workplaces.table.actions'),
    key: 'actions',
    sortable: false,
    align: 'end',
    width: 150,
  },
])

const pending = computed(() => workplacesPending.value)
const tableError = computed(() =>
  workplacesError.value
    ? extractRequestError(workplacesError.value, t('common.unexpectedError'))
    : '',
)
const refresh = () => adminStore.refreshWorkplaces()

const items = computed(() => workplaces.value ?? [])

const form = reactive<WorkplacePayload>({ name: '' })
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
const viewingWorkplace = ref<Workplace | null>(null)
const editingWorkplace = ref<Workplace | null>(null)
const deletingWorkplace = ref<Workplace | null>(null)

function resetForm() {
  form.name = ''
}

function populateForm(workplace: Workplace) {
  form.name = workplace.name ?? ''
}

function ensureFormValid() {
  formError.value = ''
  if (!form.name.trim()) {
    formError.value = t('userManagement.workplaces.errors.nameRequired')
    return false
  }
  return true
}

function buildPayload(): WorkplacePayload {
  return {
    name: form.name.trim(),
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

function getWorkplaceLabel(workplace: Workplace | null | undefined) {
  return (
    workplace?.name ?? t('userManagement.workplaces.labels.workplaceFallback')
  )
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
    await $fetch('/api/v1/workplace', {
      method: 'POST',
      body: buildPayload(),
    })
    Notify.success(t('userManagement.workplaces.notifications.createSuccess'))
    createDialog.value = false
    resetForm()
    await Promise.all([refresh(), adminStore.refreshWorkplaceCount()])
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.workplaces.errors.createFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openEdit(workplace: Workplace) {
  editingWorkplace.value = workplace
  populateForm(workplace)
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
  if (!editingWorkplace.value) {
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
    await $fetch(`/api/v1/workplace/${editingWorkplace.value.id}`, {
      method: 'PUT',
      body: buildPayload(),
    })
    Notify.success(t('userManagement.workplaces.notifications.updateSuccess'))
    editDialog.value = false
    await Promise.all([refresh(), adminStore.refreshWorkplaceCount()])
  } catch (error) {
    formError.value = extractRequestError(
      error,
      t('userManagement.workplaces.errors.updateFailed'),
    )
    Notify.error(formError.value)
  } finally {
    actionLoading.value = false
  }
}

function openView(workplace: Workplace) {
  viewingWorkplace.value = { ...workplace }
  viewDialog.value = true
  viewError.value = ''
  loadWorkplaceDetails(workplace.id)
}

async function loadWorkplaceDetails(id: string) {
  viewLoading.value = true
  try {
    viewingWorkplace.value = await $fetch<Workplace>(`/api/v1/workplace/${id}`)
  } catch (error) {
    viewError.value = extractRequestError(
      error,
      t('userManagement.workplaces.errors.loadDetails'),
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

function openDelete(workplace: Workplace) {
  deletingWorkplace.value = workplace
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
  if (!deletingWorkplace.value) {
    return
  }

  deleteLoading.value = true
  deleteError.value = ''
  try {
    await $fetch(`/api/v1/workplace/${deletingWorkplace.value.id}`, {
      method: 'DELETE',
    })
    Notify.success(t('userManagement.workplaces.notifications.deleteSuccess'))
    deleteDialog.value = false
    await Promise.all([refresh(), adminStore.refreshWorkplaceCount()])
  } catch (error) {
    deleteError.value = extractRequestError(
      error,
      t('userManagement.workplaces.errors.deleteFailed'),
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
    editingWorkplace.value = null
    resetForm()
  }
})

watch(viewDialog, (value) => {
  if (!value) {
    viewLoading.value = false
    viewError.value = ''
    viewingWorkplace.value = null
  }
})

watch(deleteDialog, (value) => {
  if (!value) {
    deleteLoading.value = false
    deleteError.value = ''
    deletingWorkplace.value = null
  }
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <AdminDataTable
              v-model:search="search"
              :headers="headers"
              :items="items"
              :loading="pending"
              :error="tableError"
              :title="t('userManagement.workplaces.cardTitle')"
              :subtitle="t('userManagement.workplaces.cardTitle')"
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
                  {{ t('userManagement.workplaces.actions.new') }}
                </v-btn>
              </template>
              <template #item.name="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.slug="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.id="{ value }">
                {{ value || '—' }}
              </template>
              <template #item.actions="{ item }">
                <div class="d-flex align-center justify-end" style="gap: 4px">
                  <v-btn
                    icon
                    variant="text"
                    color="primary"
                    :title="
                      t('userManagement.workplaces.actions.viewTooltip', {
                        name: getWorkplaceLabel(item.raw),
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
                      t('userManagement.workplaces.actions.editTooltip', {
                        name: getWorkplaceLabel(item.raw),
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
                      t('userManagement.workplaces.actions.deleteTooltip', {
                        name: getWorkplaceLabel(item),
                      })
                    "
                    @click="openDelete(item)"
                  >
                    <v-icon icon="mdi-delete-outline" />
                  </v-btn>
                </div>
              </template>
            </AdminDataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AppModal
      v-model="createDialog"
      :max-width="540"
      :close-disabled="actionLoading"
      icon="mdi-office-building-plus-outline"
      :title="t('userManagement.workplaces.dialogs.create.title')"
      @close="closeCreate"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
        {{ formError }}
      </v-alert>
      <v-form @submit.prevent="submitCreate">
        <v-text-field
          v-model="form.name"
          :label="t('userManagement.workplaces.fields.name')"
          :disabled="actionLoading"
          required
          autocomplete="off"
        />
      </v-form>

      <template #actions>
        <v-btn variant="text" :disabled="actionLoading" @click="closeCreate">
          {{ t('common.actions.cancel') }}
        </v-btn>
        <v-btn color="primary" :loading="actionLoading" @click="submitCreate">
          {{ t('common.actions.create') }}
        </v-btn>
      </template>
    </AppModal>

    <AppModal
      v-model="editDialog"
      :max-width="540"
      :close-disabled="actionLoading"
      icon="mdi-pencil-ruler"
      :title="t('userManagement.workplaces.dialogs.edit.title')"
      @close="closeEdit"
    >
      <v-alert v-if="formError" type="error" variant="tonal" class="mb-4">
        {{ formError }}
      </v-alert>
      <v-form @submit.prevent="submitEdit">
        <v-text-field
          v-model="form.name"
          :label="t('userManagement.workplaces.fields.name')"
          :disabled="actionLoading"
          required
          autocomplete="off"
        />
      </v-form>

      <template #actions>
        <v-btn variant="text" :disabled="actionLoading" @click="closeEdit">
          {{ t('common.actions.cancel') }}
        </v-btn>
        <v-btn color="primary" :loading="actionLoading" @click="submitEdit">
          {{ t('common.actions.save') }}
        </v-btn>
      </template>
    </AppModal>

    <AppModal
      v-model="viewDialog"
      :max-width="540"
      icon="mdi-eye-outline"
      :title="t('userManagement.workplaces.dialogs.view.title')"
      @close="closeView"
    >
      <v-alert v-if="viewError" type="error" variant="tonal" class="mb-4">
        {{ viewError }}
      </v-alert>
      <v-skeleton-loader
        v-else-if="viewLoading"
        type="list-item-two-line, list-item-two-line, list-item-two-line"
        class="mb-2"
      />
      <v-list v-else-if="viewingWorkplace" density="compact">
        <v-list-item
          :title="t('userManagement.workplaces.fields.name')"
          :subtitle="viewingWorkplace.name || '—'"
        />
        <v-list-item
          :title="t('userManagement.workplaces.fields.slug')"
          :subtitle="viewingWorkplace.slug || '—'"
        />
        <v-list-item
          :title="t('userManagement.workplaces.fields.id')"
          :subtitle="viewingWorkplace.id || '—'"
        />
      </v-list>
      <div v-else class="text-medium-emphasis">
        {{ t('userManagement.workplaces.details.empty') }}
      </div>

      <template #actions>
        <v-btn variant="text" @click="closeView">
          {{ t('common.actions.close') }}
        </v-btn>
      </template>
    </AppModal>

    <v-dialog v-model="deleteDialog" max-width="540">
      <v-card>
        <v-card-title>{{
          t('userManagement.workplaces.dialogs.delete.title')
        }}</v-card-title>
        <v-card-text>
          <v-alert v-if="deleteError" type="error" variant="tonal" class="mb-4">
            {{ deleteError }}
          </v-alert>
          <p class="mb-0">
            {{ t('userManagement.workplaces.dialogs.delete.warningPrefix') }}
            {{ getWorkplaceLabel(deletingWorkplace.value) }}
            {{ t('userManagement.workplaces.dialogs.delete.warningSuffix') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" :disabled="deleteLoading" @click="closeDelete">
            {{ t('common.actions.cancel') }}
          </v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="confirmDelete">
            {{ t('common.actions.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
