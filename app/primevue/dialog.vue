<template>
  <v-dialog v-model="visible" :persistent="modal" max-width="maxWidth">
    <v-card>
      <v-card-title v-if="header">{{ header }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions v-if="$slots.footer">
        <slot name="footer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  modal: { type: Boolean, default: false },
  header: { type: String, default: '' },
  maximized: { type: Boolean, default: false },
  blockScroll: { type: Boolean, default: false },
  closable: { type: Boolean, default: true },
  dismissableMask: { type: Boolean, default: true },
  position: { type: String, default: 'center' },
  breakpoints: { type: Object, default: () => ({}) },
  style: { type: Object, default: () => ({}) },
  contentStyle: { type: Object, default: () => ({}) },
  maxWidth: { type: [Number, String], default: 600 },
})
const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})
</script>
