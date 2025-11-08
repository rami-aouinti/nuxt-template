import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { WorkspaceFolder } from '~/types/workspace'

export const useWorkspaceStore = defineStore('workspace', () => {
  const folders = ref<WorkspaceFolder[]>([])
  const isLoading = ref(true)
  const loadError = ref('')
  const selectedFolderId = ref<string | null>(null)
  const isReloading = ref(false)

  const setFolders = (items: WorkspaceFolder[]) => {
    folders.value = items
  }

  const selectFolder = (id: string | null) => {
    selectedFolderId.value = id
  }

  const reset = () => {
    folders.value = []
    selectedFolderId.value = null
    isLoading.value = true
    isReloading.value = false
    loadError.value = ''
  }

  return {
    folders,
    isLoading,
    loadError,
    selectedFolderId,
    isReloading,
    setFolders,
    selectFolder,
    reset,
  }
})
