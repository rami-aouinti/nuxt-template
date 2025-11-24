<template>
  <EducationPlaceholder title="Upload" category="Personal Files" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Personalfile Upload',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
