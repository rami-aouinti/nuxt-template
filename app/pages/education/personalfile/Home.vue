<template>
  <EducationPlaceholder title="Home" category="Personal Files" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Personalfile Home',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
