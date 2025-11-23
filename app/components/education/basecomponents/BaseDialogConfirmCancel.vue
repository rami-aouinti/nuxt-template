<template>
  <BaseDialog
    :is-visible="isVisible"
    :style="{ width: '28rem' }"
    :title="title"
    @update:is-visible="$emit('update:isVisible', $event)"
  >
    <slot />
    <template #footer>
      <BaseButton
        :label="innerCancelLabel"
        icon="close"
        type="black"
        @click="$emit('cancelClicked')"
      />
      <BaseButton
        :icon="confirmIcon"
        :label="innerConfirmLabel"
        :type="confirmType"
        @click="$emit('confirmClicked')"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import BaseButton from './BaseButton.vue'
import { computed } from 'vue'

import { buttonTypeValidator, iconValidator } from './validators.js'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
  confirmLabel: {
    type: String,
    default: '',
  },
  confirmIcon: {
    type: String,
    default: 'confirm',
    validator: iconValidator,
  },
  confirmType: {
    type: String,
    default: 'secondary',
    validator: buttonTypeValidator,
  },
  cancelLabel: {
    type: String,
    default: '',
  },
})

defineEmits(['update:isVisible', 'confirmClicked', 'cancelClicked'])

const innerConfirmLabel = computed(() => {
  return props.confirmLabel === '' ? t('Yes') : props.confirmLabel
})

const innerCancelLabel = computed(() => {
  return props.cancelLabel === '' ? t('No') : props.cancelLabel
})
</script>
