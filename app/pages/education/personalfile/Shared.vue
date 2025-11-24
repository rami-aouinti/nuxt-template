<template>
  <EducationPlaceholder title="Shared" category="Personal Files" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Personalfile Shared',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
