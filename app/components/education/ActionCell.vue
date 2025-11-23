<template>
  <div class="d-flex align-center ga-2">
    <v-btn
      v-if="handleShow"
      color="primary"
      variant="text"
      density="comfortable"
      icon="mdi-eye"
      @click="handleShow"
    />

    <v-btn
      v-if="handleEdit"
      color="secondary"
      variant="text"
      density="comfortable"
      icon="mdi-pencil"
      @click="handleEdit"
    />

    <v-btn
      v-if="handleDelete"
      color="error"
      variant="text"
      density="comfortable"
      icon="mdi-delete"
      @click="confirmDeleteClick = true"
    />

    <ConfirmDelete
      v-if="handleDelete"
      :handle-cancel="() => (confirmDeleteClick = false)"
      :handle-delete="confirmDeletion"
      :show="confirmDeleteClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ConfirmDelete from './ConfirmDelete.vue'

type ActionHandler = (() => void) | undefined

const { handleShow, handleEdit, handleDelete } = defineProps<{
  handleShow?: ActionHandler
  handleEdit?: ActionHandler
  handleDelete?: ActionHandler
}>()

const confirmDeleteClick = ref(false)

const confirmDeletion = () => {
  handleDelete?.()
  confirmDeleteClick.value = false
}

watch(
  () => handleDelete,
  () => {
    confirmDeleteClick.value = false
  },
)
</script>
