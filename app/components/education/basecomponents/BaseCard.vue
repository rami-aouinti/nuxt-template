<template>
  <Card :class="customClass">
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { computed, useSlots } from 'vue'

const props = defineProps({
  plain: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const customClass = computed(() => {
  let resultClass = ''
  if (props.plain) {
    resultClass += 'bg-gray-15 border border-gray-25 shadow-none '
  }
  return resultClass
})
</script>
