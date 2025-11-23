<template>
  <v-dialog
    :model-value="show"
    class="education-confirm-dialog"
    max-width="480"
    persistent
    @update:model-value="handleCancel"
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center gap-3 py-5">
        <v-avatar color="error" size="44" variant="tonal">
          <v-icon icon="mdi-alert-circle-outline" />
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-semibold">
            {{ $t('Are you sure you want to delete this item?') }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ $t('This action cannot be undone and will remove the record permanently.') }}
          </div>
        </div>
      </v-card-title>

      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn
          color="secondary"
          variant="tonal"
          @click="handleCancel"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn color="error" variant="elevated" @click="handleDelete">
          {{ $t('Delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    handleDelete: () => void
    handleCancel?: () => void
  }>(),
  {
    handleCancel: () => {},
  },
)
</script>
