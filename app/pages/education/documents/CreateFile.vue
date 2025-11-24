<template>
  <EducationPlaceholder title="Create File" category="Documents" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Documents Create File',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
