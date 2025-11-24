<template>
  <EducationPlaceholder title="Update" category="Course Category" />
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Coursecategory Update',
  middleware: 'auth',
  appCardLayout: false,
})

import EducationPlaceholder from '~/components/education/EducationPlaceholder.vue'
</script>
