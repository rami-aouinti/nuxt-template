<template>
  <EducationPlaceholder title="Create Backup" category="Course Maintenance" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursemaintenance Create Backup',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
