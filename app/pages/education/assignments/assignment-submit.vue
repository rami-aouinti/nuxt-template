<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~~/education/views/assignments/AssignmentSubmit.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Assignment Submit',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
