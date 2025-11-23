<template>
  <slot />
</template>

<script setup>
import { inject, onBeforeUnmount } from 'vue'

const props = defineProps({
  field: { type: String, default: '' },
  header: { type: String, default: '' },
  sortable: { type: Boolean, default: false },
  selectionMode: { type: String, default: null },
  bodyClass: { type: String, default: null },
})

const slots = defineSlots()
const register = inject('primevue-register-column', null)
let unregister
if (register) {
  unregister = register({
    ...props,
    body: slots.body,
  })
}

onBeforeUnmount(() => unregister?.())
</script>
