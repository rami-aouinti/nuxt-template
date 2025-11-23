<template>
  <div class="d-flex align-center gap-2">
    <v-tooltip v-if="handleShow" text="{{ $t('Show') }}">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          color="secondary"
          density="comfortable"
          icon="mdi-eye"
          size="small"
          variant="tonal"
          @click="handleShow"
        />
      </template>
    </v-tooltip>

    <v-tooltip v-if="handleEdit" text="{{ $t('Edit') }}">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          color="primary"
          density="comfortable"
          icon="mdi-pencil"
          size="small"
          variant="tonal"
          @click="handleEdit"
        />
      </template>
    </v-tooltip>

    <v-tooltip v-if="handleDelete" text="{{ $t('Delete') }}">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          color="error"
          density="comfortable"
          icon="mdi-delete"
          size="small"
          variant="tonal"
          @click="confirmDeleteClick = true"
        />
      </template>
    </v-tooltip>

    <ConfirmDelete
      v-if="handleDelete"
      :handle-cancel="closeDialog"
      :handle-delete="onDelete"
      :show="confirmDeleteClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ConfirmDelete from './ConfirmDelete.vue'

const props = defineProps<{
  handleShow?: () => void
  handleEdit?: () => void
  handleDelete?: () => void
}>()

const confirmDeleteClick = ref(false)

const closeDialog = () => {
  confirmDeleteClick.value = false
}

const onDelete = () => {
  props.handleDelete?.()
  closeDialog()
}

const { handleShow, handleEdit } = props
</script>
