<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    showUrl?: string | null
    editUrl?: string | null
    deleteUrl?: string | null
  }>(),
  {
    showUrl: null,
    editUrl: null,
    deleteUrl: null,
  },
)

const { t } = useI18n()

const normalizedLinks = computed(() => ({
  show: normalizeUrl(props.showUrl),
  edit: normalizeUrl(props.editUrl),
  delete: normalizeUrl(props.deleteUrl),
}))

function normalizeUrl(url?: string | null) {
  if (typeof url !== 'string') {
    return null
  }

  const trimmed = url.trim()
  return trimmed.length > 0 ? trimmed : null
}

const tooltipLocation = 'bottom' as const

const buttonProps = {
  variant: 'text',
  size: 'small',
  target: '_blank',
  rel: 'noopener',
}
</script>

<template>
  <div class="admin-ecommerce-actions">
    <v-tooltip
      v-if="normalizedLinks.show"
      :text="t('common.actions.view')"
      :location="tooltipLocation"
    >
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="{ ...buttonProps, ...tooltipProps }"
          :href="normalizedLinks.show"
          icon="mdi-eye-outline"
          color="primary"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      v-if="normalizedLinks.edit"
      :text="t('common.actions.edit')"
      :location="tooltipLocation"
    >
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="{ ...buttonProps, ...tooltipProps }"
          :href="normalizedLinks.edit"
          icon="mdi-pencil-outline"
          color="warning"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      v-if="normalizedLinks.delete"
      :text="t('common.actions.delete')"
      :location="tooltipLocation"
    >
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="{ ...buttonProps, ...tooltipProps }"
          :href="normalizedLinks.delete"
          icon="mdi-delete-outline"
          color="error"
        />
      </template>
    </v-tooltip>
  </div>
</template>

<style scoped>
.admin-ecommerce-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}
</style>
