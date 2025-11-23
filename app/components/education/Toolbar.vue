<template>
  <v-toolbar color="surface" density="comfortable" class="rounded-lg mb-4 elevation-1 px-4">
    <v-toolbar-title v-if="title" class="text-subtitle-1 font-weight-medium">
      {{ title }}
    </v-toolbar-title>
    <v-spacer />

    <div class="d-flex align-center ga-2 flex-wrap">
      <v-btn
        v-if="handleBack"
        color="secondary"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        :loading="isLoading"
        @click="backAction"
      >
        {{ $t('Back') }}
      </v-btn>

      <v-btn
        v-if="handleList"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-format-list-bulleted"
        :loading="isLoading"
        @click="listItem"
      >
        {{ $t('List') }}
      </v-btn>

      <v-btn
        v-if="handleEdit"
        color="secondary"
        variant="tonal"
        icon="mdi-pencil"
        :loading="isLoading"
        @click="editItem"
      />

      <v-btn
        v-if="handleSubmit"
        color="success"
        variant="flat"
        prepend-icon="mdi-content-save"
        :loading="isLoading"
        @click="submitItem"
      >
        {{ $t('Submit') }}
      </v-btn>

      <v-btn
        v-if="handleSend"
        color="primary"
        variant="tonal"
        icon="mdi-send"
        :loading="isLoading"
        @click="sendItem"
      />

      <v-btn
        v-if="handleDelete"
        color="error"
        variant="tonal"
        icon="mdi-delete"
        :loading="isLoading"
        @click="onHandleDelete"
      />

      <v-btn
        v-if="handleAdd"
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        :loading="isLoading"
        @click="addItem"
      >
        {{ $t('Add') }}
      </v-btn>

      <v-btn
        v-if="handleAddDocument"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-file-plus"
        :loading="isLoading"
        @click="addDocument"
      >
        {{ $t('Create a new document') }}
      </v-btn>

      <v-btn
        v-if="handleUploadDocument"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-cloud-upload"
        :loading="isLoading"
        @click="uploadDocument"
      >
        {{ $t('File upload') }}
      </v-btn>
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    filters?: Record<string, unknown>
    handleFilter?: () => void
    handleList?: () => void
    handleEdit?: () => void
    handleBack?: () => void
    handleSubmit?: () => void
    handleReset?: () => void
    handleDelete?: () => void
    handleAdd?: () => void
    handleSend?: () => void
    handleAddDocument?: () => void
    onSendFilter?: () => void
    resetFilter?: () => void
    handleUploadDocument?: () => void
    title?: string
    isLoading?: boolean
  }>(),
  { isLoading: false },
)

const backAction = () => props.handleBack?.()
const listItem = () => props.handleList?.()
const addItem = () => props.handleAdd?.()
const addDocument = () => props.handleAddDocument?.()
const uploadDocument = () => props.handleUploadDocument?.()
const editItem = () => props.handleEdit?.()
const sendItem = () => props.handleSend?.()
const submitItem = () => props.handleSubmit?.()

const onHandleDelete = () => {
  if (!props.handleDelete) return

  props.handleDelete()
}
</script>
