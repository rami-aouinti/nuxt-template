<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { FetchError } from 'ofetch'
import { Notify } from '~/stores/notification'
import type {
  CreateWorkspaceFolderPayload,
  UpdateWorkspaceFolderPayload,
  WorkspaceFile,
  WorkspaceFolder,
} from '~/types/workspace'

const WORKSPACE_BASE_URL = 'https://bro-world.org'

definePageMeta({
  title: 'navigation.workspace',
  middleware: 'auth',
  icon: 'mdi-folder-account',
  drawerIndex: 4,
})

const { t } = useI18n()

const folders = ref<WorkspaceFolder[]>([])
const isLoading = ref(true)
const loadError = ref('')
const selectedIds = ref<string[]>([])
const selectedFolderId = ref<string | null>(null)
const isReloading = ref(false)

const createDialog = ref(false)
const createError = ref('')
const isCreating = ref(false)
const createForm = reactive({
  name: '',
  parentId: null as string | null,
  isPrivate: false,
  isFavorite: false,
})

const editDialog = ref(false)
const editError = ref('')
const isEditing = ref(false)
const editForm = reactive({
  name: '',
  isPrivate: false,
  isFavorite: false,
})

const deleteDialog = ref(false)
const isDeleting = ref(false)

const uploadDialog = ref(false)
const uploadError = ref('')
const isUploading = ref(false)
const uploadForm = reactive({
  files: null as File[] | File | null,
  isPrivate: false,
})

const deleteFileDialog = ref(false)
const fileToDelete = ref<WorkspaceFile | null>(null)
const isDeletingFile = ref(false)

function resolveErrorMessage(error: unknown, fallback: string) {
  if (error instanceof FetchError) {
    const data = error.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && typeof error.message === 'string') {
    return error.message
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  return fallback
}

interface FolderIndexEntry {
  folder: WorkspaceFolder
  parentId: string | null
}

const folderIndex = computed(() => {
  const map = new Map<string, FolderIndexEntry>()

  function traverse(nodes: WorkspaceFolder[], parentId: string | null) {
    for (const node of nodes) {
      map.set(node.id, { folder: node, parentId })
      if (Array.isArray(node.children) && node.children.length > 0) {
        traverse(node.children, node.id)
      }
    }
  }

  traverse(folders.value, null)

  return map
})

const folderOptions = computed(() =>
  Array.from(folderIndex.value.values()).map(({ folder }) => ({
    title: folder.name,
    value: folder.id,
  })),
)

const selectedFolder = computed(() => {
  if (!selectedFolderId.value) {
    return null
  }
  return folderIndex.value.get(selectedFolderId.value)?.folder ?? null
})

const selectedFolderParentId = computed(() => {
  if (!selectedFolderId.value) {
    return null
  }
  return folderIndex.value.get(selectedFolderId.value)?.parentId ?? null
})

const selectedFolderChildrenCount = computed(
  () => selectedFolder.value?.children?.length ?? 0,
)

const selectedFolderFiles = computed(() => selectedFolder.value?.files ?? [])

const selectedFolderItemsLabel = computed(() => {
  const count = selectedFolderChildrenCount.value

  if (count === 0) {
    return t('workspace.details.items.none')
  }

  if (count === 1) {
    return t('workspace.details.items.one')
  }

  return t('workspace.details.items.other', { count })
})

const selectedFolderFilesLabel = computed(() => {
  const count = selectedFolderFiles.value.length

  if (count === 0) {
    return t('workspace.details.files.none')
  }

  if (count === 1) {
    return t('workspace.details.files.one')
  }

  return t('workspace.details.files.other', { count })
})

const folderTreeItems = computed(() => {
  function toTreeItem(node: WorkspaceFolder) {
    return {
      id: node.id,
      value: node.id,
      title: node.name,
      children: Array.isArray(node.children)
        ? node.children.map(toTreeItem)
        : [],
    }
  }

  return folders.value.map(toTreeItem)
})

function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) {
    return t('workspace.files.sizeUnknown')
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  let value = size

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

function resolveFileUrl(file: WorkspaceFile) {
  try {
    return new URL(file.url, WORKSPACE_BASE_URL).toString()
  } catch {
    return file.url
  }
}

async function loadFolders(options: { selectId?: string | null } = {}) {
  const targetSelection =
    options.selectId !== undefined ? options.selectId : selectedFolderId.value
  isLoading.value = folders.value.length === 0
  isReloading.value = folders.value.length > 0
  loadError.value = ''

  try {
    const result = await $fetch<WorkspaceFolder[]>('/api/v1/folder')
    folders.value = Array.isArray(result) ? result : []

    if (folders.value.length === 0) {
      selectedFolderId.value = null
      return
    }

    if (targetSelection && folderIndex.value.has(targetSelection)) {
      selectedFolderId.value = targetSelection
      return
    }

    const firstFolder = folders.value[0]
    selectedFolderId.value = firstFolder ? firstFolder.id : null
  } catch (error) {
    loadError.value = resolveErrorMessage(
      error,
      t('workspace.errors.loadFolders'),
    )
  } finally {
    isLoading.value = false
    isReloading.value = false
  }
}

function openCreateDialog(parentId?: string | null) {
  createForm.name = ''
  createForm.isPrivate = false
  createForm.isFavorite = false
  createForm.parentId = parentId ?? selectedFolderId.value ?? null
  createError.value = ''
  createDialog.value = true
}

async function submitCreateFolder() {
  const trimmedName = createForm.name.trim()
  if (!trimmedName) {
    createError.value = t('workspace.validation.nameRequired')
    return
  }

  const payload: CreateWorkspaceFolderPayload = {
    name: trimmedName,
  }

  if (createForm.parentId) {
    payload.parentId = createForm.parentId
  }

  payload.isPrivate = createForm.isPrivate
  payload.isFavorite = createForm.isFavorite

  isCreating.value = true
  createError.value = ''

  try {
    const folder = await $fetch<WorkspaceFolder>('/api/v1/folder', {
      method: 'POST',
      body: payload,
    })

    Notify.success(t('workspace.notifications.folderCreated'))
    createDialog.value = false
    await loadFolders({ selectId: folder.id })
  } catch (error) {
    const message = resolveErrorMessage(
      error,
      t('workspace.errors.createFolder'),
    )
    createError.value = message
    Notify.error(message)
  } finally {
    isCreating.value = false
  }
}

function openEditDialog() {
  if (!selectedFolder.value) {
    return
  }

  editForm.name = selectedFolder.value.name
  editForm.isPrivate = Boolean(selectedFolder.value.isPrivate)
  editForm.isFavorite = Boolean(selectedFolder.value.isFavorite)
  editError.value = ''
  editDialog.value = true
}

async function submitEditFolder() {
  if (!selectedFolder.value) {
    return
  }

  const trimmedName = editForm.name.trim()
  if (!trimmedName) {
    editError.value = t('workspace.validation.nameRequired')
    return
  }

  const payload: UpdateWorkspaceFolderPayload = {
    name: trimmedName,
    isPrivate: editForm.isPrivate,
    isFavorite: editForm.isFavorite,
  }

  isEditing.value = true
  editError.value = ''

  try {
    await $fetch(`/api/v1/folder/${selectedFolder.value.id}`, {
      method: 'PUT',
      body: payload,
    })

    Notify.success(t('workspace.notifications.folderUpdated'))
    editDialog.value = false
    await loadFolders({ selectId: selectedFolder.value.id })
  } catch (error) {
    const message = resolveErrorMessage(
      error,
      t('workspace.errors.updateFolder'),
    )
    editError.value = message
    Notify.error(message)
  } finally {
    isEditing.value = false
  }
}

function openDeleteDialog() {
  if (!selectedFolder.value) {
    return
  }

  deleteDialog.value = true
}

async function confirmDeleteFolder() {
  if (!selectedFolder.value) {
    return
  }

  isDeleting.value = true

  try {
    await $fetch(`/api/v1/folder/${selectedFolder.value.id}`, {
      method: 'DELETE',
    })

    Notify.success(t('workspace.notifications.folderDeleted'))
    deleteDialog.value = false
    await loadFolders({ selectId: selectedFolderParentId.value })
  } catch (error) {
    const message = resolveErrorMessage(
      error,
      t('workspace.errors.deleteFolder'),
    )
    Notify.error(message)
  } finally {
    isDeleting.value = false
  }
}

function openUploadDialog() {
  uploadForm.files = null
  uploadForm.isPrivate = false
  uploadError.value = ''
  uploadDialog.value = true
}

function extractFirstFile(files: File[] | File | null) {
  if (!files) {
    return null
  }
  return Array.isArray(files) ? files[0] ?? null : files
}

async function submitUpload() {
  if (!selectedFolder.value) {
    uploadError.value = t('workspace.errors.noFolderSelected')
    return
  }

  const file = extractFirstFile(uploadForm.files)
  if (!file) {
    uploadError.value = t('workspace.validation.fileRequired')
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('isPrivate', String(uploadForm.isPrivate))

  isUploading.value = true
  uploadError.value = ''

  try {
    await $fetch(`/api/v1/folder/${selectedFolder.value.id}/files`, {
      method: 'POST',
      body: formData,
    })

    Notify.success(t('workspace.notifications.fileUploaded'))
    uploadDialog.value = false
    await loadFolders({ selectId: selectedFolder.value.id })
  } catch (error) {
    const message = resolveErrorMessage(
      error,
      t('workspace.errors.uploadFile'),
    )
    uploadError.value = message
    Notify.error(message)
  } finally {
    isUploading.value = false
  }
}

function openDeleteFileDialog(file: WorkspaceFile) {
  fileToDelete.value = file
  isDeletingFile.value = false
  deleteFileDialog.value = true
}

async function confirmDeleteFile() {
  if (!selectedFolder.value || !fileToDelete.value) {
    return
  }

  isDeletingFile.value = true

  try {
    await $fetch(
      `/api/v1/folder/${selectedFolder.value.id}/files/${fileToDelete.value.id}`,
      {
        method: 'DELETE',
      },
    )

    Notify.success(t('workspace.notifications.fileDeleted'))
    deleteFileDialog.value = false
    await loadFolders({ selectId: selectedFolder.value.id })
  } catch (error) {
    const message = resolveErrorMessage(
      error,
      t('workspace.errors.deleteFile'),
    )
    Notify.error(message)
  } finally {
    isDeletingFile.value = false
  }
}

watch(selectedFolderId, (value) => {
  if (value && selectedIds.value[0] !== value) {
    selectedIds.value = [value]
  }

  if (!value) {
    selectedIds.value = []
  }
})

watch(selectedIds, (value) => {
  const first = value[0]
  if (!first) {
    selectedFolderId.value = null
    return
  }

  if (selectedFolderId.value !== first) {
    selectedFolderId.value = first
  }
})

onMounted(() => {
  void loadFolders()
})
</script>

<template>
  <v-container fluid class="workspace-page">
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-card class="workspace-tree h-100">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon icon="mdi:folder-tree" class="me-2" />
            {{ t('workspace.tree.title') }}
            <v-spacer />
            <v-btn
              icon="mdi-folder-plus"
              variant="text"
              :title="t('workspace.tree.actions.createRoot')"
              @click="openCreateDialog(null)"
            />
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-alert
              v-if="loadError"
              type="error"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              {{ loadError }}
            </v-alert>
            <div v-if="isLoading" class="py-4">
              <v-skeleton-loader type="list-item" class="mb-2" />
              <v-skeleton-loader type="list-item" class="mb-2" />
              <v-skeleton-loader type="list-item" />
            </div>
            <div v-else-if="folders.length === 0" class="text-medium-emphasis">
              {{ t('workspace.tree.empty') }}
            </div>
            <div v-else>
              <v-treeview
                v-model:selected="selectedIds"
                :items="folderTreeItems"
                activatable
                item-title="title"
                item-value="value"
                open-on-click
                density="compact"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" lg="9">
        <v-card v-if="selectedFolder" class="workspace-details h-100">
          <v-toolbar flat color="transparent" class="px-4">
            <v-toolbar-title class="text-h5">
              {{ selectedFolder.name }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              color="primary"
              class="me-2"
              prepend-icon="mdi-folder-plus"
              :disabled="isReloading"
              @click="openCreateDialog(selectedFolder.id)"
            >
              {{ t('workspace.actions.newFolder') }}
            </v-btn>
            <v-btn
              variant="tonal"
              class="me-2"
              prepend-icon="mdi-cloud-upload"
              :disabled="isReloading"
              @click="openUploadDialog"
            >
              {{ t('workspace.actions.uploadFile') }}
            </v-btn>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              class="me-1"
              :title="t('workspace.actions.renameFolder')"
              :disabled="isReloading"
              @click="openEditDialog"
            />
            <v-btn
              icon="mdi-delete"
              color="error"
              variant="text"
              :title="t('workspace.actions.deleteFolder')"
              :disabled="isReloading"
              @click="openDeleteDialog"
            />
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <div class="d-flex flex-wrap align-center gap-2 mb-4">
              <v-chip
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-file-tree"
              >
                {{ selectedFolderItemsLabel }}
              </v-chip>
              <v-chip
                color="secondary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-file"
              >
                {{ selectedFolderFilesLabel }}
              </v-chip>
              <v-chip
                v-if="selectedFolder.isPrivate"
                color="error"
                variant="tonal"
                size="small"
                prepend-icon="mdi-lock"
              >
                {{ t('workspace.details.private') }}
              </v-chip>
              <v-chip
                v-if="selectedFolder.isFavorite"
                color="warning"
                variant="tonal"
                size="small"
                prepend-icon="mdi-star"
              >
                {{ t('workspace.details.favorite') }}
              </v-chip>
            </div>
            <div class="d-flex align-center mb-2">
              <h2 class="text-h6 mb-0">
                {{ t('workspace.files.title') }}
              </h2>
              <v-spacer />
              <v-btn
                variant="text"
                :disabled="isReloading"
                prepend-icon="mdi-refresh"
                @click="loadFolders({ selectId: selectedFolder.id })"
              >
                {{ t('workspace.actions.refresh') }}
              </v-btn>
            </div>
            <v-alert
              v-if="isReloading"
              type="info"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ t('workspace.messages.refreshing') }}
            </v-alert>
            <v-table density="comfortable" class="workspace-table">
              <thead>
                <tr>
                  <th>{{ t('workspace.files.headers.name') }}</th>
                  <th>{{ t('workspace.files.headers.type') }}</th>
                  <th>{{ t('workspace.files.headers.extension') }}</th>
                  <th class="text-end">
                    {{ t('workspace.files.headers.size') }}
                  </th>
                  <th class="text-end">
                    {{ t('workspace.files.headers.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="selectedFolderFiles.length === 0">
                  <td :colspan="5" class="text-center text-medium-emphasis">
                    {{ t('workspace.files.empty') }}
                  </td>
                </tr>
                <tr v-for="file in selectedFolderFiles" :key="file.id">
                  <td>
                    <div class="d-flex align-center gap-2">
                      <v-icon
                        :icon="file.isPrivate ? 'mdi-lock' : 'mdi-file'
                        "
                        size="small"
                      />
                      <span>{{ file.name }}</span>
                      <v-chip
                        v-if="file.isFavorite"
                        size="x-small"
                        color="warning"
                        variant="tonal"
                      >
                        {{ t('workspace.files.favorite') }}
                      </v-chip>
                    </div>
                  </td>
                  <td>{{ file.type }}</td>
                  <td>{{ file.extension }}</td>
                  <td class="text-end">
                    {{ formatFileSize(file.size) }}
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-end gap-2">
                      <v-btn
                        :href="resolveFileUrl(file)"
                        target="_blank"
                        variant="text"
                        size="small"
                        prepend-icon="mdi-open-in-new"
                      >
                        {{ t('workspace.files.actions.open') }}
                      </v-btn>
                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        prepend-icon="mdi-delete"
                        @click="openDeleteFileDialog(file)"
                      >
                        {{ t('workspace.files.actions.delete') }}
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
        <v-card v-else class="workspace-empty h-100 d-flex align-center justify-center">
          <v-card-text class="text-center text-medium-emphasis">
            {{ t('workspace.messages.selectFolder') }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="createDialog" max-width="480">
      <v-card>
        <v-card-title class="text-wrap">
          {{ t('workspace.dialogs.create.title') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('workspace.dialogs.create.subtitle') }}
          </p>
          <v-alert
            v-if="createError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ createError }}
          </v-alert>
          <v-form @submit.prevent="submitCreateFolder">
            <v-text-field
              v-model="createForm.name"
              :label="t('workspace.dialogs.fields.name')"
              :disabled="isCreating"
              required
            />
            <v-select
              v-model="createForm.parentId"
              :items="folderOptions"
              :label="t('workspace.dialogs.fields.parent')"
              :disabled="isCreating || folderOptions.length === 0"
              clearable
              hide-details
              class="mb-4"
            />
            <div class="d-flex flex-column gap-2 mb-4">
              <v-checkbox
                v-model="createForm.isPrivate"
                :label="t('workspace.dialogs.fields.private')"
                :disabled="isCreating"
                hide-details
              />
              <v-checkbox
                v-model="createForm.isFavorite"
                :label="t('workspace.dialogs.fields.favorite')"
                :disabled="isCreating"
                hide-details
              />
            </div>
            <div class="d-flex justify-end gap-2">
              <v-btn
                variant="text"
                :disabled="isCreating"
                @click="createDialog = false"
              >
                {{ t('workspace.dialogs.actions.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="isCreating"
              >
                {{ t('workspace.dialogs.actions.create') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="480">
      <v-card>
        <v-card-title class="text-wrap">
          {{ t('workspace.dialogs.edit.title') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-alert
            v-if="editError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ editError }}
          </v-alert>
          <v-form @submit.prevent="submitEditFolder">
            <v-text-field
              v-model="editForm.name"
              :label="t('workspace.dialogs.fields.name')"
              :disabled="isEditing"
              required
            />
            <div class="d-flex flex-column gap-2 mb-4">
              <v-checkbox
                v-model="editForm.isPrivate"
                :label="t('workspace.dialogs.fields.private')"
                :disabled="isEditing"
                hide-details
              />
              <v-checkbox
                v-model="editForm.isFavorite"
                :label="t('workspace.dialogs.fields.favorite')"
                :disabled="isEditing"
                hide-details
              />
            </div>
            <div class="d-flex justify-end gap-2">
              <v-btn
                variant="text"
                :disabled="isEditing"
                @click="editDialog = false"
              >
                {{ t('workspace.dialogs.actions.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="isEditing"
              >
                {{ t('workspace.dialogs.actions.save') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title class="text-wrap">
          {{ t('workspace.dialogs.delete.title') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis">
            {{ t('workspace.dialogs.delete.message') }}
          </p>
        </v-card-text>
        <v-card-actions class="justify-end gap-2">
          <v-btn variant="text" :disabled="isDeleting" @click="deleteDialog = false">
            {{ t('workspace.dialogs.actions.cancel') }}
          </v-btn>
          <v-btn color="error" :loading="isDeleting" @click="confirmDeleteFolder">
            {{ t('workspace.dialogs.actions.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="uploadDialog" max-width="480">
      <v-card>
        <v-card-title class="text-wrap">
          {{ t('workspace.dialogs.upload.title') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('workspace.dialogs.upload.subtitle') }}
          </p>
          <v-alert
            v-if="uploadError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ uploadError }}
          </v-alert>
          <v-form @submit.prevent="submitUpload">
            <v-file-input
              v-model="uploadForm.files"
              :label="t('workspace.dialogs.fields.file')"
              :disabled="isUploading"
              accept="*/*"
              prepend-icon="mdi-paperclip"
              show-size
            />
            <v-checkbox
              v-model="uploadForm.isPrivate"
              :label="t('workspace.dialogs.fields.private')"
              :disabled="isUploading"
              hide-details
              class="mt-2"
            />
            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn
                variant="text"
                :disabled="isUploading"
                @click="uploadDialog = false"
              >
                {{ t('workspace.dialogs.actions.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="isUploading"
              >
                {{ t('workspace.dialogs.actions.upload') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteFileDialog" max-width="420">
      <v-card>
        <v-card-title class="text-wrap">
          {{ t('workspace.dialogs.deleteFile.title') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis">
            {{ t('workspace.dialogs.deleteFile.message') }}
          </p>
          <p v-if="fileToDelete" class="text-body-2 mt-2">
            <strong>{{ fileToDelete.name }}</strong>
          </p>
        </v-card-text>
        <v-card-actions class="justify-end gap-2">
          <v-btn
            variant="text"
            :disabled="isDeletingFile"
            @click="deleteFileDialog = false"
          >
            {{ t('workspace.dialogs.actions.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            :loading="isDeletingFile"
            @click="confirmDeleteFile"
          >
            {{ t('workspace.dialogs.actions.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.workspace-page {
  min-height: calc(100vh - 160px);
}

.workspace-tree {
  position: sticky;
  top: 96px;
}

.workspace-table thead th {
  font-weight: 600;
}

.workspace-table tbody tr:hover {
  background-color: rgb(var(--v-theme-surface-variant) / 0.2);
}

.workspace-empty {
  min-height: 420px;
}
</style>
