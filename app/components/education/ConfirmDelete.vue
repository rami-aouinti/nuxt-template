<template>
  <v-dialog :model-value="show" persistent>
    <v-card>
      <v-card-section class="row items-center">
        <v-avatar color="primary" icon="warning" text-color="white" />
        <span class="v-ml-sm">{{
          $t('Are you sure you want to delete this item?')
        }}</span>
      </v-card-section>

      <v-card-actions>
        <v-btn
          v-close-popup
          color="primary"
          flat
          label="Cancel"
          @click="handleCancel"
        />
        <v-btn
          v-close-popup
          color="primary"
          flat
          label="Delete"
          @click="handleDelete"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
export default {
  name: 'ConfirmDelete',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    handleDelete: {
      type: Function,
      required: true,
    },
    handleCancel: {
      type: Function,
      required: false,
    },
  },
}
</script>
