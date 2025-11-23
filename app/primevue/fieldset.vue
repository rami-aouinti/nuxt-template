<template>
  <v-card variant="outlined" class="pa-4">
    <v-card-title v-if="legend">{{ legend }}</v-card-title>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  legend: { type: String, default: '' },
})
</script>
