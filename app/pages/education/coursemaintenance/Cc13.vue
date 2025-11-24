<template>
  <EducationPlaceholder title="Cc13" category="Course Maintenance" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursemaintenance Cc13',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
