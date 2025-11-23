<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~~/education/views/social/SocialSearch.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Social Search',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
