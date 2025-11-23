<template>
  <v-toolbar density="comfortable" color="transparent" class="px-0">
    <v-spacer />
    <div class="d-flex flex-wrap gap-2">
      <v-btn
        v-if="handleBack"
        variant="tonal"
        color="secondary"
        prepend-icon="mdi-arrow-left"
        @click="handleBack()"
      >
        {{ $t('Back') }}
      </v-btn>

      <v-btn
        v-if="handleList"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-format-list-bulleted"
        :loading="isLoading"
        @click="handleList()"
      >
        {{ $t('List') }}
      </v-btn>

      <v-btn
        v-if="handleEdit"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-pencil"
        :loading="isLoading"
        @click="handleEdit()"
      >
        {{ $t('Edit') }}
      </v-btn>

      <v-btn
        v-if="handleSubmit"
        color="success"
        variant="flat"
        prepend-icon="mdi-content-save"
        :loading="isLoading"
        @click="handleSubmit()"
      >
        {{ $t('Submit') }}
      </v-btn>

      <v-btn
        v-if="handleSend"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-send"
        :loading="isLoading"
        @click="handleSend()"
      >
        {{ $t('Send') }}
      </v-btn>

      <v-btn
        v-if="handleDelete"
        variant="outlined"
        color="error"
        prepend-icon="mdi-delete"
        :loading="isLoading"
        @click="handleDelete()"
      >
        {{ $t('Delete') }}
      </v-btn>

      <v-btn
        v-if="handleAdd"
        variant="flat"
        color="primary"
        prepend-icon="mdi-plus-box"
        @click="handleAdd()"
      >
        {{ $t('Add') }}
      </v-btn>

      <v-btn
        v-if="handleAddDocument"
        variant="flat"
        color="primary"
        prepend-icon="mdi-file-plus"
        @click="handleAddDocument()"
      >
        {{ $t('Create a new document') }}
      </v-btn>

      <v-btn
        v-if="handleUploadDocument"
        variant="flat"
        color="primary"
        prepend-icon="mdi-cloud-upload"
        @click="handleUploadDocument()"
      >
        {{ $t('File upload') }}
      </v-btn>
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
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
  {
    isLoading: false,
  },
)
</script>
