<template>
  <v-toolbar density="comfortable" flat>
    <v-toolbar-title v-if="model?.length">
      {{ model[0].label }}
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      v-for="(item, idx) in model"
      :key="idx"
      variant="text"
      :href="item.url"
      @click="item.command?.($event)"
    >
      {{ item.label }}
    </v-btn>
    <slot />
  </v-toolbar>
</template>

<script setup lang="ts">
const props = defineProps({
  model: { type: Array, default: () => [] },
})
</script>
