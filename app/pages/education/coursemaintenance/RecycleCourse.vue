<template>
  <EducationPlaceholder title="Recycle Course" category="Course Maintenance" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursemaintenance Recycle Course',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
