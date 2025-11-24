<template>
  <EducationPlaceholder title="Update File" category="Documents" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Documents Update File',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
