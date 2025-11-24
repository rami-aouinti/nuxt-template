<template>
  <EducationPlaceholder title="Update" category="Course" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Course Update',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
