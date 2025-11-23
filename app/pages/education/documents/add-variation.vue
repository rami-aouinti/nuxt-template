<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~/education/views/documents/AddVariation.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Add Variation',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
