<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~/education/views/accessurl/AccessUrlAuthSourcesAssign.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Access Url Auth Sources Assign',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
