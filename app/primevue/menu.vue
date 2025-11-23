<template>
  <v-menu
    v-model="open"
    offset="6"
  >
    <template #activator="{ props: activatorProps }">
      <span v-bind="activatorProps">
        <slot name="activator">
          <v-btn icon="mdi-dots-vertical" variant="text" />
        </slot>
      </span>
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="(item, idx) in model"
        :key="idx"
        :href="item.url"
        @click="item.command?.($event)"
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
      <slot />
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  model: { type: Array, default: () => [] },
})
const open = ref(false)
</script>
