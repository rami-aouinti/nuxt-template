<template>
  <v-skeleton-loader
    :type="type"
    :loading="true"
    v-bind="$attrs"
  />
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: "text" },
})
</script>
