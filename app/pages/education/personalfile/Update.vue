<template>
  <EducationPlaceholder title="Update" category="Personal Files" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Personalfile Update',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
