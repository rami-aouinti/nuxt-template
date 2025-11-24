<template>
  <EducationPlaceholder title="Import Backup" category="Course Maintenance" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursemaintenance Import Backup',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
