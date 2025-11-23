<template>
  <v-dialog :model-value="show" max-width="420" persistent>
    <v-card>
      <v-card-title class="d-flex align-center ga-3">
        <v-avatar color="primary" variant="tonal" size="40">
          <v-icon icon="mdi-alert" color="white" />
        </v-avatar>
        <span class="text-subtitle-1 font-weight-medium">
          {{ $t('Are you sure you want to delete this item?') }}
        </span>
      </v-card-title>

      <v-card-actions class="justify-end">
        <v-btn variant="text" color="secondary" @click="handleCancel">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn color="error" variant="flat" @click="handleDelete">
          {{ $t('Delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  show: boolean
  handleDelete: () => void
  handleCancel?: () => void
}>()

const { show, handleDelete } = toRefs(props)

const handleCancel = () => props.handleCancel?.()
</script>
