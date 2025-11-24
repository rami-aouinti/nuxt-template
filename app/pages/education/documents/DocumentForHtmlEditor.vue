<template>
  <EducationPlaceholder title="Document For Html Editor" category="Documents" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Documents Document For Html Editor',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
