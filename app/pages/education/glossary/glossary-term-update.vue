<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~~/education/views/glossary/GlossaryTermUpdate.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Glossary Term Update',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
