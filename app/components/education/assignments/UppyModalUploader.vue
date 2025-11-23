<template>
  <Dialog
    v-model:visible="isVisible"
    :modal="true"
    :style="{ width: '600px' }"
    header="Upload Correction"
    @hide="onDialogHide"
  >
    <Dashboard
      v-if="uppy"
      :uppy="uppy"
      :height="300"
      :show-progress-details="true"
      :hide-upload-button="false"
      :hide-pause-resume-button="false"
      :hide-cancel-button="false"
      note="Only one file allowed"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { Dashboard } from '@uppy/vue'
import Uppy from '@uppy/core'
import Dialog from 'primevue/dialog'
import { useNotification } from '~/composables/notification.js'
import { ENTRYPOINT } from '~/config/entrypoint.js'
import axios from 'axios'
import '@uppy/core/css/style.css'
import '@uppy/dashboard/css/style.css'

const props = defineProps({
  parentResourceNodeId: {
    type: Number,
    required: true,
  },
  submissionId: {
    type: Number,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'uploaded'])

const isVisible = ref(false)
const uppy = ref(null)
const { showErrorNotification, showSuccessNotification } = useNotification()

watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal
    if (newVal) {
      setupUppy()
    } else {
      destroyUppy()
    }
  },
)

function setupUppy() {
  destroyUppy()

  uppy.value = new Uppy({
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
  })

  uppy.value.on('file-added', async (file) => {
    try {
      const formData = new FormData()
      formData.append('uploadFile', file.data)

      const uploadUrl = `${ENTRYPOINT}c_student_publication_corrections/upload?parentResourceNodeId=${props.parentResourceNodeId}&submissionId=${props.submissionId}&filetype=file`

      await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })

      showSuccessNotification('Correction uploaded successfully!')
      emit('uploaded', file)
      closeUploader()
    } catch (error) {
      console.error(error)
      showErrorNotification(error)
    }
  })
}

function destroyUppy() {
  if (uppy.value) {
    uppy.value.cancelAll()
    if (typeof uppy.value.close === 'function') {
      uppy.value.close()
    }
    uppy.value = null
  }
}

function closeUploader() {
  destroyUppy()
  emit('close')
}

function onDialogHide() {
  closeUploader()
}

onBeforeUnmount(() => {
  destroyUppy()
})
</script>
