<template>
  <AppModal
    :model-value="show"
    class="education-confirm-dialog"
    icon="mdi-alert-circle-outline"
    :max-width="520"
    persistent
    :close-disabled="true"
    @update:model-value="handleCancel"
  >
    <template #title>
      <div class="text-subtitle-1 font-weight-semibold">
        {{ $t('Are you sure you want to delete this item?') }}
      </div>
    </template>

    <template #subtitle>
      <div class="text-body-2 text-medium-emphasis">
        {{
          $t(
            'This action cannot be undone and will remove the record permanently.',
          )
        }}
      </div>
    </template>

    <template #default>
      <div class="d-flex align-center gap-3 py-2">
        <v-avatar color="error" size="44" variant="tonal">
          <v-icon icon="mdi-alert-circle-outline" />
        </v-avatar>
        <div class="text-body-2 text-medium-emphasis">
          {{ $t('Please confirm to continue.') }}
        </div>
      </div>
    </template>

    <template #actions>
      <AppButton color="secondary" variant="tonal" @click="handleCancel">
        {{ $t('Cancel') }}
      </AppButton>
      <AppButton color="error" variant="elevated" @click="handleDelete">
        {{ $t('Delete') }}
      </AppButton>
    </template>
  </AppModal>
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
