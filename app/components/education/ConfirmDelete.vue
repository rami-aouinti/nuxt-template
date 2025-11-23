<template>
  <v-dialog :model-value="show" persistent max-width="460">
    <v-card>
      <v-card-item class="py-4">
        <div class="d-flex align-center gap-3">
          <v-avatar color="primary" icon="mdi-alert" size="40" variant="tonal" />
          <div>
            <div class="text-subtitle-1 font-weight-semibold mb-1">
              {{ $t('Confirm deletion') }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ $t('Are you sure you want to delete this item?') }}
            </div>
          </div>
        </div>
      </v-card-item>

      <v-card-actions class="px-4 pb-4 justify-end">
        <v-btn variant="text" color="secondary" @click="onCancel">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn color="error" variant="flat" @click="onDelete">
          {{ $t('Delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  handleDelete: () => void
  handleCancel?: () => void
}>()

const onCancel = () => {
  props.handleCancel?.()
}

const onDelete = () => {
  props.handleDelete()
}
</script>
