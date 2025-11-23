<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~/education/views/assignments/AssignmentsCreate.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Assignments Create',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
