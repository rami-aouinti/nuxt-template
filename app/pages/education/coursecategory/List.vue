<template>
  <EducationPlaceholder title="List" category="Course Category" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursecategory List',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
