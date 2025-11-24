<template>
  <EducationPlaceholder title="Copy Course" category="Course Maintenance" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursemaintenance Copy Course',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
