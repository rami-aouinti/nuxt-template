<script setup lang="ts">
import { useHead } from '#imports'
import LegacyView from '~~/education/views/dropbox/DropboxListSent.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Dropbox List Sent',
})
</script>

<template>
  <VContainer fluid class="py-6">
    <VCard variant="text" color="transparent">
      <component :is="LegacyView" />
    </VCard>
  </VContainer>
</template>
