<template>
  <v-breadcrumbs :items="items">
    <template #item="{ item }">
      <v-breadcrumbs-item :href="item.url" :disabled="item.disabled">
        {{ item.label }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  home: { type: Object, default: null },
  model: { type: Array, default: () => [] },
})
const items = computed(() =>
  props.home ? [props.home, ...props.model] : props.model,
)
</script>
